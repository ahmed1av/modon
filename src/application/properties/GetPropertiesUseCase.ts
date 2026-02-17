/**
 * MODON Platform - Get Properties Use Case (Application Layer)
 * =============================================================
 * Orchestrates business logic for fetching properties
 */

import { Property } from '@/core/entities/Property';
import {
    IPropertyRepository,
    PropertySearchCriteria,
    PaginatedResult
} from '@/dal/interfaces';
import { PropertySearchSchema } from '@/contracts/schemas';

export interface GetPropertiesInput {
    query?: string;
    type?: string;
    listingType?: string;
    city?: string;
    region?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minArea?: number;
    maxArea?: number;
    features?: string[];
    hasPool?: boolean;
    hasGarden?: boolean;
    hasSeaview?: boolean;
    isFeatured?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface GetPropertiesOutput {
    properties: Property[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    filters: {
        priceRange: { min: number; max: number };
        availableTypes: string[];
        availableCities: string[];
    };
}

/**
 * Use Case: Get Properties with filters and pagination
 * Follows CoreX Clean Architecture principles
 */
export class GetPropertiesUseCase {
    constructor(private readonly propertyRepository: IPropertyRepository) { }

    async execute(input: GetPropertiesInput): Promise<GetPropertiesOutput> {
        // 1. Validate input using Zod schema
        const validatedInput = PropertySearchSchema.parse(input);

        // 2. Build search criteria
        const criteria: PropertySearchCriteria = {
            query: validatedInput.query,
            type: validatedInput.type,
            listingType: validatedInput.listingType,
            status: 'published', // Only show published properties

            city: validatedInput.city,
            region: validatedInput.region,
            country: validatedInput.country,

            minPrice: validatedInput.minPrice,
            maxPrice: validatedInput.maxPrice,
            currency: validatedInput.currency,

            minBedrooms: validatedInput.minBedrooms,
            maxBedrooms: validatedInput.maxBedrooms,
            minBathrooms: validatedInput.minBathrooms,
            maxBathrooms: validatedInput.maxBathrooms,

            minArea: validatedInput.minArea,
            maxArea: validatedInput.maxArea,

            features: validatedInput.features,
            lifestyle: validatedInput.lifestyle,

            hasPool: validatedInput.hasPool,
            hasGarden: validatedInput.hasGarden,
            hasSeaview: validatedInput.hasSeaview,

            isFeatured: validatedInput.isFeatured,
            isOffMarket: validatedInput.isOffMarket,

            page: validatedInput.page,
            limit: validatedInput.limit,
            sort: this.parseSort(validatedInput.sortBy),
        };

        // 3. Execute repository query
        const result = await this.propertyRepository.findAll(criteria);

        // 4. Get additional filter data (handle optional methods)
        const priceRangePromise = this.propertyRepository.getPriceRange
            ? this.propertyRepository.getPriceRange({ status: 'published' })
            : Promise.resolve({ min: 0, max: 10000000 });

        const cityCountsPromise = this.propertyRepository.countByCity
            ? this.propertyRepository.countByCity()
            : Promise.resolve({});

        const [priceRange, typeCounts, cityCounts] = await Promise.all([
            priceRangePromise,
            this.getAvailableTypes(),
            cityCountsPromise,
        ]);

        // 5. Return formatted output
        return {
            properties: result.data,
            pagination: {
                ...result.pagination,
                hasPrev: result.pagination.hasPrev ?? result.pagination.hasPrevious ?? false,
            },
            filters: {
                priceRange,
                availableTypes: Object.keys(typeCounts),
                availableCities: Object.keys(cityCounts),
            },
        };
    }

    private parseSort(sortBy?: string): { field: string; direction: 'asc' | 'desc' } | undefined {
        if (!sortBy) return undefined;

        const sortMap: Record<string, { field: string; direction: 'asc' | 'desc' }> = {
            price_asc: { field: 'price.amount', direction: 'asc' },
            price_desc: { field: 'price.amount', direction: 'desc' },
            newest: { field: 'createdAt', direction: 'desc' },
            oldest: { field: 'createdAt', direction: 'asc' },
            area: { field: 'specs.area', direction: 'desc' },
        };

        return sortMap[sortBy];
    }

    private async getAvailableTypes(): Promise<Record<string, number>> {
        const types = ['house', 'villa', 'apartment', 'penthouse', 'land', 'commercial'];
        const counts: Record<string, number> = {};

        if (!this.propertyRepository.countByType) {
            // If countByType not available, return all types with 0 count
            for (const type of types) {
                counts[type] = 0;
            }
            return counts;
        }

        for (const type of types) {
            counts[type] = await this.propertyRepository.countByType(type as any);
        }

        return counts;
    }
}

/**
 * Use Case: Get Single Property by Slug
 */
export class GetPropertyBySlugUseCase {
    constructor(private readonly propertyRepository: IPropertyRepository) { }

    async execute(slug: string): Promise<Property | null> {
        // 1. Validate slug format
        if (!slug || typeof slug !== 'string' || slug.length < 1) {
            throw new Error('Invalid property slug');
        }

        // 2. Sanitize slug
        const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');

        // 3. Fetch property
        const property = await this.propertyRepository.findBySlug(sanitizedSlug);

        if (!property) {
            return null;
        }

        // 4. Increment view count (fire and forget)
        if (this.propertyRepository.incrementViewCount) {
            this.propertyRepository.incrementViewCount(property.id).catch(() => { });
        } else if (this.propertyRepository.incrementViews) {
            this.propertyRepository.incrementViews(property.id).catch(() => { });
        }

        return property;
    }
}

/**
 * Use Case: Get Featured Properties
 */
export class GetFeaturedPropertiesUseCase {
    constructor(private readonly propertyRepository: IPropertyRepository) { }

    async execute(limit: number = 6): Promise<Property[]> {
        return this.propertyRepository.findFeatured(limit);
    }
}

/**
 * Use Case: Get Similar Properties
 */
export class GetSimilarPropertiesUseCase {
    constructor(private readonly propertyRepository: IPropertyRepository) { }

    async execute(propertyId: string, limit: number = 4): Promise<Property[]> {
        return this.propertyRepository.findSimilar(propertyId, limit);
    }
}

/**
 * Use Case: Get Agent Properties
 */
export class GetAgentPropertiesUseCase {
    constructor(private readonly propertyRepository: IPropertyRepository) { }

    async execute(
        agentId: string,
        page: number = 1,
        limit: number = 12
    ): Promise<PaginatedResult<Property>> {
        return this.propertyRepository.findByAgent(agentId, { page, limit });
    }
}
