/**
 * Agents API Route Handler
 * =========================
 * Provides agent data with mock fallback
 * 
 * Endpoints:
 *   GET /api/agents - List all agents
 *   GET /api/agents?featured=true - List featured agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { applySecurityHeaders } from '@/server/security/headers';
import {
    MOCK_AGENTS,
    getAgentById,
    getFeaturedAgents
} from '@/data/mock-universe';

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured') === 'true';
        const id = searchParams.get('id');
        const limit = parseInt(searchParams.get('limit') || '10');

        let agents = [...MOCK_AGENTS];

        // Get single agent by ID
        if (id) {
            const agent = getAgentById(id);
            if (!agent) {
                return NextResponse.json({
                    success: false,
                    error: 'Agent not found'
                }, { status: 404 });
            }

            const response = NextResponse.json({
                success: true,
                data: agent,
                meta: {
                    duration: Date.now() - startTime,
                    source: 'mock_data'
                }
            });

            return applySecurityHeaders(response);
        }

        // Filter featured agents
        if (featured) {
            agents = getFeaturedAgents();
        }

        // Apply limit
        agents = agents.slice(0, limit);

        const response = NextResponse.json({
            success: true,
            data: agents,
            pagination: {
                total: agents.length,
                limit
            },
            meta: {
                duration: Date.now() - startTime,
                source: 'mock_data'
            }
        });

        return applySecurityHeaders(response);

    } catch (error) {
        console.error('[API] Agents error:', error);

        // Ultimate fallback - return all mock agents
        const response = NextResponse.json({
            success: true,
            data: MOCK_AGENTS,
            meta: {
                duration: Date.now() - startTime,
                source: 'mock_data_fallback',
                warning: 'Using fallback mock data'
            }
        });

        return applySecurityHeaders(response);
    }
}
