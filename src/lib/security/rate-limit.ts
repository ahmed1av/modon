/**
 * In-Memory Rate Limiter
 * =======================
 * Simple rate limiting to prevent spam on public endpoints
 * 
 * CRITICAL SECURITY: Protects against:
 * - Form spam attacks
 * - Brute force attempts
 * - API abuse
 * 
 * PRODUCTION NOTE: This uses in-memory storage.
 * For multi-instance deployments, use Redis-based rate limiting (e.g., Upstash)
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// In-memory store: IP -> { count, resetAt }
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();

    for (const [ip, entry] of rateLimitStore.entries()) {
        if (now > entry.resetAt) {
            rateLimitStore.delete(ip);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    /**
     * Maximum number of requests allowed in the time window
     * @default 5
     */
    maxRequests?: number;

    /**
     * Time window in milliseconds
     * @default 3600000 (1 hour)
     */
    windowMs?: number;

    /**
     * Custom message to return when rate limit is exceeded
     */
    message?: string;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    message?: string;
}

/**
 * Check if request is within rate limit
 * 
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result with allowed status
 * 
 * @example
 * ```typescript
 * const result = checkRateLimit(ip, { maxRequests: 5, windowMs: 3600000 });
 * if (!result.allowed) {
 *   return NextResponse.json({ error: result.message }, { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = {}
): RateLimitResult {
    const maxRequests = config.maxRequests ?? 5;
    const windowMs = config.windowMs ?? 3600000; // 1 hour default
    const now = Date.now();

    // Get or create entry
    let entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetAt) {
        // Create new entry
        entry = {
            count: 1,
            resetAt: now + windowMs,
        };
        rateLimitStore.set(identifier, entry);

        return {
            allowed: true,
            remaining: maxRequests - 1,
            resetAt: entry.resetAt,
        };
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
        const timeUntilReset = Math.ceil((entry.resetAt - now) / 60000); // minutes

        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.resetAt,
            message: config.message ||
                `Rate limit exceeded. Please try again in ${timeUntilReset} minute${timeUntilReset !== 1 ? 's' : ''}.`,
        };
    }

    // Increment counter
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
        allowed: true,
        remaining: maxRequests - entry.count,
        resetAt: entry.resetAt,
    };
}

/**
 * Extract IP address from Next.js request
 * Handles various proxy scenarios (Vercel, Cloudflare, etc.)
 */
export function getClientIp(request: Request): string {
    const headers = request.headers;

    // Try common proxy headers
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        // x-forwarded-for can be comma-separated list
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Cloudflare
    const cfConnectingIp = headers.get('cf-connecting-ip');
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // Fallback to generic identifier
    return 'unknown-ip';
}

/**
 * Helper function to apply rate limiting to API routes
 * 
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await rateLimit(request, {
 *     maxRequests: 5,
 *     windowMs: 3600000,
 *   });
 * 
 *   if (!rateLimitResult.allowed) {
 *     return NextResponse.json(
 *       { error: rateLimitResult.message },
 *       { status: 429 }
 *     );
 *   }
 * 
 *   // Continue with request handling...
 * }
 * ```
 */
export async function rateLimit(
    request: Request,
    config: RateLimitConfig = {}
): Promise<RateLimitResult> {
    const ip = getClientIp(request);
    return checkRateLimit(ip, config);
}

/**
 * Get current rate limit status for debugging
 */
export function getRateLimitStatus(identifier: string): RateLimitEntry | null {
    return rateLimitStore.get(identifier) ?? null;
}

/**
 * Clear rate limit for an identifier (admin use only)
 */
export function clearRateLimit(identifier: string): void {
    rateLimitStore.delete(identifier);
}

/**
 * Get total number of tracked IPs (for monitoring)
 */
export function getRateLimitStoreSize(): number {
    return rateLimitStore.size;
}
