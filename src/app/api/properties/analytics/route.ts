/**
 * Properties Analytics API Route
 * ================================
 * GET /api/properties/analytics
 * Returns property statistics for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/server/auth/jwt';
import { applySecurityHeaders } from '@/server/security/headers';
import { mockStore } from '@/lib/mock-store';
import type { PropertyListItem } from '@/types';

// ============================================
// Authentication helper
// ============================================
async function authenticateAdmin(request: NextRequest) {
    const token = request.cookies.get('modon_auth_token')?.value;
    if (!token) return null;

    try {
        const payload = await verifyToken(token);
        if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}

// ============================================
// GET /api/properties/analytics
// ============================================
export async function GET(request: NextRequest) {
    const user = await authenticateAdmin(request);
    if (!user) {
        return NextResponse.json(
            { success: false, error: 'Admin authentication required' },
            { status: 401 }
        );
    }

    try {
        const properties = mockStore.getProperties() as PropertyListItem[];
        const leads = mockStore.getLeads();

        // Compute analytics
        const totalProperties = properties.length;

        // Type distribution
        const typeDistribution: Record<string, number> = {};
        properties.forEach((p) => {
            const pType = p.type || 'unknown';
            typeDistribution[pType] = (typeDistribution[pType] || 0) + 1;
        });

        // Status distribution
        const statusDistribution: Record<string, number> = {};
        properties.forEach((p) => {
            const pStatus = (p as PropertyListItem & { status?: string }).status || 'active';
            statusDistribution[pStatus] = (statusDistribution[pStatus] || 0) + 1;
        });

        // Price statistics
        const prices = properties
            .map((p) => p.price?.amount || 0)
            .filter((amount) => amount > 0);

        const avgPrice = prices.length > 0
            ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
            : 0;
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

        // Lead statistics
        const totalLeads = leads.length;
        const today = new Date().toDateString();
        const leadsToday = leads.filter(l => new Date(l.created_at).toDateString() === today).length;

        // Lead type distribution
        const leadTypeDistribution: Record<string, number> = {};
        leads.forEach(l => {
            leadTypeDistribution[l.type] = (leadTypeDistribution[l.type] || 0) + 1;
        });

        // Lead status distribution
        const leadStatusDistribution: Record<string, number> = {};
        leads.forEach(l => {
            leadStatusDistribution[l.status] = (leadStatusDistribution[l.status] || 0) + 1;
        });

        // City distribution
        const cityDistribution: Record<string, number> = {};
        properties.forEach((p) => {
            const city = p.location?.city || 'Unknown';
            cityDistribution[city] = (cityDistribution[city] || 0) + 1;
        });

        const response = NextResponse.json({
            success: true,
            data: {
                properties: {
                    total: totalProperties,
                    byType: typeDistribution,
                    byStatus: statusDistribution,
                    byCity: cityDistribution,
                    pricing: {
                        average: avgPrice,
                        min: minPrice,
                        max: maxPrice,
                        currency: 'EGP',
                    },
                },
                leads: {
                    total: totalLeads,
                    today: leadsToday,
                    byType: leadTypeDistribution,
                    byStatus: leadStatusDistribution,
                },
                generatedAt: new Date().toISOString(),
            },
        });

        return applySecurityHeaders(response);

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to generate analytics' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
