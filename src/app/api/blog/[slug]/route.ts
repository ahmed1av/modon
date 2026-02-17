/**
 * Single Blog Post API Route Handler
 * ====================================
 * GET /api/blog/[slug] - Get blog post by slug
 * Returns proper 404 when blog post is not found
 */

import { NextRequest, NextResponse } from 'next/server';
import { applySecurityHeaders } from '@/server/security/headers';
import { getBlogBySlug } from '@/data/mock-universe';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const startTime = Date.now();

    try {
        const { slug } = await params;

        // Try to find blog post
        const post = getBlogBySlug(slug);

        // Return proper 404 if not found
        if (!post) {
            const response = NextResponse.json({
                success: false,
                error: `Blog post "${slug}" not found`,
                meta: {
                    duration: Date.now() - startTime,
                }
            }, { status: 404 });

            return applySecurityHeaders(response);
        }

        const response = NextResponse.json({
            success: true,
            data: post,
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
