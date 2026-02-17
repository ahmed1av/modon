/**
 * MODON Platform - Rate Limiting (DiscoverX Gateway)
 * ===================================================
 * Token bucket + sliding window rate limiting
 */

import { NextResponse } from 'next/server';

// ============================================
// IN-MEMORY STORE (Development)
// Replace with Redis in production
// ============================================

interface RateLimitEntry {
    tokens: number;
    lastRefill: number;
    requests: number[];
}

const store = new Map<string, RateLimitEntry>();

// ============================================
// RATE LIMIT CONFIGURATIONS
// ============================================

interface RateLimitConfig {
    maxRequests: number;    // Max requests in window
    windowMs: number;       // Window size in ms
    tokensPerSecond: number; // Token refill rate
    maxTokens: number;      // Max token bucket size
}

const configs: Record<string, RateLimitConfig> = {
    api: {
        maxRequests: 100,
        windowMs: 60000, // 1 minute
        tokensPerSecond: 2,
        maxTokens: 100,
    },
    auth: {
        maxRequests: 5,
        windowMs: 60000, // 1 minute
        tokensPerSecond: 0.1,
        maxTokens: 5,
    },
    search: {
        maxRequests: 30,
        windowMs: 60000, // 1 minute
        tokensPerSecond: 0.5,
        maxTokens: 30,
    },
};

// ============================================
// RATE LIMITER
// ============================================

class RateLimiter {
    /**
     * Check and consume a token
     */
    check(
        identifier: string,
        type: keyof typeof configs = 'api'
    ): { allowed: boolean; remaining: number; reset: number; limit: number } {
        const config = configs[type];
        const now = Date.now();

        let entry = store.get(identifier);

        if (!entry) {
            // Create new entry
            entry = {
                tokens: config.maxTokens - 1, // Consume one token
                lastRefill: now,
                requests: [now],
            };
            store.set(identifier, entry);

            return {
                allowed: true,
                remaining: entry.tokens,
                reset: now + config.windowMs,
                limit: config.maxRequests,
            };
        }

        // Refill tokens based on time elapsed
        const elapsed = (now - entry.lastRefill) / 1000;
        const tokensToAdd = elapsed * config.tokensPerSecond;
        entry.tokens = Math.min(config.maxTokens, entry.tokens + tokensToAdd);
        entry.lastRefill = now;

        // Clean old requests from sliding window
        entry.requests = entry.requests.filter(t => t > now - config.windowMs);

        // Check sliding window limit
        if (entry.requests.length >= config.maxRequests) {
            const oldestRequest = entry.requests[0];
            const reset = oldestRequest + config.windowMs;

            return {
                allowed: false,
                remaining: 0,
                reset,
                limit: config.maxRequests,
            };
        }

        // Check token bucket
        if (entry.tokens < 1) {
            const reset = now + Math.ceil((1 - entry.tokens) / config.tokensPerSecond * 1000);

            return {
                allowed: false,
                remaining: 0,
                reset,
                limit: config.maxRequests,
            };
        }

        // Consume token and record request
        entry.tokens -= 1;
        entry.requests.push(now);

        return {
            allowed: true,
            remaining: Math.floor(entry.tokens),
            reset: now + config.windowMs,
            limit: config.maxRequests,
        };
    }

    /**
     * Reset rate limit for an identifier
     */
    reset(identifier: string): void {
        store.delete(identifier);
    }

    /**
     * Get current status without consuming
     */
    status(
        identifier: string,
        type: keyof typeof configs = 'api'
    ): { remaining: number; reset: number; limit: number } {
        const config = configs[type];
        const entry = store.get(identifier);

        if (!entry) {
            return {
                remaining: config.maxRequests,
                reset: Date.now() + config.windowMs,
                limit: config.maxRequests,
            };
        }

        return {
            remaining: Math.floor(entry.tokens),
            reset: Date.now() + config.windowMs,
            limit: config.maxRequests,
        };
    }
}

const rateLimiter = new RateLimiter();

// ============================================
// MIDDLEWARE
// ============================================

export async function rateLimitMiddleware(
    request: Request,
    type: keyof typeof configs = 'api'
): Promise<NextResponse | null> {
    const ip = getClientIp(request);
    const identifier = `${type}:${ip}`;

    const { allowed, remaining, reset, limit } = rateLimiter.check(identifier, type);

    if (!allowed) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);

        return new NextResponse(
            JSON.stringify({
                success: false,
                error: 'Too many requests',
                retryAfter,
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': reset.toString(),
                    'Retry-After': retryAfter.toString(),
                },
            }
        );
    }

    return null; // Allow request to proceed
}

// ============================================
// DDOS PROTECTION
// ============================================

interface DDoSEntry {
    count: number;
    firstRequest: number;
    blocked: boolean;
    blockedUntil?: number;
}

const ddosStore = new Map<string, DDoSEntry>();

const DDOS_CONFIG = {
    maxRequestsPerSecond: 50,
    windowMs: 1000,
    blockDurationMs: 3600000, // 1 hour
    burstThreshold: 100, // Requests in 1 second to trigger block
};

export async function ddosProtection(
    request: Request
): Promise<NextResponse | null> {
    const ip = getClientIp(request);
    const now = Date.now();

    let entry = ddosStore.get(ip);

    // Check if blocked
    if (entry?.blocked) {
        if (entry.blockedUntil && now < entry.blockedUntil) {
            const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);

            return new NextResponse(
                JSON.stringify({
                    success: false,
                    error: 'Access denied',
                }),
                {
                    status: 403,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': retryAfter.toString(),
                    },
                }
            );
        } else {
            // Unblock after duration
            entry.blocked = false;
            entry.count = 0;
            entry.firstRequest = now;
        }
    }

    if (!entry) {
        entry = {
            count: 1,
            firstRequest: now,
            blocked: false,
        };
        ddosStore.set(ip, entry);
        return null;
    }

    // Reset window if expired
    if (now - entry.firstRequest > DDOS_CONFIG.windowMs) {
        entry.count = 1;
        entry.firstRequest = now;
        return null;
    }

    entry.count++;

    // Check for burst
    if (entry.count > DDOS_CONFIG.burstThreshold) {
        entry.blocked = true;
        entry.blockedUntil = now + DDOS_CONFIG.blockDurationMs;

        console.warn(`[DDoS Protection] Blocked IP: ${ip} - ${entry.count} requests in ${DDOS_CONFIG.windowMs}ms`);

        return new NextResponse(
            JSON.stringify({
                success: false,
                error: 'Access denied',
            }),
            {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    // Check rate
    if (entry.count > DDOS_CONFIG.maxRequestsPerSecond) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                error: 'Too many requests',
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': '1',
                },
            }
        );
    }

    return null;
}

// ============================================
// HELPERS
// ============================================

function getClientIp(request: Request): string {
    // Try various headers for the real IP
    const headers = [
        'x-forwarded-for',
        'x-real-ip',
        'cf-connecting-ip', // Cloudflare
        'x-client-ip',
    ];

    for (const header of headers) {
        const value = request.headers.get(header);
        if (value) {
            // x-forwarded-for can contain multiple IPs, take the first
            return value.split(',')[0].trim();
        }
    }

    return 'anonymous';
}

// ============================================
// CLEANUP (Run periodically)
// ============================================

export function cleanupRateLimitStore(): void {
    const now = Date.now();
    const staleThreshold = 300000; // 5 minutes

    store.forEach((entry, key) => {
        if (now - entry.lastRefill > staleThreshold) {
            store.delete(key);
        }
    });

    ddosStore.forEach((entry, key) => {
        if (!entry.blocked && now - entry.firstRequest > staleThreshold) {
            ddosStore.delete(key);
        }
    });
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimitStore, 300000);
}

// ============================================
// EXPORTS
// ============================================

export { rateLimiter, configs as rateLimitConfigs };
