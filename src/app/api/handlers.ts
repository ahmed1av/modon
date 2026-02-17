/**
 * API Handlers - Local fallback handlers for gateway
 * ===================================================
 * These handlers are used when microservices are not available
 */

import { NextRequest, NextResponse } from 'next/server';

// Type for handler function
type Handler = (request: NextRequest) => Promise<NextResponse>;

// Service handlers map
const handlers: Record<string, Handler> = {
    // Property service handler
    property_service: async (request: NextRequest) => {
        // Redirect to the actual API routes
        const url = new URL(request.url);
        const path = url.pathname.replace('/api/v1', '/api');

        return NextResponse.json(
            { success: false, error: 'Service handler not implemented' },
            { status: 503 }
        );
    },

    // User service handler
    user_service: async (request: NextRequest) => {
        return NextResponse.json(
            { success: false, error: 'Service handler not implemented' },
            { status: 503 }
        );
    },

    // Search service handler
    search_service: async (request: NextRequest) => {
        return NextResponse.json(
            { success: false, error: 'Service handler not implemented' },
            { status: 503 }
        );
    },

    // Valuation service handler
    valuation_service: async (request: NextRequest) => {
        return NextResponse.json(
            { success: false, error: 'Service handler not implemented' },
            { status: 503 }
        );
    },
};

// Export handlers
export const property_service = handlers.property_service;
export const user_service = handlers.user_service;
export const search_service = handlers.search_service;
export const valuation_service = handlers.valuation_service;

// Default export for dynamic access
export default handlers;
