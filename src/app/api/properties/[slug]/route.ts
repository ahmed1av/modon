/**
 * Single Property API Route (SECURED)
 * =====================================
 * GET, PUT, DELETE for a single property
 * PUT/DELETE require authentication and authorization
 */

import { NextRequest, NextResponse } from 'next/server';
import { propertyRepository } from '@/dal/repositories/SupabasePropertyRepository';
import { applySecurityHeaders } from '@/server/security/headers';
import { verifyToken, hasPermission } from '@/server/auth/jwt';
import { sanitizeInput, sanitizeObject } from '@/lib/sanitize';
import { checkCSRF } from '@/lib/security/csrf';

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// ============================================
// GET /api/properties/[slug]
// ============================================

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;

        // Detect if the param is a UUID or a slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        const property = isUUID
            ? await propertyRepository.findById(slug)
            : await propertyRepository.findBySlug(slug);

        if (!property) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Property not found',
                },
                { status: 404 }
            );
        }

        // Increment view count (fire and forget)
        propertyRepository.incrementViews(property.id);

        const response = NextResponse.json({
            success: true,
            data: property,
        });

        return applySecurityHeaders(response);

    } catch (error) {
        console.error('Error fetching property:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
            },
            { status: 500 }
        );
    }
}

// ============================================
// PUT /api/properties/[slug] (SECURED - CRITICAL FIX #5)
// ============================================

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        // CSRF protection for mutation endpoint (VULN-012 FIX)
        const csrfError = checkCSRF(request);
        if (csrfError) return csrfError;

        // CRITICAL: Verify authentication (VULN-009 FIX: corrected cookie name)
        const accessToken = request.cookies.get('modon_auth_token')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify token and extract user info
        const payload = await verifyToken(accessToken);

        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Check if user has permission to update properties
        const canUpdate = hasPermission(payload.permissions, 'properties:update');

        if (!canUpdate) {
            return NextResponse.json(
                { success: false, error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const { slug } = await params;
        const rawBody = await request.json();

        // Detect if the param is a UUID or a slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        const existing = isUUID
            ? await propertyRepository.findById(slug)
            : await propertyRepository.findBySlug(slug);

        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Property not found' },
                { status: 404 }
            );
        }

        // CRITICAL: Authorization - check ownership or admin role
        const isAdmin = payload.role === 'admin' || payload.role === 'super_admin';
        const isOwner = existing.agentId === payload.userId;

        if (!isAdmin && !isOwner) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Not authorized to modify this property. Only the property owner or admins can make changes.'
                },
                { status: 403 }
            );
        }

        // CRITICAL: Sanitize input before update (XSS prevention)
        const sanitizedData = {
            ...rawBody,
            title: rawBody.title ? sanitizeInput(rawBody.title) : undefined,
            titleAr: rawBody.titleAr ? sanitizeInput(rawBody.titleAr) : undefined,
            headline: rawBody.headline ? sanitizeInput(rawBody.headline) : undefined,
            description: rawBody.description ? sanitizeInput(rawBody.description, { maxLength: 5000 }) : undefined,
            descriptionAr: rawBody.descriptionAr ? sanitizeInput(rawBody.descriptionAr, { maxLength: 5000 }) : undefined,
        };

        // Update property
        const updated = await propertyRepository.update(existing.id, sanitizedData);

        console.info(`[API] Property updated: ${updated.slug} by ${payload.email}`);

        const response = NextResponse.json({
            success: true,
            data: updated,
        });

        return applySecurityHeaders(response);

    } catch (error) {
        // Log error server-side only (don't expose internals)
        if (process.env.NODE_ENV === 'development') {
            console.error('[API] Property update error:', error);
        } else {
            console.error('[API] Property update failed');
        }

        return NextResponse.json(
            { success: false, error: 'Failed to update property' },
            { status: 500 }
        );
    }
}

// ============================================
// DELETE /api/properties/[slug] (SECURED - CRITICAL FIX #5)
// ============================================

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        // CSRF protection for mutation endpoint (VULN-012 FIX)
        const csrfError = checkCSRF(request);
        if (csrfError) return csrfError;

        // CRITICAL: Verify authentication (VULN-009 FIX: corrected cookie name)
        const accessToken = request.cookies.get('modon_auth_token')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify token and extract user info
        const payload = await verifyToken(accessToken);

        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Check if user has permission to delete properties
        const canDelete = hasPermission(payload.permissions, 'properties:delete');

        if (!canDelete) {
            return NextResponse.json(
                { success: false, error: 'Insufficient permissions. Only admins can delete properties.' },
                { status: 403 }
            );
        }

        const { slug } = await params;

        // Detect if the param is a UUID or a slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        const existing = isUUID
            ? await propertyRepository.findById(slug)
            : await propertyRepository.findBySlug(slug);

        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Property not found' },
                { status: 404 }
            );
        }

        // CRITICAL: Authorization - check ownership or admin role (VULN-005 FIX)
        const isAdmin = payload.role === 'admin' || payload.role === 'super_admin';
        const isOwner = existing.agentId === payload.userId;

        if (!isAdmin && !isOwner) {
            return NextResponse.json(
                { success: false, error: 'Not authorized to delete this property' },
                { status: 403 }
            );
        }

        // Delete property
        await propertyRepository.delete(existing.id);


        console.warn(`[API] Property deleted: ${existing.slug} by ${payload.email} (${payload.role})`);

        const response = NextResponse.json({
            success: true,
            message: 'Property deleted successfully',
        });

        return applySecurityHeaders(response);

    } catch (error) {
        // Log error server-side only (don't expose internals)
        if (process.env.NODE_ENV === 'development') {
            console.error('[API] Property delete error:', error);
        } else {
            console.error('[API] Property delete failed');
        }

        return NextResponse.json(
            { success: false, error: 'Failed to delete property' },
            { status: 500 }
        );
    }
}
