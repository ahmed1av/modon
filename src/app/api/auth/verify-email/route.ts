/**
 * Email Verification API Route
 * ==============================
 * GET /api/auth/verify-email?token=<token>
 * Verifies user email with a secure token
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { applySecurityHeaders } from '@/server/security/headers';

const VerifyEmailSchema = z.object({
    token: z.string().uuid('Invalid verification token'),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        const validation = VerifyEmailSchema.safeParse({ token });

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid or missing verification token',
                    details: validation.error.issues.map(i => ({
                        field: i.path.join('.'),
                        message: i.message,
                    })),
                },
                { status: 400 }
            );
        }

        // In production: Verify token from DB, mark email as verified
        // TODO: Integrate with Supabase auth.verifyOtp() or custom verification table

        const response = NextResponse.json({
            success: true,
            message: 'Email verified successfully. You can now access all features.',
        });

        return applySecurityHeaders(response);

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'An error occurred during email verification.' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
