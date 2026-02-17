/**
 * MODON Platform - DiscoverX API Gateway
 * =======================================
 * Central entry point with rate limiting, auth, and routing
 */

import { NextRequest, NextResponse } from 'next/server';
import { serviceRegistry, ServiceClient } from '../registry/ServiceRegistry';
import { verifyToken } from '@/server/auth/jwt';
import { rateLimitMiddleware, ddosProtection } from './rateLimit';
import { securityHeaders } from '@/server/security/headers';
import { logSecurityEvent } from '../monitoring/logging';

// ============================================
// ROUTE CONFIGURATION
// ============================================

interface RouteConfig {
    service: string;
    pathPrefix: string;
    auth: boolean;
    rateLimit: 'api' | 'auth' | 'search';
    methods: string[];
    permissions?: string[];
}

const routes: RouteConfig[] = [
    // Property Routes
    {
        service: 'property-service',
        pathPrefix: '/api/v1/properties',
        auth: false, // Public read
        rateLimit: 'api',
        methods: ['GET'],
    },
    {
        service: 'property-service',
        pathPrefix: '/api/v1/properties',
        auth: true, // Protected write
        rateLimit: 'api',
        methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
        permissions: ['properties:create', 'properties:update', 'properties:delete'],
    },

    // Search Routes
    {
        service: 'search-service',
        pathPrefix: '/api/v1/search',
        auth: false,
        rateLimit: 'search',
        methods: ['GET', 'POST'],
    },

    // User Routes
    {
        service: 'user-service',
        pathPrefix: '/api/v1/users',
        auth: true,
        rateLimit: 'api',
        methods: ['GET', 'PUT', 'PATCH'],
        permissions: ['users:read', 'users:manage'],
    },

    // Auth Routes
    {
        service: 'user-service',
        pathPrefix: '/api/v1/auth',
        auth: false,
        rateLimit: 'auth',
        methods: ['POST'],
    },

    // Valuation Routes
    {
        service: 'valuation-service',
        pathPrefix: '/api/v1/valuation',
        auth: true,
        rateLimit: 'api',
        methods: ['GET', 'POST'],
    },

    // Inquiry Routes
    {
        service: 'property-service',
        pathPrefix: '/api/v1/inquiries',
        auth: false, // Public can submit
        rateLimit: 'api',
        methods: ['POST'],
    },
    {
        service: 'property-service',
        pathPrefix: '/api/v1/inquiries',
        auth: true, // Only agents can view
        rateLimit: 'api',
        methods: ['GET', 'PUT', 'DELETE'],
        permissions: ['inquiries:read', 'inquiries:manage'],
    },
];

// ============================================
// API GATEWAY
// ============================================

export class APIGateway {
    /**
     * Handle incoming request
     */
    async handle(request: NextRequest): Promise<NextResponse> {
        const startTime = Date.now();
        const path = request.nextUrl.pathname;
        const method = request.method;

        try {
            // 1. Apply security headers
            const response = await this.processRequest(request, path, method);

            // Add timing header
            response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);

            return securityHeaders(response);

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';

            logSecurityEvent({
                type: 'access_denied',
                severity: 'medium',
                ip: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || '',
                path,
                details: { error: message },
            });

            return NextResponse.json(
                { success: false, error: 'Internal server error' },
                { status: 500 }
            );
        }
    }

    private async processRequest(
        request: NextRequest,
        path: string,
        method: string
    ): Promise<NextResponse> {
        // 2. DDoS Protection
        const ddosResponse = await ddosProtection(request);
        if (ddosResponse) return ddosResponse;

        // 3. Find matching route
        const route = this.matchRoute(path, method);
        if (!route) {
            return NextResponse.json(
                { success: false, error: 'Not found' },
                { status: 404 }
            );
        }

        // 4. Rate limiting
        const rateLimitResponse = await rateLimitMiddleware(request, route.rateLimit);
        if (rateLimitResponse) return rateLimitResponse;

        // 5. Authentication
        if (route.auth) {
            const authResult = await this.authenticate(request);
            if (!authResult.authenticated) {
                return NextResponse.json(
                    { success: false, error: 'Unauthorized' },
                    { status: 401 }
                );
            }

            // 6. Authorization
            if (route.permissions?.length) {
                const hasPermission = route.permissions.some(p =>
                    authResult.user?.permissions?.includes(p)
                );

                if (!hasPermission && authResult.user?.role !== 'super_admin') {
                    return NextResponse.json(
                        { success: false, error: 'Forbidden' },
                        { status: 403 }
                    );
                }
            }
        }

        // 7. Route to service
        return await this.routeToService(request, route);
    }

    /**
     * Match request to route configuration
     */
    private matchRoute(path: string, method: string): RouteConfig | null {
        return routes.find(route =>
            path.startsWith(route.pathPrefix) &&
            route.methods.includes(method)
        ) || null;
    }

    /**
     * Authenticate request
     */
    private async authenticate(request: NextRequest): Promise<{
        authenticated: boolean;
        user?: {
            id: string;
            email: string;
            role: string;
            permissions?: string[];
        };
    }> {
        const authHeader = request.headers.get('authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return { authenticated: false };
        }

        const token = authHeader.substring(7);
        const payload = await verifyToken(token);

        if (!payload) {
            return { authenticated: false };
        }

        return {
            authenticated: true,
            user: {
                id: payload.userId,
                email: payload.email,
                role: payload.role,
                permissions: payload.permissions,
            },
        };
    }

    /**
     * Route request to backend service
     */
    private async routeToService(
        request: NextRequest,
        route: RouteConfig
    ): Promise<NextResponse> {
        const serviceUrl = serviceRegistry.getServiceUrl(
            route.service,
            request.nextUrl.pathname.replace(route.pathPrefix, '')
        );

        if (!serviceUrl) {
            // Fallback: Handle locally if no service instance
            return this.handleLocally(request, route);
        }

        try {
            const response = await fetch(serviceUrl, {
                method: request.method,
                headers: this.forwardHeaders(request),
                body: ['POST', 'PUT', 'PATCH'].includes(request.method)
                    ? await request.text()
                    : undefined,
                signal: AbortSignal.timeout(30000),
            });

            const data = await response.json();

            return NextResponse.json(data, {
                status: response.status,
                headers: this.responseHeaders(response),
            });

        } catch (error) {
            console.error(`[Gateway] Service error for ${route.service}:`, error);

            // Fallback to local handler
            return this.handleLocally(request, route);
        }
    }

    /**
     * Handle request locally (monolith mode)
     */
    private async handleLocally(
        request: NextRequest,
        route: RouteConfig
    ): Promise<NextResponse> {
        // Import local handlers dynamically
         
        const handlersModule = await import('@/app/api/handlers');
        const handlers = handlersModule as unknown as Record<string, ((req: NextRequest) => Promise<NextResponse>) | undefined>;

        const handlerKey = route.service.replace(/-/g, '_');
        const handler = handlers[handlerKey];
        if (handler && typeof handler === 'function') {
            return handler(request);
        }

        return NextResponse.json(
            { success: false, error: 'Service unavailable' },
            { status: 503 }
        );
    }

    /**
     * Forward headers to backend service
     */
    private forwardHeaders(request: NextRequest): HeadersInit {
        return {
            'Content-Type': request.headers.get('content-type') || 'application/json',
            'Accept': request.headers.get('accept') || 'application/json',
            'Accept-Language': request.headers.get('accept-language') || 'en',
            'X-Forwarded-For': request.headers.get('x-forwarded-for') || '',
            'X-Request-Id': request.headers.get('x-request-id') || crypto.randomUUID(),
            'Authorization': request.headers.get('authorization') || '',
        };
    }

    /**
     * Copy relevant response headers
     */
    private responseHeaders(response: Response): Record<string, string> {
        const headers: Record<string, string> = {};

        const copyHeaders = [
            'content-type',
            'cache-control',
            'x-request-id',
            'x-ratelimit-limit',
            'x-ratelimit-remaining',
            'x-ratelimit-reset',
        ];

        for (const header of copyHeaders) {
            const value = response.headers.get(header);
            if (value) {
                headers[header] = value;
            }
        }

        return headers;
    }
}

// Singleton
export const apiGateway = new APIGateway();

// ============================================
// NEXT.JS MIDDLEWARE INTEGRATION
// ============================================

export async function gatewayMiddleware(
    request: NextRequest
): Promise<NextResponse | null> {
    // Only handle API routes
    if (!request.nextUrl.pathname.startsWith('/api/')) {
        return null;
    }

    return apiGateway.handle(request);
}
