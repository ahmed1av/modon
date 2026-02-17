/**
 * MODON Platform - Security Headers (Server Layer)
 * =================================================
 * HTTP security headers for protection
 */

import { NextResponse } from 'next/server';

/**
 * Apply security headers to response
 */
export function securityHeaders(response: NextResponse): NextResponse {
    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: https: blob:",
            "media-src 'self' https: blob:",
            "connect-src 'self' https://api.modon.com wss: https://maps.googleapis.com https://www.google-analytics.com",
            "frame-src 'self' https://www.google.com https://maps.google.com",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "upgrade-insecure-requests",
        ].join('; ')
    );

    // Strict Transport Security (HSTS)
    // Enforce HTTPS for 1 year, include subdomains, enable preload
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );

    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // XSS Protection (legacy browsers)
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy (formerly Feature Policy)
    response.headers.set(
        'Permissions-Policy',
        [
            'camera=()',
            'microphone=()',
            'geolocation=(self)',
            'interest-cohort=()',
            'payment=(self)',
            'usb=()',
            'magnetometer=()',
            'gyroscope=()',
            'accelerometer=()',
        ].join(', ')
    );

    // Cross-Origin policies
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    // VULN-013 FIX: 'require-corp' blocks external resources (fonts, images) lacking CORP headers.
    // Changed to 'unsafe-none' to avoid breaking Google Fonts, Supabase images, Unsplash, etc.
    response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');

    // Remove server identification headers
    response.headers.delete('X-Powered-By');
    response.headers.delete('Server');

    return response;
}

/**
 * CORS configuration
 */
export function corsHeaders(
    request: Request,
    allowedOrigins: string[] = []
): Record<string, string> {
    const origin = request.headers.get('origin');

    // Default allowed origins
    const defaultOrigins = [
        'https://modon.com',
        'https://www.modon.com',
        'https://api.modon.com',
    ];

    // In development, allow localhost on port 1000
    if (process.env.NODE_ENV === 'development') {
        defaultOrigins.push('http://localhost:1000');
        defaultOrigins.push('http://127.0.0.1:1000');
    }

    const allowed = [...defaultOrigins, ...allowedOrigins];

    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-Id',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true',
    };

    if (origin && allowed.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }

    return headers;
}

/**
 * Cache control headers
 */
export function cacheHeaders(
    type: 'static' | 'dynamic' | 'api' | 'private'
): Record<string, string> {
    switch (type) {
        case 'static':
            return {
                'Cache-Control': 'public, max-age=31536000, immutable',
            };
        case 'dynamic':
            return {
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
            };
        case 'api':
            return {
                'Cache-Control': 'private, no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            };
        case 'private':
            return {
                'Cache-Control': 'private, max-age=0, must-revalidate',
            };
        default:
            return {};
    }
}

/**
 * Alias for securityHeaders (for backward compatibility)
 */
export const applySecurityHeaders = securityHeaders;
