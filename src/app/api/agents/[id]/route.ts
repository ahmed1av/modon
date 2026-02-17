/**
 * Single Agent API Route Handler
 * ================================
 * GET /api/agents/[id] - Get agent by ID
 * Returns proper 404 when agent is not found
 */

import { NextRequest, NextResponse } from 'next/server';
import { applySecurityHeaders } from '@/server/security/headers';
import { getAgentById } from '@/data/mock-universe';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const startTime = Date.now();

    try {
        const { id } = await params;

        // Try to find agent
        const agent = getAgentById(id);

        // Return proper 404 if not found
        if (!agent) {
            const response = NextResponse.json({
                success: false,
                error: `Agent with ID "${id}" not found`,
                meta: {
                    duration: Date.now() - startTime,
                }
            }, { status: 404 });

            return applySecurityHeaders(response);
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

    } catch (error) {
        const response = NextResponse.json({
            success: false,
            error: 'Internal server error',
            meta: {
                duration: Date.now() - startTime,
            }
        }, { status: 500 });

        return applySecurityHeaders(response);
    }
}
