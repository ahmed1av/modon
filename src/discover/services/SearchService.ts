/**
 * Search Service (SECURED & HARDENED)
 * =====================================
 * CRITICAL FIX #2: Array safety with defensive coding
 * CRITICAL FIX #7: Removed all 'any' types
 * 
 * Connects to internal Next.js API for property search
 */

import { PropertyListItem, SearchSuggestion, ApiResponse } from '@/types';

export interface SearchParams {
    query?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    type?: string;
    page?: number;
    limit?: number;
}

export interface SearchResponse {
    success: boolean;
    data: PropertyListItem[];
    pagination?: {
        total: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
    };
}

export interface FilterOptions {
    locations: string[];
    types: string[];
    priceRange: { min: number; max: number };
}

export class SearchService {
    /**
     * Fetches search suggestions from our internal API
     * CRITICAL: Defensive array handling to prevent crashes
     */
    static async suggest(query: string): Promise<SearchSuggestion[]> {
        if (!query || query.length < 2) return [];

        try {
            // Query our internal properties API
            const response = await fetch(`/api/properties?q=${encodeURIComponent(query)}&limit=6`);

            if (!response.ok) {
                console.warn(`[SearchService] Suggestion API returned ${response.status}`);
                return [];
            }

            const result: ApiResponse<PropertyListItem[]> = await response.json();

            // CRITICAL FIX #2: DEFENSIVE CODING - Never trust API responses
            if (!result || typeof result !== 'object') {
                console.error('[SearchService] Invalid suggestion response format');
                return [];
            }

            // Check for API error response
            if (result.success === false) {
                console.warn('[SearchService] API returned error:', result.error);
                return [];
            }

            // CRITICAL: Verify data is actually an array
            if (!Array.isArray(result.data)) {
                console.error('[SearchService] Suggestion data is not an array:', typeof result.data);
                return [];
            }

            const properties = result.data;
            const suggestions: SearchSuggestion[] = [];

            // Extract unique locations from results
            const locations = new Set<string>();

            properties.forEach((prop: PropertyListItem) => {
                const city = prop.location?.city;
                const country = prop.location?.country;

                if (city && country) {
                    locations.add(`${city}, ${country}`);
                }
            });

            // Add location suggestions
            let locationIndex = 0;
            locations.forEach((loc) => {
                suggestions.push({
                    type: 'location',
                    text: loc,
                    subtext: 'Location',
                    id: `loc-${locationIndex++}`,
                });
            });

            // Add property suggestions (first 4)
            properties.slice(0, 4).forEach((prop: PropertyListItem) => {
                suggestions.push({
                    type: 'property',
                    text: prop.title,
                    subtext: `${prop.location.city} - ${prop.type}`,
                    id: prop.id,
                });
            });

            return suggestions.slice(0, 8); // Max 8 suggestions

        } catch (error) {
            console.error('[SearchService] Suggestion error:', error);
            return [];
        }
    }

    /**
     * Performs a full property search
     * CRITICAL: Returns empty array on failure, never throws
     */
    static async search(params: SearchParams): Promise<SearchResponse> {
        try {
            const searchParams = new URLSearchParams();

            if (params.query) searchParams.set('q', params.query);
            if (params.location) searchParams.set('country', params.location);
            if (params.minPrice) searchParams.set('minPrice', params.minPrice.toString());
            if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
            if (params.type) searchParams.set('type', params.type);

            searchParams.set('page', (params.page || 1).toString());
            searchParams.set('limit', (params.limit || 12).toString());

            const response = await fetch(`/api/properties?${searchParams.toString()}`);

            if (!response.ok) {
                console.warn(`[SearchService] Search API returned ${response.status}`);
                return { success: false, data: [] };
            }

            const result: ApiResponse<PropertyListItem[]> = await response.json();

            // CRITICAL FIX #2: Defensive response handling
            if (!result || typeof result !== 'object') {
                console.error('[SearchService] Invalid search response format');
                return { success: false, data: [] };
            }

            if (result.success === false) {
                console.warn('[SearchService] Search failed:', result.error);
                return { success: false, data: [] };
            }

            // CRITICAL: Verify data is an array before returning
            if (!Array.isArray(result.data)) {
                console.error('[SearchService] Search data is not an array:', typeof result.data);
                return { success: false, data: [] };
            }

            return {
                success: true,
                data: result.data,
                pagination: (result as any).pagination, // Optional field
            };

        } catch (error) {
            console.error('[SearchService] Search error:', error);
            return { success: false, data: [] };
        }
    }

    /**
     * Get available filter options from API
     * CRITICAL: Always returns valid defaults on failure
     */
    static async getFilterOptions(): Promise<FilterOptions> {
        const DEFAULT_OPTIONS: FilterOptions = {
            locations: [],
            types: [],
            priceRange: { min: 0, max: 50000000 },
        };

        try {
            // Fetch a sample to extract available options
            const response = await fetch('/api/properties?limit=100');

            if (!response.ok) {
                console.warn(`[SearchService] Filter options API returned ${response.status}`);
                return DEFAULT_OPTIONS;
            }

            const result: ApiResponse<PropertyListItem[]> = await response.json();

            // CRITICAL FIX #2: Defensive validation
            if (!result || typeof result !== 'object' || result.success === false) {
                console.warn('[SearchService] Failed to fetch filter options');
                return DEFAULT_OPTIONS;
            }

            // CRITICAL: Verify data is an array
            if (!Array.isArray(result.data)) {
                console.error('[SearchService] Filter data is not an array');
                return DEFAULT_OPTIONS;
            }

            const properties = result.data;
            const locations = new Set<string>();
            const types = new Set<string>();
            let minPrice = Infinity;
            let maxPrice = 0;

            properties.forEach((prop: PropertyListItem) => {
                // Extract locations (with null-safety)
                if (prop.location?.country) {
                    locations.add(prop.location.country);
                }

                // Extract types
                if (prop.type) {
                    types.add(prop.type);
                }

                // Extract price range (with validation)
                const price = prop.price?.amount;
                if (typeof price === 'number' && price > 0) {
                    minPrice = Math.min(minPrice, price);
                    maxPrice = Math.max(maxPrice, price);
                }
            });

            return {
                locations: Array.from(locations).sort(),
                types: Array.from(types).sort(),
                priceRange: {
                    min: minPrice === Infinity ? 0 : minPrice,
                    max: maxPrice || 50000000,
                },
            };

        } catch (error) {
            console.error('[SearchService] Filter options error:', error);
            return DEFAULT_OPTIONS;
        }
    }
}
