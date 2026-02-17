/**
 * Forgot Password API Route
 * ==========================
 * POST /api/auth/forgot-password
 * Sends a password reset token (simulated in mock mode)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { applySecurityHeaders } from '@/server/security/headers';
import { checkCSRF } from '@/lib/security/csrf';
import { rateLimit } from '@/lib/security/rate-limit';
import { sanitizeEmail } from '@/lib/sanitize';

const ForgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
    // Rate limiting (prevents email enumeration)
    const rateLimitResult = await rateLimit(request, {
        maxRequests: 3,
        windowMs: 900000, // 15 minutes
        message: 'Too many password reset requests. Please try again later.',
    });

    if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
            { success: false, error: rateLimitResult.message },
            {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString(),
                },
            }
        );
        return applySecurityHeaders(response);
    }

    // CSRF protection
    const csrfError = checkCSRF(request);
    if (csrfError) return csrfError;

    try {
        const body = await request.json();
        const validation = ForgotPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email address',
                    details: validation.error.issues.map(i => ({
                        field: i.path.join('.'),
                        message: i.message,
                    })),
                },
                { status: 400 }
            );
        }

        const email = sanitizeEmail(validation.data.email);
        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Generate a secure reset token
        const resetToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

        // In production: store token in DB and send email
        // For now, return success regardless to prevent email enumeration
        // TODO: Integrate with Supabase auth.resetPasswordForEmail() or custom email service

        const response = NextResponse.json({
            success: true,
            message: 'If an account with this email exists, a password reset link has been sent.',
            // DEV ONLY: expose token for testing (remove in production)
            ...(process.env.NODE_ENV === 'development' && {
                _dev: { resetToken, expiresAt: expiresAt.toISOString() }
            }),
        });

        return applySecurityHeaders(response);

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'An error occurred. Please try again.' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
