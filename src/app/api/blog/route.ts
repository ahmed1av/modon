/**
 * Blog API Route Handler
 * =======================
 * Provides blog posts data with mock fallback
 * 
 * Endpoints:
 *   GET /api/blog - List all blog posts
 *   GET /api/blog?featured=true - List featured posts
 *   GET /api/blog?category=investing - Filter by category
 */

import { NextRequest, NextResponse } from 'next/server';
import { applySecurityHeaders } from '@/server/security/headers';
import {
    MOCK_BLOG_POSTS,
    getBlogBySlug,
    getFeaturedBlogPosts,
    getBlogsByCategory
} from '@/data/mock-universe';

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured') === 'true';
        const category = searchParams.get('category');
        const slug = searchParams.get('slug');
        const limit = parseInt(searchParams.get('limit') || '10');
        const page = parseInt(searchParams.get('page') || '1');

        // Get single post by slug
        if (slug) {
            const post = getBlogBySlug(slug);
            if (!post) {
                // Anti-404: Return first post as fallback
                const fallbackPost = MOCK_BLOG_POSTS[0];
                const response = NextResponse.json({
                    success: true,
                    data: fallbackPost,
                    meta: {
                        duration: Date.now() - startTime,
                        source: 'mock_data',
                        notice: 'Requested post not found, showing featured content'
                    }
                });
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
        }

        let posts = [...MOCK_BLOG_POSTS];

        // Filter featured posts
        if (featured) {
            posts = getFeaturedBlogPosts();
        }

        // Filter by category
        if (category) {
            posts = getBlogsByCategory(category);
        }

        // Pagination
        const total = posts.length;
        const totalPages = Math.ceil(total / limit);
        const offset = (page - 1) * limit;
        posts = posts.slice(offset, offset + limit);

        const response = NextResponse.json({
            success: true,
            data: posts,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            meta: {
                duration: Date.now() - startTime,
                source: 'mock_data'
            }
        });

        return applySecurityHeaders(response);

    } catch (error) {
        console.error('[API] Blog error:', error);

        // Ultimate fallback
        const response = NextResponse.json({
            success: true,
            data: MOCK_BLOG_POSTS.slice(0, 6),
            pagination: {
                page: 1,
                limit: 6,
                total: MOCK_BLOG_POSTS.length,
                totalPages: Math.ceil(MOCK_BLOG_POSTS.length / 6),
                hasNext: true,
                hasPrev: false
            },
            meta: {
                duration: Date.now() - startTime,
                source: 'mock_data_fallback',
                warning: 'Using fallback mock data'
            }
        });

        return applySecurityHeaders(response);
    }
}
