// ============================================
// LOGOUT API ROUTE - SECURITY HARDENED
// Properly invalidates admin sessions by clearing HttpOnly cookies
// CSRF protection enforced to prevent forced logout attacks
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { checkCSRF } from '@/lib/security/csrf';

export async function POST(request: NextRequest) {
    // ============================================
    // CSRF PROTECTION (Prevents forced logout attacks)
    // ============================================
    const csrfError = checkCSRF(request);
    if (csrfError) return csrfError;

    try {
        const response = NextResponse.json(
            {
                success: true,
                message: 'Logged out successfully',
            },
            { status: 200 }
        );

        // Clear the access token cookie
        response.cookies.set('modon_auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 0, // Expire immediately
            expires: new Date(0),
        });

        // Clear the refresh token cookie
        response.cookies.set('modon_refresh_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 0,
            expires: new Date(0),
        });

        // Set cache-control to prevent caching the logout response
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');

        return response;
    } catch (_error) {
        // Even if something fails, try to clear cookies
        const response = NextResponse.json(
            {
                success: false,
                error: 'Logout failed, but cookies have been cleared',
            },
            { status: 500 }
        );

        response.cookies.set('modon_auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 0,
            expires: new Date(0),
        });

        response.cookies.set('modon_refresh_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 0,
            expires: new Date(0),
        });

        return response;
    }
}

// Prevent caching of this endpoint
export const dynamic = 'force-dynamic';
