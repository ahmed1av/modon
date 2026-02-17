/**
 * Supabase Property Repository Implementation
 * ============================================
 * Implements IPropertyRepository using Supabase/PostgreSQL
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
    IPropertyRepository,
    PropertySearchCriteria,
    PaginatedResult,
} from '../interfaces';
import { Property, PropertyStatus, PropertyType, ListingType } from '@/core/entities/Property';
import { mockStore } from '@/lib/mock-store';

// ============================================
// SUPABASE CLIENT (Lazy Initialization)
// ============================================

let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
    if (!supabaseInstance) {
        // SECURITY CHECK: Ensure this code only runs on the server
        if (typeof window !== 'undefined') {
            throw new Error('CRITICAL SECURITY ERROR: Attempting to access Supabase Service Role Key from client-side code! This operation is forbidden.');
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase configuration missing');
        }

        supabaseInstance = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false },
        });
    }
    return supabaseInstance;
}

// ============================================
// TYPE MAPPINGS
// ============================================

interface PropertyRow {
    id: string;
    reference_code: string;
    slug: string;
    property_type: PropertyType;
    listing_type: ListingType;
    status: PropertyStatus;
    title: string;
    headline: string | null;
    description: string;
    description_ar: string | null;

    // Location
    location_id: string | null;
    address_line1: string | null;
    address_line2: string | null;
    city: string;
    state: string | null;
    country: string;
    postal_code: string | null;
    latitude: number;
    longitude: number;
    hide_exact_location: boolean;

    // Pricing
    price: number;
    price_currency: string;
    price_per_sqm: number | null;
    price_on_request: boolean;
    rental_period: string | null;
    deposit_amount: number | null;

    // Specs
    bedrooms: number | null;
    bathrooms: number | null;
    living_area_sqm: number | null;
    plot_area_sqm: number | null;
    total_floors: number | null;
    floor_number: number | null;
    year_built: number | null;
    year_renovated: number | null;

    // Features
    features: string[];
    amenities: string[];
    nearby: string[];
    energy_rating: string | null;

    // Media
    virtual_tour_url: string | null;
    video_url: string | null;
    floor_plan_url: string | null;

    // Ownership
    agent_id: string | null;
    agency_id: string | null;

    // Flags
    featured: boolean;
    exclusive: boolean;
    new_development: boolean;
    off_market: boolean;
    accepts_crypto: boolean;

    // Analytics
    views_count: number;
    inquiries_count: number;
    favorites_count: number;
    shares_count: number;

    // SEO
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string[] | null;

    // Dates
    available_from: string | null;
    listed_at: string | null;
    sold_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    // Relations (joined)
    property_images?: ImageRow[];
    agents?: AgentRow;
    agencies?: AgencyRow;
}

interface ImageRow {
    id: string;
    url: string;
    thumbnail_url: string | null;
    webp_url: string | null;
    avif_url: string | null;
    alt_text: string | null;
    caption: string | null;
    is_primary: boolean;
    is_floor_plan: boolean;
    display_order: number;
}

interface AgentRow {
    id: string;
    user_id: string;
    title: string | null;
    bio: string | null;
    work_phone: string | null;
    work_email: string | null;
    users: {
        first_name: string;
        last_name: string;
        avatar_url: string | null;
    };
}

interface AgencyRow {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
}

// ============================================
// MAPPER
// ============================================

function mapRowToProperty(row: PropertyRow): Property {
    const images = (row.property_images || [])
        .sort((a, b) => a.display_order - b.display_order)
        .map(img => ({
            id: img.id,
            url: img.url,
            thumbnailUrl: img.thumbnail_url || img.url,
            webpUrl: img.webp_url ?? undefined,
            avifUrl: img.avif_url ?? undefined,
            alt: img.alt_text || row.title,
            caption: img.caption ?? undefined,
            isPrimary: img.is_primary,
            isFloorPlan: img.is_floor_plan,
            order: img.display_order,
        }));

    return {
        id: row.id,
        referenceCode: row.reference_code,
        slug: row.slug,
        type: row.property_type,
        listingType: row.listing_type,
        status: row.status,

        title: row.title,
        headline: row.headline || undefined,
        description: row.description,
        descriptionAr: row.description_ar || undefined,

        location: {
            address: row.address_line1 || '',
            addressLine2: row.address_line2 || undefined,
            city: row.city,
            state: row.state || undefined,
            country: row.country,
            postalCode: row.postal_code || undefined,
            coordinates: {
                latitude: row.latitude,
                longitude: row.longitude,
            },
            hideExactLocation: row.hide_exact_location,
        },

        price: {
            amount: row.price,
            currency: row.price_currency,
            pricePerSqm: row.price_per_sqm || undefined,
            priceOnRequest: row.price_on_request,
            rentalPeriod: row.rental_period as any,
            deposit: row.deposit_amount || undefined,
        },

        specs: {
            bedrooms: row.bedrooms || undefined,
            bathrooms: row.bathrooms || undefined,
            livingAreaSqm: row.living_area_sqm || undefined,
            plotAreaSqm: row.plot_area_sqm || undefined,
            totalFloors: row.total_floors || undefined,
            floorNumber: row.floor_number || undefined,
            yearBuilt: row.year_built || undefined,
            yearRenovated: row.year_renovated || undefined,
        },

        images,

        features: row.features.map(f => ({
            id: f,
            name: f,
            category: 'general',
        })),

        amenities: row.amenities,
        nearbyPlaces: row.nearby,

        energyRating: row.energy_rating || undefined,
        virtualTourUrl: row.virtual_tour_url || undefined,
        videoUrl: row.video_url || undefined,
        floorPlanUrl: row.floor_plan_url || undefined,

        agentId: row.agent_id || undefined,
        agencyId: row.agency_id || undefined,

        agent: row.agents ? {
            id: row.agents.id,
            name: `${row.agents.users.first_name} ${row.agents.users.last_name}`,
            title: row.agents.title || undefined,
            avatar: row.agents.users.avatar_url || undefined,
            phone: row.agents.work_phone || undefined,
            email: row.agents.work_email || undefined,
        } : undefined,

        agency: row.agencies ? {
            id: row.agencies.id,
            name: row.agencies.name,
            slug: row.agencies.slug,
            logo: row.agencies.logo_url || undefined,
        } : undefined,

        flags: {
            featured: row.featured,
            exclusive: row.exclusive,
            newDevelopment: row.new_development,
            offMarket: row.off_market,
            acceptsCrypto: row.accepts_crypto,
        },

        analytics: {
            views: row.views_count,
            inquiries: row.inquiries_count,
            favorites: row.favorites_count,
            shares: row.shares_count,
        },

        seo: {
            metaTitle: row.meta_title || undefined,
            metaDescription: row.meta_description || undefined,
            keywords: row.meta_keywords || undefined,
        },

        availableFrom: row.available_from ? new Date(row.available_from) : undefined,
        listedAt: row.listed_at ? new Date(row.listed_at) : undefined,
        soldAt: row.sold_at ? new Date(row.sold_at) : undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
    };
}

// ============================================
// REPOSITORY IMPLEMENTATION
// ============================================

export class SupabasePropertyRepository implements IPropertyRepository {

    // ----------------------------------------
    // MOCK DATA MAPPER (Simulation Mode)
    // ----------------------------------------
    private mapMockToProperty(mock: any): Property {
        // If it looks like a full property (runtime added), return it
        if (mock.description && mock.agentId) return mock as Property;

        // Otherwise map from PropertyListItem (MOCK_PROPERTIES)
        return {
            id: mock.id,
            slug: mock.slug,
            title: mock.title,
            titleAr: mock.titleAr,
            headline: `Luxury ${mock.type} in ${mock.location.city}`,
            description: 'Experience the epitome of luxury living in this stunning property. Featuring exquisite finishes, panoramic views, and world-class amenities, this residence offers the perfect blend of comfort and sophistication.',
            descriptionAr: 'استمتع بقمة المعيشة الفاخرة في هذا العقار المذهل.',
            status: 'active',
            type: mock.type || 'villa',
            listingType: mock.listingType || 'sale',
            location: {
                address: `${mock.location.city}, ${mock.location.country}`,
                city: mock.location.city,
                country: mock.location.country,
                coordinates: { latitude: 25.2048, longitude: 55.2708 }, // Default to Dubai
                hideExactLocation: false
            },
            price: mock.price,
            specs: {
                bedrooms: mock.specs?.bedrooms || 4,
                bathrooms: mock.specs?.bathrooms || 5,
                livingAreaSqm: mock.specs?.livingAreaSqm || 500,
                ...mock.specs
            },
            images: mock.images || [],
            features: [],
            amenities: ['Pool', 'Gym', 'Concierge', 'Parking', 'Security'],
            nearbyPlaces: ['Mall', 'Airport', 'School'],
            flags: {
                featured: !!mock.featured,
                exclusive: false,
                newDevelopment: false,
                offMarket: false,
                acceptsCrypto: false
            },
            analytics: { views: 0, inquiries: 0, favorites: 0, shares: 0 },
            createdAt: new Date(),
            updatedAt: new Date(),
            agentId: 'mock-agent-001',
            agencyId: 'mock-agency-001'
        } as Property;
    }

    // ----------------------------------------
    // Basic CRUD
    // ----------------------------------------

    async findById(id: string): Promise<Property | null> {
        // MOCK FALLBACK
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const mock = mockStore.properties.find(p => p.id === id);
            return mock ? this.mapMockToProperty(mock) : null;
        }

        try {
            const { data, error } = await getSupabase()
                .from('properties')
                .select(`
                    *,
                    property_images(*),
                    agents(*, users(first_name, last_name, avatar_url)),
                    agencies(id, name, slug, logo_url)
                `)
                .eq('id', id)
                .is('deleted_at', null)
                .single();

            if (error) throw error;
            if (!data) return null;

            return mapRowToProperty(data);
        } catch (error) {
            console.warn('⚠️ Supabase Error (findById), checking Mock Store:', error);
            const mock = mockStore.properties.find(p => p.id === id);
            return mock ? this.mapMockToProperty(mock) : null;
        }
    }

    async findBySlug(slug: string): Promise<Property | null> {
        // MOCK FALLBACK
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const mock = mockStore.properties.find(p => p.slug === slug);
            return mock ? this.mapMockToProperty(mock) : null;
        }

        try {
            const { data, error } = await getSupabase()
                .from('properties')
                .select(`
                    *,
                    agents(*, users(first_name, last_name, avatar_url)),
                    agencies(id, name, slug, logo_url)
                `)
                .eq('slug', slug)
                .is('deleted_at', null)
                .single();

            if (error) throw error;
            if (!data) return null;

            return mapRowToProperty(data);
        } catch (error) {
            console.warn('⚠️ Supabase Error (findBySlug), checking Mock Store:', error);
            const mock = mockStore.properties.find(p => p.slug === slug);
            return mock ? this.mapMockToProperty(mock) : null;
        }
    }

    async findByReferenceCode(referenceCode: string): Promise<Property | null> {
        const { data, error } = await getSupabase()
            .from('properties')
            .select(`
                *,
                property_images(*),
                agents(*, users(first_name, last_name, avatar_url)),
                agencies(id, name, slug, logo_url)
            `)
            .eq('reference_code', referenceCode)
            .is('deleted_at', null)
            .single();

        if (error || !data) return null;
        return mapRowToProperty(data);
    }

    async findAll(criteria?: PropertySearchCriteria): Promise<PaginatedResult<Property>> {
        const page = criteria?.page || 1;
        const limit = Math.min(criteria?.limit || 20, 100);
        const offset = (page - 1) * limit;

        let query = getSupabase()
            .from('properties')
            .select(`
                *,
                property_images(*),
                agents(*, users(first_name, last_name, avatar_url)),
                agencies(id, name, slug, logo_url)
            `, { count: 'exact' })
            .is('deleted_at', null);

        // Apply filters
        if (criteria) {
            if (criteria.status) {
                query = query.eq('status', criteria.status);
            } else {
                query = query.eq('status', 'active');
            }

            if (criteria.type) {
                if (Array.isArray(criteria.type)) {
                    query = query.in('property_type', criteria.type);
                } else {
                    query = query.eq('property_type', criteria.type);
                }
            }

            if (criteria.listingType) {
                query = query.eq('listing_type', criteria.listingType);
            }

            if (criteria.city) {
                query = query.ilike('city', `%${criteria.city}%`);
            }

            if (criteria.country) {
                query = query.eq('country', criteria.country);
            }

            if (criteria.minPrice !== undefined) {
                query = query.gte('price', criteria.minPrice);
            }

            if (criteria.maxPrice !== undefined) {
                query = query.lte('price', criteria.maxPrice);
            }

            if (criteria.minBedrooms !== undefined) {
                query = query.gte('bedrooms', criteria.minBedrooms);
            }

            if (criteria.maxBedrooms !== undefined) {
                query = query.lte('bedrooms', criteria.maxBedrooms);
            }

            if (criteria.minBathrooms !== undefined) {
                query = query.gte('bathrooms', criteria.minBathrooms);
            }

            if (criteria.minArea !== undefined) {
                query = query.gte('living_area_sqm', criteria.minArea);
            }

            if (criteria.maxArea !== undefined) {
                query = query.lte('living_area_sqm', criteria.maxArea);
            }

            if (criteria.featured !== undefined) {
                query = query.eq('featured', criteria.featured);
            }

            if (criteria.exclusive !== undefined) {
                query = query.eq('exclusive', criteria.exclusive);
            }

            if (criteria.agentId) {
                query = query.eq('agent_id', criteria.agentId);
            }

            if (criteria.agencyId) {
                query = query.eq('agency_id', criteria.agencyId);
            }

            if (criteria.query) {
                query = query.or(`title.ilike.%${criteria.query}%,description.ilike.%${criteria.query}%`);
            }
        }

        // Sorting
        const sortField = criteria?.sortBy || 'created_at';
        const sortOrder = criteria?.sortOrder || 'desc';

        const sortMapping: Record<string, string> = {
            createdAt: 'created_at',
            price: 'price',
            listedAt: 'listed_at',
            views: 'views_count',
            favorites: 'favorites_count',
        };

        const dbField = sortMapping[sortField] || 'created_at';
        query = query.order(dbField, { ascending: sortOrder === 'asc' });

        // Pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.warn('⚠️ Supabase Error (findAll), falling back to Mock Store:', error);
            // Fallback to mock properties
            // Apply simple in-memory filtering if possible, or just return all for robustness
            const mockProperties = mockStore.properties.map(p => this.mapMockToProperty(p));

            return {
                data: mockProperties,
                pagination: {
                    page: 1,
                    limit: mockProperties.length,
                    total: mockProperties.length,
                    totalPages: 1,
                    hasNext: false,
                    hasPrevious: false,
                },
            };
        }

        const properties = (data || []).map(mapRowToProperty);
        const total = count || 0;
        const totalPages = Math.ceil(total / limit);

        return {
            data: properties,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrevious: page > 1,
            },
        };
    }

    async create(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
        const row = {
            reference_code: property.referenceCode,
            slug: property.slug,
            property_type: property.type,
            listing_type: property.listingType,
            status: property.status,

            title: property.title,
            headline: property.headline,
            description: property.description,
            description_ar: property.descriptionAr,

            address_line1: property.location.address,
            address_line2: property.location.addressLine2,
            city: property.location.city,
            state: property.location.state,
            country: property.location.country,
            postal_code: property.location.postalCode,
            latitude: property.location.coordinates.latitude,
            longitude: property.location.coordinates.longitude,
            hide_exact_location: property.location.hideExactLocation,

            price: property.price.amount,
            price_currency: property.price.currency,
            price_per_sqm: property.price.pricePerSqm,
            price_on_request: property.price.priceOnRequest,
            rental_period: property.price.rentalPeriod,
            deposit_amount: property.price.deposit,

            bedrooms: property.specs.bedrooms,
            bathrooms: property.specs.bathrooms,
            living_area_sqm: property.specs.livingAreaSqm,
            plot_area_sqm: property.specs.plotAreaSqm,
            total_floors: property.specs.totalFloors,
            floor_number: property.specs.floorNumber,
            year_built: property.specs.yearBuilt,
            year_renovated: property.specs.yearRenovated,

            features: property.features.map(f => f.name),
            amenities: property.amenities,
            nearby: property.nearbyPlaces,

            energy_rating: property.energyRating,
            virtual_tour_url: property.virtualTourUrl,
            video_url: property.videoUrl,
            floor_plan_url: property.floorPlanUrl,

            agent_id: property.agentId,
            agency_id: property.agencyId,

            featured: property.flags?.featured || false,
            exclusive: property.flags?.exclusive || false,
            new_development: property.flags?.newDevelopment || false,
            off_market: property.flags?.offMarket || false,
            accepts_crypto: property.flags?.acceptsCrypto || false,

            meta_title: property.seo?.metaTitle,
            meta_description: property.seo?.metaDescription,
            meta_keywords: property.seo?.keywords,

            available_from: property.availableFrom?.toISOString(),
            listed_at: property.listedAt?.toISOString() || new Date().toISOString(),
        };

        const { data, error } = await getSupabase()
            .from('properties')
            .insert(row)
            .select(`
                *,
                property_images(*),
                agents(*, users(first_name, last_name, avatar_url)),
                agencies(id, name, slug, logo_url)
            `)
            .single();

        if (error || !data) {
            throw new Error(`Failed to create property: ${error?.message}`);
        }

        // Insert images
        if (property.images.length > 0) {
            const imageRows = property.images.map((img, index) => ({
                property_id: data.id,
                url: img.url,
                thumbnail_url: img.thumbnailUrl,
                webp_url: img.webpUrl,
                avif_url: img.avifUrl,
                alt_text: img.alt,
                caption: img.caption,
                is_primary: img.isPrimary || index === 0,
                is_floor_plan: img.isFloorPlan || false,
                display_order: img.order ?? index,
            }));

            await getSupabase().from('property_images').insert(imageRows);
        }

        return mapRowToProperty(data);
    }

    async update(id: string, data: Partial<Property>): Promise<Property> {
        // MOCK FALLBACK
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const index = mockStore.properties.findIndex(p => p.id === id);
            if (index === -1) throw new Error('Property not found (Mock)');

            const existing = mockStore.properties[index];
            const updated = { ...existing, ...data, updatedAt: new Date() };
            // @ts-ignore
            mockStore.properties[index] = updated;
            return this.mapMockToProperty(updated);
        }

        const updateRow: Record<string, unknown> = {};

        if (data.title) updateRow.title = data.title;
        if (data.headline !== undefined) updateRow.headline = data.headline;
        if (data.description) updateRow.description = data.description;
        if (data.status) updateRow.status = data.status;
        if (data.type) updateRow.property_type = data.type;
        if (data.listingType) updateRow.listing_type = data.listingType;

        if (data.price) {
            updateRow.price = data.price.amount;
            updateRow.price_currency = data.price.currency;
            updateRow.price_per_sqm = data.price.pricePerSqm;
            updateRow.price_on_request = data.price.priceOnRequest;
        }

        if (data.specs) {
            updateRow.bedrooms = data.specs.bedrooms;
            updateRow.bathrooms = data.specs.bathrooms;
            updateRow.living_area_sqm = data.specs.livingAreaSqm;
            updateRow.plot_area_sqm = data.specs.plotAreaSqm;
        }

        if (data.location) {
            updateRow.address_line1 = data.location.address;
            updateRow.city = data.location.city;
            updateRow.country = data.location.country;
            updateRow.latitude = data.location.coordinates.latitude;
            updateRow.longitude = data.location.coordinates.longitude;
        }

        if (data.flags) {
            updateRow.featured = data.flags.featured;
            updateRow.exclusive = data.flags.exclusive;
            updateRow.off_market = data.flags.offMarket;
        }

        try {
            const { data: updated, error } = await getSupabase()
                .from('properties')
                .update(updateRow)
                .eq('id', id)
                .select(`
                    *,
                    agents(*, users(first_name, last_name, avatar_url)),
                    agencies(id, name, slug, logo_url)
                `)
                .single();

            if (error || !updated) {
                throw new Error(error?.message || 'Update failed');
            }

            return mapRowToProperty(updated);
        } catch (err) {
            console.warn('⚠️ Supabase Update Failed, falling back to Mock Store:', err);
            const index = mockStore.properties.findIndex(p => p.id === id);
            if (index !== -1) {
                const existing = mockStore.properties[index];
                const updated = { ...existing, ...data, updatedAt: new Date() };
                // @ts-ignore
                mockStore.properties[index] = updated;
                mockStore.sync();
                return this.mapMockToProperty(updated as any);
            }
            throw err;
        }
    }

    async delete(id: string): Promise<void> {
        // MOCK FALLBACK
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const index = mockStore.properties.findIndex(p => p.id === id);
            if (index !== -1) {
                mockStore.properties.splice(index, 1);
                return;
            }
            throw new Error('Property not found (Mock)');
        }

        try {
            // Soft delete
            const { error } = await getSupabase()
                .from('properties')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.warn('⚠️ Supabase Delete Failed, falling back to Mock Store:', err);
            const index = mockStore.properties.findIndex(p => p.id === id);
            if (index !== -1) {
                mockStore.properties.splice(index, 1);
                mockStore.sync();
                return;
            }
            throw err;
        }
    }

    // ----------------------------------------
    // Specialized Queries
    // ----------------------------------------

    async findFeatured(limit: number = 10): Promise<Property[]> {
        const { data } = await getSupabase()
            .from('properties')
            .select(`
                *,
                property_images(*),
                agents(*, users(first_name, last_name, avatar_url)),
                agencies(id, name, slug, logo_url)
            `)
            .eq('featured', true)
            .eq('status', 'active')
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(limit);

        return (data || []).map(mapRowToProperty);
    }

    async findExclusive(limit: number = 10): Promise<Property[]> {
        const { data } = await getSupabase()
            .from('properties')
            .select(`
                *,
                property_images(*),
                agents(*, users(first_name, last_name, avatar_url)),
                agencies(id, name, slug, logo_url)
            `)
            .eq('exclusive', true)
            .eq('status', 'active')
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(limit);

        return (data || []).map(mapRowToProperty);
    }

    async findSimilar(propertyId: string, limit: number = 6): Promise<Property[]> {
        const property = await this.findById(propertyId);
        if (!property) return [];

        const minPrice = property.price.amount * 0.7;
        const maxPrice = property.price.amount * 1.3;

        const { data } = await getSupabase()
            .from('properties')
            .select(`
                *,
                property_images(*),
                agents(*, users(first_name, last_name, avatar_url)),
                agencies(id, name, slug, logo_url)
            `)
            .neq('id', propertyId)
            .eq('property_type', property.type)
            .eq('listing_type', property.listingType)
            .eq('status', 'active')
            .gte('price', minPrice)
            .lte('price', maxPrice)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(limit);

        return (data || []).map(mapRowToProperty);
    }

    async findByAgent(agentId: string, criteria?: PropertySearchCriteria): Promise<PaginatedResult<Property>> {
        return this.findAll({ ...criteria, agentId });
    }

    async findByAgency(agencyId: string, criteria?: PropertySearchCriteria): Promise<PaginatedResult<Property>> {
        return this.findAll({ ...criteria, agencyId });
    }

    async findByLocation(
        latitude: number,
        longitude: number,
        radiusKm: number,
        limit: number = 20
    ): Promise<Property[]> {
        // Use PostGIS for geospatial query
        const { data } = await getSupabase().rpc('find_properties_near_location', {
            lat: latitude,
            lng: longitude,
            radius_km: radiusKm,
            max_results: limit,
        });

        if (!data) return [];

        // Fetch full property data
        const ids = data.map((r: { id: string }) => r.id);
        const { data: properties } = await getSupabase()
            .from('properties')
            .select(`
                *,
                property_images(*),
                agents(*, users(first_name, last_name, avatar_url)),
                agencies(id, name, slug, logo_url)
            `)
            .in('id', ids);

        return (properties || []).map(mapRowToProperty);
    }

    // ----------------------------------------
    // Analytics
    // ----------------------------------------

    async incrementViews(propertyId: string): Promise<void> {
        await getSupabase().rpc('increment_property_views', { property_id: propertyId });
    }

    async incrementShares(propertyId: string): Promise<void> {
        await getSupabase().rpc('increment_property_shares', { property_id: propertyId });
    }

    async getAnalytics(propertyId: string): Promise<{
        views: number;
        inquiries: number;
        favorites: number;
        shares: number;
        viewsHistory: { date: string; count: number }[];
    }> {
        const property = await this.findById(propertyId);
        if (!property) {
            return {
                views: 0,
                inquiries: 0,
                favorites: 0,
                shares: 0,
                viewsHistory: [],
            };
        }

        // Get views history for last 30 days
        const { data: viewsHistory } = await getSupabase()
            .from('property_views')
            .select('created_at')
            .eq('property_id', propertyId)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        const groupedViews: Record<string, number> = {};
        (viewsHistory || []).forEach(v => {
            const date = v.created_at.split('T')[0];
            groupedViews[date] = (groupedViews[date] || 0) + 1;
        });

        return {
            views: property.analytics?.views ?? 0,
            inquiries: property.analytics?.inquiries ?? 0,
            favorites: property.analytics?.favorites ?? 0,
            shares: property.analytics?.shares ?? 0,
            viewsHistory: Object.entries(groupedViews).map(([date, count]) => ({ date, count })),
        };
    }

    // ----------------------------------------
    // Counts
    // ----------------------------------------

    async count(criteria?: PropertySearchCriteria): Promise<number> {
        let query = getSupabase()
            .from('properties')
            .select('id', { count: 'exact', head: true })
            .is('deleted_at', null);

        if (criteria?.status) {
            query = query.eq('status', criteria.status);
        } else {
            query = query.eq('status', 'active');
        }

        if (criteria?.type) {
            query = query.eq('property_type', criteria.type);
        }

        if (criteria?.listingType) {
            query = query.eq('listing_type', criteria.listingType);
        }

        const { count } = await query;
        return count || 0;
    }

    async countByStatus(): Promise<Record<PropertyStatus, number>> {
        const { data } = await getSupabase()
            .from('properties')
            .select('status')
            .is('deleted_at', null);

        const counts: Record<string, number> = {};
        (data || []).forEach(p => {
            counts[p.status] = (counts[p.status] || 0) + 1;
        });

        return counts as Record<PropertyStatus, number>;
    }
}

// Export singleton
export const propertyRepository = new SupabasePropertyRepository();
