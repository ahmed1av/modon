/**
 * Auth Me API Route
 * =================
 * Returns the current authenticated user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/dal/repositories/SupabaseUserRepository';
import { verifyToken } from '@/server/auth/jwt';
import { applySecurityHeaders } from '@/server/security/headers';

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get('modon_auth_token')?.value;

    if (!accessToken) {
        return NextResponse.json(
            { success: false, error: 'No active session' },
            { status: 401 }
        );
    }

    try {
        const payload = await verifyToken(accessToken);

        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        const user = await userRepository.findById(payload.userId);

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return applySecurityHeaders(
            NextResponse.json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                    role: user.role,
                    avatarUrl: user.profile.avatar,
                }
            })
        );
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
