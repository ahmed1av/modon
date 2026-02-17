/**
 * CSRF Protection Utility
 * =======================
 * Validates request origin to prevent Cross-Site Request Forgery attacks
 */

import { NextRequest } from 'next/server';

/**
 * Allowed origins for CSRF protection
 * In production, set via NEXT_PUBLIC_ALLOWED_ORIGINS environment variable
 */
const getAllowedOrigins = (): string[] => {
    const envOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS;

    if (envOrigins) {
        return envOrigins.split(',').map(origin => origin.trim());
    }

    // Default fallback for development
    if (process.env.NODE_ENV === 'development') {
        return [
            'http://localhost:1000',
            'http://127.0.0.1:1000',
        ];
    }

    // Production: Must be explicitly set!
    return [];
};

/**
 * Validates that the request origin matches allowed origins
 * 
 * @param request - Next.js request object
 * @returns true if origin is valid, false otherwise
 */
export function validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    const allowedOrigins = getAllowedOrigins();

    // If no allowed origins configured in production, reject
    if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
        console.warn('[CSRF] No allowed origins configured in production!');
        return false;
    }

    // Check Origin header (primary method)
    if (origin) {
        const isAllowed = allowedOrigins.some(allowed => {
            // Handle both with and without protocol
            const normalizedOrigin = origin.replace(/^https?:\/\//, '');
            const normalizedAllowed = allowed.replace(/^https?:\/\//, '');
            return normalizedOrigin === normalizedAllowed;
        });

        if (isAllowed) {
            return true;
        }
    }

    // Fallback: Check Referer header
    if (referer) {
        const isAllowed = allowedOrigins.some(allowed => {
            const normalizedAllowed = allowed.replace(/^https?:\/\//, '');
            return referer.includes(normalizedAllowed);
        });

        if (isAllowed) {
            return true;
        }
    }

    // Fallback: Check Host header (same-origin)
    if (host) {
        const isAllowed = allowedOrigins.some(allowed => {
            const normalizedAllowed = allowed.replace(/^https?:\/\//, '');
            return host === normalizedAllowed;
        });

        if (isAllowed) {
            return true;
        }
    }

    // Log failed validation for security monitoring
    console.warn('[CSRF] Origin validation failed', {
        origin,
        referer,
        host,
        allowedOrigins,
    });

    return false;
}

/**
 * Middleware-style CSRF check
 * Returns an error response if origin is invalid
 * 
 * Usage in API routes:
 * ```typescript
 * const csrfError = checkCSRF(request);
 * if (csrfError) return csrfError;
 * ```
 */
export function checkCSRF(request: NextRequest): Response | null {
    if (!validateOrigin(request)) {
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Invalid origin. CSRF protection triggered.',
            }),
            {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    return null;
}

/**
 * Get CORS headers for API responses
 * Ensures only allowed origins can make requests
 */
export function getCORSHeaders(request: NextRequest): HeadersInit {
    const origin = request.headers.get('origin');
    const allowedOrigins = getAllowedOrigins();

    // Check if origin is allowed
    const isAllowed = origin && allowedOrigins.some(allowed => {
        const normalizedOrigin = origin.replace(/^https?:\/\//, '');
        const normalizedAllowed = allowed.replace(/^https?:\/\//, '');
        return normalizedOrigin === normalizedAllowed;
    });

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (isAllowed && origin) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        headers['Access-Control-Allow-Credentials'] = 'true';
    }

    return headers;
}
