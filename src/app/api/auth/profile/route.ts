/**
 * User Profile API Route
 * ========================
 * GET  /api/auth/profile - Get current user profile
 * PUT  /api/auth/profile - Update user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken } from '@/server/auth/jwt';
import { applySecurityHeaders } from '@/server/security/headers';
import { checkCSRF } from '@/lib/security/csrf';
import { sanitizeInput } from '@/lib/sanitize';

const UpdateProfileSchema = z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
    language: z.enum(['en', 'ar']).optional(),
    notifications: z.object({
        email: z.boolean().optional(),
        sms: z.boolean().optional(),
        push: z.boolean().optional(),
    }).optional(),
});

// ============================================
// Authentication helper
// ============================================
async function authenticateRequest(request: NextRequest) {
    const token = request.cookies.get('modon_auth_token')?.value;
    if (!token) return null;

    try {
        return await verifyToken(token);
    } catch {
        return null;
    }
}

// ============================================
// GET /api/auth/profile
// ============================================
export async function GET(request: NextRequest) {
    const user = await authenticateRequest(request);
    if (!user) {
        return NextResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 }
        );
    }

    // In production: fetch full profile from DB
    // For now, return the JWT payload data
    const response = NextResponse.json({
        success: true,
        data: {
            userId: user.userId,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
        },
    });

    return applySecurityHeaders(response);
}

// ============================================
// PUT /api/auth/profile
// ============================================
export async function PUT(request: NextRequest) {
    // CSRF protection
    const csrfError = checkCSRF(request);
    if (csrfError) return csrfError;

    const user = await authenticateRequest(request);
    if (!user) {
        return NextResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const validation = UpdateProfileSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    details: validation.error.issues.map(i => ({
                        field: i.path.join('.'),
                        message: i.message,
                    })),
                },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Sanitize string fields
        const updates: Record<string, unknown> = {};
        if (data.firstName) updates.firstName = sanitizeInput(data.firstName, { maxLength: 100 });
        if (data.lastName) updates.lastName = sanitizeInput(data.lastName, { maxLength: 100 });
        if (data.phone) updates.phone = data.phone;
        if (data.language) updates.language = data.language;
        if (data.notifications) updates.notifications = data.notifications;

        // In production: update user in DB via Supabase
        // TODO: Integrate with user repository

        const response = NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                userId: user.userId,
                ...updates,
            },
        });

        return applySecurityHeaders(response);

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
