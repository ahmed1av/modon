import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/server/auth/jwt';

const defaultLocale = 'en';
const locales = ['en', 'ar'];

/**
 * Get locale from headers or cookies
 */
function getLocale(request: NextRequest): string {
    // Check cookie first
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && locales.includes(cookieLocale)) {
        return cookieLocale;
    }

    // Check Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        const langCodes = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
        for (const langCode of langCodes) {
            const lang = langCode.split('-')[0];
            if (locales.includes(lang)) {
                return lang;
            }
        }
    }

    return defaultLocale;
}

/**
 * Main Middleware with Security Hardening
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ============================================
    // SECURITY: ADMIN ROUTE PROTECTION (CRITICAL FIX #4)
    // ============================================
    const isAdminRoute = pathname.startsWith('/admin') || locales.some(locale => pathname.startsWith(`/${locale}/admin`));

    if (isAdminRoute) {
        const accessToken = request.cookies.get('modon_auth_token')?.value;

        const getLoginUrl = () => {
            const pathLocale = locales.find(l => pathname.startsWith(`/${l}/`));
            if (pathLocale) {
                return new URL(`/${pathLocale}/login`, request.url);
            }
            // If no locale in path, getLocale might return a default or cookie-based one.
            // But if we are at /admin, we might want to let the i18n logic at the bottom handle the locale injection...
            // However, we are redirecting to /login vs /[lang]/login.
            // If we redirect to /login, the middleware will catch it again and add locale.
            // But if we can do it in one go, it's better.
            const detected = getLocale(request);
            return new URL(`/${detected}/login`, request.url);
        };

        // No token = immediate redirect to login
        if (!accessToken) {
            return NextResponse.redirect(getLoginUrl());
        }

        // CRITICAL: Verify JWT signature and expiration
        try {
            const payload = await verifyToken(accessToken);

            // Token invalid or expired
            if (!payload) {
                const response = NextResponse.redirect(getLoginUrl());
                // Clear invalid token
                response.cookies.delete('modon_auth_token');
                return response;
            }

            // Check role (super_admin or admin)
            const userRole = payload.role;
            if (userRole !== 'super_admin' && userRole !== 'admin') {
                return NextResponse.redirect(getLoginUrl());
            }

            // Valid admin - proceed to locale check or page
            // We don't return NextResponse.next() here because we still need to handle i18n
        } catch (err) {
            console.error('[Security] Token verification error:', err);
            const response = NextResponse.redirect(getLoginUrl());
            response.cookies.delete('modon_auth_token');
            return response;
        }
    }

    // ============================================
    // ENFORCE HTTPS IN PRODUCTION (CRITICAL FIX - WARNING #22)
    // ============================================
    if (process.env.NODE_ENV === 'production') {
        const protocol = request.headers.get('x-forwarded-proto');
        if (protocol !== 'https') {
            const httpsUrl = new URL(request.url);
            httpsUrl.protocol = 'https:';
            return NextResponse.redirect(httpsUrl, 301);
        }
    }

    // ============================================
    // i18n HANDLING
    // ============================================

    // Check if the pathname starts with a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // If the pathname already includes a locale, continue
    if (pathnameHasLocale) {
        return NextResponse.next();
    }

    // If the pathname doesn't have a locale, detect and redirect
    const locale = getLocale(request);

    // Redirect to the detected locale
    const newPathname = `/${locale}${pathname}`;
    const newUrl = new URL(newPathname, request.url);

    // Preserve search params
    newUrl.search = request.nextUrl.search;

    const response = NextResponse.redirect(newUrl);

    // Set the locale cookie for future requests
    response.cookies.set('NEXT_LOCALE', locale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });

    return response;
}

export const config = {
    // Match all pathnames except API routes, Next.js internals, and static files
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
