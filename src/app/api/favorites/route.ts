/**
 * Favorites API Route
 * ===================
 * Manages user favorite properties with authentication and validation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/server/auth/jwt';
import { applySecurityHeaders } from '@/server/security/headers';
import { checkCSRF } from '@/lib/security/csrf';
import { mockStore } from '@/lib/mock-store';

// ============================================
// SUPABASE CLIENT (Service Role for Admin Access)
// ============================================

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
    if (!supabaseInstance) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        // VULN-010 FIX: Service role key required for accessing user_favorites securely
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        // Check for placeholder credentials
        const isPlaceholder = !url || !key || url.includes('your-project-id');

        if (isPlaceholder) {
            console.warn('⚠️ [API/Favorites] Supabase credentials missing/invalid. Activating MOCK SIMULATION MODE.');
            return null;
        }

        try {
            supabaseInstance = createClient(url!, key!, {
                auth: { persistSession: false }
            });
        } catch (e) {
            console.warn('⚠️ [API/Favorites] Client init failed. Fallback active.');
            return null;
        }
    }
    return supabaseInstance;
}

// ============================================
// AUTHENTICATION HELPER
// ============================================

async function getAuthenticatedUser(request: NextRequest) {
    const accessToken = request.cookies.get('modon_auth_token')?.value;
    if (!accessToken) return null;

    try {
        const payload = await verifyToken(accessToken);
        return payload;
    } catch (error) {
        return null;
    }
}

// ============================================
// GET /api/favorites - Fetch user's favorites
// ============================================

export async function GET(request: NextRequest) {
    const user = await getAuthenticatedUser(request);

    if (!user) {
        return NextResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 }
        );
    }

    try {
        const supabase = getSupabase();

        if (!supabase) {
            // MOCK MODE
            const favorites = mockStore.getFavorites(user.userId);
            return applySecurityHeaders(
                NextResponse.json({ success: true, data: favorites })
            );
        }

        // Fetch favorite property IDs for the user
        const { data, error } = await supabase
            .from('user_favorites')
            .select('property_id')
            .eq('user_id', user.userId);

        if (error) throw error;

        const propertyIds = (data as any[] || []).map(item => item.property_id);

        return applySecurityHeaders(
            NextResponse.json({ success: true, data: propertyIds })
        );
    } catch (error) {
        console.error('Error fetching favorites:', error);

        // Fallback for unexpected errors in real mode
        if (process.env.NODE_ENV === 'development') {
            const favorites = mockStore.getFavorites(user.userId);
            return applySecurityHeaders(
                NextResponse.json({ success: true, data: favorites })
            );
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// POST /api/favorites - Add property to favorites
// ============================================

export async function POST(request: NextRequest) {
    // CSRF Protection (CRITICAL FOR POST)
    const csrfError = await checkCSRF(request);
    if (csrfError) return csrfError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
        return NextResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 }
        );
    }

    let propertyId: string | undefined;

    try {
        const body = await request.json();
        propertyId = body.propertyId;

        if (!propertyId || typeof propertyId !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Invalid property ID' },
                { status: 400 }
            );
        }

        const supabase = getSupabase();

        if (!supabase) {
            // MOCK MODE
            mockStore.addFavorite(user.userId, propertyId);
            return applySecurityHeaders(
                NextResponse.json({ success: true, message: 'Property added to favorites (Mock)' })
            );
        }

        // Duplicate prevention is handled by UNIQUE constraint in DB,
        // points to. Explicitly cast to any to avoid "never" type issues with dynamic schema.
        const { error } = await (supabase.from('user_favorites') as any)
            .upsert(
                { user_id: user.userId, property_id: propertyId },
                { onConflict: 'user_id,property_id' }
            );

        if (error) throw error;

        return applySecurityHeaders(
            NextResponse.json({ success: true, message: 'Property added to favorites' })
        );
    } catch (error) {
        console.error('Error adding favorite:', error);

        // Fallback check
        if (process.env.NODE_ENV === 'development' && propertyId) {
            mockStore.addFavorite(user.userId, propertyId);
            return applySecurityHeaders(
                NextResponse.json({ success: true, message: 'Property added to favorites (Mock Fallback)' })
            );
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// DELETE /api/favorites - Remove from favorites
// ============================================

export async function DELETE(request: NextRequest) {
    // CSRF Protection
    const csrfError = await checkCSRF(request);
    if (csrfError) return csrfError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
        return NextResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
        return NextResponse.json(
            { success: false, error: 'Property ID required' },
            { status: 400 }
        );
    }

    try {
        const supabase = getSupabase();

        if (!supabase) {
            // MOCK MODE
            mockStore.removeFavorite(user.userId, propertyId);
            return applySecurityHeaders(
                NextResponse.json({ success: true, message: 'Property removed from favorites (Mock)' })
            );
        }

        const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.userId)
            .eq('property_id', propertyId);

        if (error) throw error;

        return applySecurityHeaders(
            NextResponse.json({ success: true, message: 'Property removed from favorites' })
        );
    } catch (error) {
        console.error('Error removing favorite:', error);

        if (process.env.NODE_ENV === 'development') {
            mockStore.removeFavorite(user.userId, propertyId);
            return applySecurityHeaders(
                NextResponse.json({ success: true, message: 'Property removed from favorites (Mock Fallback)' })
            );
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
