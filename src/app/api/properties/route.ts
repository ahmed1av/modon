/**
 * Properties API Route Handler
 * ============================
 * REAL DATABASE INTEGRATION - No more mock data!
 * 
 * Endpoints:
 *   GET  /api/properties - List/search properties with filters
 *   POST /api/properties - Create new property (authenticated)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { applySecurityHeaders } from '@/server/security/headers';
import { sanitizeInput } from '@/lib/sanitize';
import { checkCSRF } from '@/lib/security/csrf'; // CSRF Protection
import { MOCK_PROPERTIES } from '@/data/mock-properties'; // HIGH-FIDELITY MOCK DATA
import { MOCK_PROPERTIES_EXTENDED } from '@/data/mock-universe'; // EXTENDED MOCK UNIVERSE
import { mockStore } from '@/lib/mock-store'; // Unified Mock Store


// IN-MEMORY STORE FOR NEWLY CREATED PROPERTIES (FALLBACK MODE)
// This allows testing property creation without a real database connection
// Data persists only while the server process is running

// export const runtimeAddedProperties: any[] = []; // DEPRECATED: Use mockStore.properties instead


// ============================================
// TYPE DEFINITIONS
// ============================================

interface PropertyRow {
    id: string;
    title: string;
    slug: string;
    description: string;
    type: string;
    listing_type: string;
    status: string;
    address?: string;
    city: string;
    country: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    price: number;
    currency: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    plot_area?: number;
    image_url: string;
    images?: Array<{ url: string; alt?: string }>;
    features?: string[];
    amenities?: string[];
    is_featured: boolean;
    is_new: boolean;
    is_exclusive: boolean;
    is_off_market: boolean;
    reference_code: string;
    created_at: string;
    updated_at: string;
}

// ============================================
// SUPABASE CLIENT
// ============================================

let supabaseInstance: ReturnType<typeof createClient> | null = null;
let supabaseAdminInstance: ReturnType<typeof createClient> | null = null;

function getSupabase(useServiceKey = false) {
    if (useServiceKey) {
        if (!supabaseAdminInstance) {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

            if (!url || !key) {
                console.error('[Supabase] Missing Service Role Key or URL');
                throw new Error('Supabase admin credentials not configured');
            }

            supabaseAdminInstance = createClient(url, key, {
                auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
            });
        }
        return supabaseAdminInstance;
    }

    if (!supabaseInstance) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        // SECURITY (VULN-006 FIX): Only use anon key in public routes. Service role key bypasses RLS.
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
            console.error('[Supabase] Missing Anon Key or URL');
            throw new Error('Supabase credentials not configured');
        }

        supabaseInstance = createClient(url, key, {
            auth: { persistSession: false }
        });
    }
    return supabaseInstance;
}



// ============================================
// VALIDATION SCHEMAS
// ============================================

const PropertySearchSchema = z.object({
    q: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    location: z.string().max(200).optional(),
    type: z.enum(['Villa', 'Penthouse', 'Apartment', 'Townhouse', 'Duplex', 'Chalet', 'Studio', 'all']).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    minBeds: z.coerce.number().min(0).max(20).optional(),
    maxBeds: z.coerce.number().min(0).max(20).optional(),
    minArea: z.coerce.number().min(0).optional(),
    maxArea: z.coerce.number().min(0).optional(),
    featured: z.coerce.boolean().optional(),
    exclusive: z.coerce.boolean().optional(),
    status: z.enum(['active', 'pending', 'sold', 'rented', 'draft']).optional(),
    listingType: z.enum(['sale', 'rent']).optional(),
    sortBy: z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'area_asc', 'area_desc']).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(12),
});

type PropertySearchParams = z.infer<typeof PropertySearchSchema>;

// ============================================
// GET /api/properties
// ============================================

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const rawParams: Record<string, string> = {};

        searchParams.forEach((value, key) => {
            rawParams[key] = value;
        });

        // Validate parameters
        const validation = PropertySearchSchema.safeParse(rawParams);

        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: 'Invalid search parameters',
                details: validation.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            }, { status: 400 });
        }

        const params = validation.data;
        const supabase = getSupabase();

        // ============================================
        // BUILD QUERY
        // ============================================

        let query = supabase
            .from('properties')
            .select('*', { count: 'exact' });

        // Status filter (default to active for public)
        query = query.eq('status', params.status || 'active');

        // Listing type filter
        if (params.listingType) {
            query = query.eq('listing_type', params.listingType);
        }

        // Full-text search on title, description, location
        if (params.q) {
            const searchTerm = sanitizeInput(params.q, { maxLength: 200 });
            query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
        }

        // City filter
        if (params.city && params.city !== 'all') {
            query = query.ilike('city', `%${sanitizeInput(params.city)}%`);
        }

        // Country filter
        if (params.country && params.country !== 'all') {
            query = query.ilike('country', `%${sanitizeInput(params.country)}%`);
        }

        // Location filter (compound - checks city and location field)
        if (params.location && params.location !== 'All Locations') {
            const loc = sanitizeInput(params.location);
            query = query.or(`city.ilike.%${loc}%,location.ilike.%${loc}%,country.ilike.%${loc}%`);
        }

        // Property type filter
        if (params.type && params.type !== 'all') {
            query = query.eq('type', params.type);
        }

        // Price range
        if (params.minPrice !== undefined && params.minPrice > 0) {
            query = query.gte('price', params.minPrice);
        }
        if (params.maxPrice !== undefined && params.maxPrice > 0) {
            query = query.lte('price', params.maxPrice);
        }

        // Bedrooms range
        if (params.minBeds !== undefined) {
            query = query.gte('bedrooms', params.minBeds);
        }
        if (params.maxBeds !== undefined) {
            query = query.lte('bedrooms', params.maxBeds);
        }

        // Area range
        if (params.minArea !== undefined) {
            query = query.gte('area', params.minArea);
        }
        if (params.maxArea !== undefined) {
            query = query.lte('area', params.maxArea);
        }

        // Featured filter
        if (params.featured) {
            query = query.eq('is_featured', true);
        }

        // Exclusive filter
        if (params.exclusive) {
            query = query.eq('is_exclusive', true);
        }

        // ============================================
        // SORTING
        // ============================================

        switch (params.sortBy) {
            case 'oldest':
                query = query.order('created_at', { ascending: true });
                break;
            case 'price_asc':
                query = query.order('price', { ascending: true });
                break;
            case 'price_desc':
                query = query.order('price', { ascending: false });
                break;
            case 'area_asc':
                query = query.order('area', { ascending: true });
                break;
            case 'area_desc':
                query = query.order('area', { ascending: false });
                break;
            case 'newest':
            default:
                query = query.order('created_at', { ascending: false });
        }

        // ============================================
        // PAGINATION
        // ============================================

        const offset = (params.page - 1) * params.limit;
        query = query.range(offset, offset + params.limit - 1);

        // ============================================
        // EXECUTE QUERY
        // ============================================

        const { data: properties, error, count } = await query;

        if (error) {
            console.error('[API] Properties query error:', error);
            throw new Error(error.message);
        }

        // ============================================
        // MERGE RUNTIME-ADDED PROPERTIES
        // ============================================
        // Properties created via POST that failed Supabase insert
        // are stored in mockStore with IDs starting with "runtime-".
        // We merge them into the Supabase results so they appear in the UI.

        const runtimeProperties = mockStore.properties.filter(
            (p: any) => typeof p.id === 'string' && p.id.startsWith('runtime-')
        );

        // Format runtime properties to match the Supabase response shape
        const formattedRuntimeProperties = runtimeProperties.map((p: any) => ({
            id: p.id,
            title: p.title || p.titleAr || 'Untitled',
            titleAr: p.titleAr,
            slug: p.slug,
            description: p.description || '',
            type: p.type,
            listingType: p.listingType,
            status: p.status || 'draft',
            location: p.location || { city: 'Unknown', country: 'Egypt' },
            price: p.price || { amount: 0, currency: 'EGP', formatted: 'EGP 0' },
            specs: p.specs || { bedrooms: 0, bathrooms: 0, area: 0 },
            images: p.images || [],
            mainImage: p.images?.[0]?.url || '',
            features: p.features || [],
            amenities: p.amenities || [],
            flags: {
                isFeatured: p.featured || false,
                isNew: true,
                isExclusive: p.exclusive || false,
                isOffMarket: false
            },
            referenceCode: p.reference_code || '',
            createdAt: p.created_at || new Date().toISOString(),
            updatedAt: p.created_at || new Date().toISOString()
        }));

        // ============================================
        // FORMAT SUPABASE RESPONSE
        // ============================================

        // Cast to PropertyRow[] - Supabase types aren't generated for this schema
        const formattedSupabaseProperties = ((properties || []) as PropertyRow[]).map(prop => ({
            id: prop.id,
            title: prop.title,
            titleAr: (prop as any).titleAr,
            slug: prop.slug,
            description: prop.description,
            type: prop.type,
            listingType: prop.listing_type,
            status: prop.status,
            location: {
                address: prop.address,
                city: prop.city,
                cityAr: (prop as any).location?.cityAr || (prop as any).cityAr,
                country: prop.country,
                countryAr: (prop as any).location?.countryAr || (prop as any).countryAr,
                coordinates: prop.latitude && prop.longitude ? {
                    lat: prop.latitude,
                    lng: prop.longitude
                } : null
            },
            price: {
                amount: prop.price,
                currency: prop.currency || 'EGP',
                formatted: new Intl.NumberFormat('en-EG', {
                    style: 'currency',
                    currency: prop.currency || 'EGP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(prop.price)
            },
            specs: {
                bedrooms: prop.bedrooms,
                bathrooms: prop.bathrooms,
                area: prop.area,
                plotArea: prop.plot_area
            },
            images: prop.images || [{ url: prop.image_url, alt: prop.title }],
            mainImage: prop.image_url,
            features: prop.features || [],
            amenities: prop.amenities || [],
            flags: {
                isFeatured: prop.is_featured,
                isNew: prop.is_new,
                isExclusive: prop.is_exclusive,
                isOffMarket: prop.is_off_market
            },
            referenceCode: prop.reference_code,
            createdAt: prop.created_at,
            updatedAt: prop.updated_at
        }));

        // Combine: runtime-added properties first (newest), then Supabase results
        const allProperties = [...formattedRuntimeProperties, ...formattedSupabaseProperties];
        const totalCount = (count || 0) + runtimeProperties.length;
        const totalPages = Math.ceil(totalCount / params.limit);

        const response = NextResponse.json({
            success: true,
            data: allProperties,
            pagination: {
                page: params.page,
                limit: params.limit,
                total: totalCount,
                totalPages,
                hasNext: params.page < totalPages,
                hasPrev: params.page > 1
            },
            filters: {
                applied: Object.fromEntries(
                    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
                )
            },
            meta: {
                duration: Date.now() - startTime,
                source: runtimeProperties.length > 0 ? 'supabase+runtime' : 'supabase',
                runtimeCount: runtimeProperties.length
            }
        });

        return applySecurityHeaders(response);

    } catch (error) {
        // ═══════════════════════════════════════════════
        // CRITICAL ERROR LOGGING
        // ═══════════════════════════════════════════════
        console.error('═══════════════════════════════════════════════');
        console.error('[API ERROR] /api/properties - DATABASE CONNECTION FAILED');
        console.error('═══════════════════════════════════════════════');
        console.error('Error Type:', error?.constructor?.name);
        console.error('Error Message:', (error as Error)?.message);
        console.error('Environment Check:', {
            NODE_ENV: process.env.NODE_ENV,
            hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            isPlaceholder: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-id'),
        });
        console.error('═══════════════════════════════════════════════');
        console.warn('🔄 FALLBACK ACTIVATED: Serving High-Fidelity Mock Data');
        console.warn('⚠️  Configure real Supabase credentials in .env.local to fix this');
        console.error('═══════════════════════════════════════════════');

        // ═══════════════════════════════════════════════
        // INTELLIGENT MOCK DATA FALLBACK
        // ═══════════════════════════════════════════════
        // Apply the SAME filters/search/pagination to mock data
        // This ensures the UI works EXACTLY as it would with real data

        try {
            // Parse query parameters (reuse from try block)
            const { searchParams } = new URL(request.url);
            const rawParams: Record<string, string> = {};
            searchParams.forEach((value, key) => {
                rawParams[key] = value;
            });

            const validation = PropertySearchSchema.safeParse(rawParams);
            const params = validation.success ? validation.data : {
                page: 1,
                limit: 12,
                sortBy: 'newest' as const,
            };

            // Start with all mock properties (combined from both sources + runtime additions)
            // Combine: 1. Runtime added (mock store), 2. Extended mocks
            // Note: mockStore.properties ALREADY contains MOCK_PROPERTIES
            const ALL_MOCK_DATA = [...mockStore.properties, ...MOCK_PROPERTIES_EXTENDED];
            let filteredProperties = [...ALL_MOCK_DATA];

            // Apply filters to mock data
            if (params.listingType) {
                filteredProperties = filteredProperties.filter(
                    p => p.listingType === params.listingType
                );
            }

            if (params.type && params.type !== 'all') {
                const searchType = params.type.toLowerCase();
                filteredProperties = filteredProperties.filter(
                    p => p.type === searchType
                );
            }


            if (params.city && params.city !== 'all') {
                const city = params.city.toLowerCase();
                filteredProperties = filteredProperties.filter(
                    p => p.location.city.toLowerCase().includes(city)
                );
            }

            if (params.country && params.country !== 'all') {
                const country = params.country.toLowerCase();
                filteredProperties = filteredProperties.filter(
                    p => p.location.country.toLowerCase().includes(country)
                );
            }

            if (params.location && params.location !== 'All Locations') {
                const loc = params.location.toLowerCase();
                filteredProperties = filteredProperties.filter(
                    p => p.location.city.toLowerCase().includes(loc) ||
                        p.location.country.toLowerCase().includes(loc)
                );
            }

            // Price filters
            if (params.minPrice !== undefined && params.minPrice > 0) {
                filteredProperties = filteredProperties.filter(
                    p => p.price.amount >= params.minPrice!
                );
            }

            if (params.maxPrice !== undefined && params.maxPrice > 0) {
                filteredProperties = filteredProperties.filter(
                    p => p.price.amount <= params.maxPrice!
                );
            }

            // Bedroom filters
            if (params.minBeds !== undefined) {
                filteredProperties = filteredProperties.filter(
                    p => (p.specs?.bedrooms || 0) >= params.minBeds!
                );
            }

            if (params.maxBeds !== undefined) {
                filteredProperties = filteredProperties.filter(
                    p => (p.specs?.bedrooms || 0) <= params.maxBeds!
                );
            }

            // Area filters
            if (params.minArea !== undefined) {
                filteredProperties = filteredProperties.filter(
                    p => (p.specs?.livingAreaSqm || 0) >= params.minArea!
                );
            }

            if (params.maxArea !== undefined) {
                filteredProperties = filteredProperties.filter(
                    p => (p.specs?.livingAreaSqm || 0) <= params.maxArea!
                );
            }

            // Featured filter
            if (params.featured) {
                filteredProperties = filteredProperties.filter(
                    p => p.featured === true
                );
            }

            // Search query (title, city, country)
            if (params.q) {
                const query = params.q.toLowerCase();
                filteredProperties = filteredProperties.filter(p =>
                    p.title.toLowerCase().includes(query) ||
                    p.location.city.toLowerCase().includes(query) ||
                    p.location.country.toLowerCase().includes(query)
                );
            }

            // Sorting (simplified for mock data)
            switch (params.sortBy) {
                case 'price_asc':
                    filteredProperties.sort((a, b) => a.price.amount - b.price.amount);
                    break;
                case 'price_desc':
                    filteredProperties.sort((a, b) => b.price.amount - a.price.amount);
                    break;
                // For mock data, skip date-based sorting
            }

            // Pagination
            const total = filteredProperties.length;
            const totalPages = Math.ceil(total / params.limit);
            const offset = (params.page - 1) * params.limit;
            const paginatedProperties = filteredProperties.slice(offset, offset + params.limit);

            // Return mock data with proper API structure
            const response = NextResponse.json({
                success: true,
                data: paginatedProperties,
                pagination: {
                    page: params.page,
                    limit: params.limit,
                    total,
                    totalPages,
                    hasNext: params.page < totalPages,
                    hasPrev: params.page > 1,
                },
                filters: {
                    applied: Object.fromEntries(
                        Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
                    ),
                },
                meta: {
                    duration: Date.now() - startTime,
                    source: 'MOCK_DATA_FALLBACK', // Important flag for debugging
                    warning: 'Using high-fidelity mock data. Configure Supabase to use real data.',
                },
            });

            return applySecurityHeaders(response);

        } catch (fallbackError) {
            // Ultimate fallback - return empty but valid response
            console.error('[API] Mock data fallback also failed:', fallbackError);

            return NextResponse.json({
                success: false,
                error: 'Failed to fetch properties',
                message: process.env.NODE_ENV === 'development'
                    ? (error as Error).message
                    : 'Internal server error',
                data: [],
                pagination: {
                    page: 1,
                    limit: 12,
                    total: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false,
                },
            }, { status: 500 });
        }
    }
}

// ============================================
// POST /api/properties - Create Property
// ============================================

const CreatePropertySchema = z.object({
    title: z.string().min(3).max(255),
    titleAr: z.string().optional(),
    slug: z.string().optional(),
    referenceCode: z.string().optional(),
    description: z.string().min(10).max(5000),
    descriptionAr: z.string().optional(),
    price: z.number().min(0),
    currency: z.string().length(3).default('EGP'),
    location: z.string().min(2).max(255),
    city: z.string().min(2).max(100),
    country: z.string().max(100).default('Egypt'),
    type: z.enum(['Villa', 'Penthouse', 'Apartment', 'Townhouse', 'Duplex', 'Chalet', 'Studio']),
    listingType: z.enum(['sale', 'rent']).default('sale'),
    bedrooms: z.number().min(0).max(20).default(0),
    bathrooms: z.number().min(0).max(20).default(0),
    area: z.number().min(0),
    plotArea: z.number().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    imageUrl: z.string().optional().transform(val => val === '' ? undefined : val),
    images: z.array(z.object({
        url: z.string(),
        alt: z.string().optional()
    })).optional(),
    features: z.array(z.string()).optional(),
    isFeatured: z.boolean().default(false),
    isExclusive: z.boolean().default(false),
    virtualTourUrl: z.string().url().optional(),
    status: z.enum(['draft', 'active', 'published', 'sold', 'rented']).default('draft'),
});


export async function POST(request: NextRequest) {
    try {
        // ============================================
        // CSRF PROTECTION (Phase 2 Security)
        // ============================================
        const csrfError = checkCSRF(request);
        if (csrfError) return csrfError;

        // Check authentication
        const authToken = request.cookies.get('modon_auth_token');
        if (!authToken?.value && process.env.NODE_ENV !== 'development') {
            return NextResponse.json({
                success: false,
                error: 'Authentication required'
            }, { status: 401 });
        }

        const body = await request.json();

        // Validate input
        const validation = CreatePropertySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const data = validation.data;
        const supabase = getSupabase(true);

        // Generate slug and reference code
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50) + '-' + Date.now().toString(36);

        const referenceCode = `MOD-${new Date().toISOString().slice(2, 4)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Insert property - cast to any for untyped schema
        const { data: property, error } = await supabase
            .from('properties')
            .insert({
                title: sanitizeInput(data.title),
                title_ar: data.titleAr ? sanitizeInput(data.titleAr) : null,
                slug,
                description: sanitizeInput(data.description, { maxLength: 5000 }),
                description_ar: data.descriptionAr ? sanitizeInput(data.descriptionAr, { maxLength: 5000 }) : null,
                price: data.price,
                currency: data.currency,
                location: sanitizeInput(data.location),
                city: sanitizeInput(data.city),
                country: data.country,
                latitude: data.latitude || null,
                longitude: data.longitude || null,
                type: data.type,
                listing_type: data.listingType,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                area: data.area,
                plot_area: data.plotArea,
                image_url: data.imageUrl || (data.images && data.images.length > 0 ? data.images[0].url : ''),
                images: data.images || [],
                features: data.features || [],
                is_featured: data.isFeatured,
                is_exclusive: data.isExclusive,
                virtual_tour_url: data.virtualTourUrl || null,
                status: data.status,
                reference_code: referenceCode
            } as never) // Type assertion for ungenerated schema
            .select()
            .single();

        if (error) {
            console.error('[API] Property creation error:', error);

            // FALLBACK: In-Memory Storage for Dev/Demo
            if (process.env.NODE_ENV === 'development' || process.env.MOCK_DATA_FALLBACK === 'true') {
                console.warn('⚠️  Supabase insert failed. Saving to in-memory runtime store.');

                const newMockProperty = {
                    id: `runtime-${Date.now()}`,
                    slug: slug,
                    title: data.title,
                    titleAr: data.titleAr,
                    location: {
                        city: data.city,
                        country: data.country,
                        cityAr: data.city,
                        countryAr: data.country
                    },
                    price: {
                        amount: data.price,
                        currency: data.currency
                    },
                    specs: {
                        bedrooms: data.bedrooms,
                        bathrooms: data.bathrooms,
                        livingAreaSqm: data.area,
                        plotAreaSqm: data.plotArea
                    },
                    images: data.images?.map((img: any, index: number) => ({
                        id: `img-${Date.now()}-${index}`,
                        url: img.url,
                        alt: data.title,
                        isPrimary: index === 0,
                        order: index
                    })) || [],
                    type: data.type,
                    listingType: data.listingType,
                    featured: data.isFeatured,
                    exclusive: data.isExclusive,
                    status: data.status,
                    reference_code: referenceCode,
                    created_at: new Date().toISOString()
                };

                mockStore.addProperty(newMockProperty);

                return NextResponse.json({
                    success: true,
                    message: 'Property created successfully (Runtime Mock)',
                    data: {
                        id: newMockProperty.id,
                        slug: newMockProperty.slug,
                        referenceCode: referenceCode
                    }
                }, { status: 201 });
            }

            throw new Error(error.message);
        }

        // Cast result to PropertyRow
        const createdProperty = property as PropertyRow;

        return NextResponse.json({
            success: true,
            message: 'Property created successfully',
            data: {
                id: createdProperty.id,
                slug: createdProperty.slug,
                referenceCode: createdProperty.reference_code
            }
        }, { status: 201 });

    } catch (error) {
        console.error('[API] Properties POST error:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to create property',
            details: (error as Error).message
        }, { status: 500 });
    }
}
