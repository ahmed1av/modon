'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronDown, Grid, List, MapPin, Search, Loader2, AlertCircle, X } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import PropertyCard from '@/app/components/property/PropertyCard';
import { SearchService } from '@/discover/services/SearchService';
import styles from './buy.module.css';
import { Dictionary } from '@/types';

/**
 * MODON EVOLUTIO - Buy Page Client (INTELLIGENT FILTERING + i18n)
 * ===============================================================
 * Property listing grid with LIVE data from API
 * - URL query params sync (?q=Villa&location=Netherlands)
 * - Dynamic filter options from actual data
 * - Real-time re-fetch on filter change
 * - Supports multilingual content via dictionary
 */

interface BuyClientProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
    listingType?: 'sale' | 'rent';
}

interface Property {
    id: string;
    title: string;
    titleAr?: string;
    location: {
        city: string;
        cityAr?: string;
        country: string;
        countryAr?: string;
        address?: string;
    };
    price: {
        amount: number;
        currency: string;
    };
    specs: {
        bedrooms?: number;
        bathrooms?: number;
        livingAreaSqm?: number;
        plotAreaSqm?: number;
    };
    images: Array<{
        url: string;
        alt?: string;
        isPrimary?: boolean;
    }>;
    slug: string;
    type: string;
    flags?: {
        featured?: boolean;
        exclusive?: boolean;
    };
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// Price range options
const priceRanges = [
    { label: 'All Prices', min: undefined, max: undefined },
    { label: '€0 - €1M', min: 0, max: 1000000 },
    { label: '€1M - €3M', min: 1000000, max: 3000000 },
    { label: '€3M - €5M', min: 3000000, max: 5000000 },
    { label: '€5M - €10M', min: 5000000, max: 10000000 },
    { label: '€10M+', min: 10000000, max: undefined },
];

function BuyPageContent({ lang, dict, listingType = 'sale' }: BuyClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Dictionary shortcut - use proper section based on listing type
    const t = (listingType === 'rent' && dict?.rent_page)
        ? dict.rent_page
        : (dict?.buy_page || {
            hero_title: listingType === 'rent' ? "Luxury Properties for Rent" : "Luxury Properties for Sale",
            hero_subtitle: "Discover extraordinary homes across the world's most prestigious locations",
            search_placeholder: "Search by location, property name...",
            filters: {
                all_locations: "All Locations",
                all_types: "All Types",
                all_prices: "All Prices",
                clear: "Clear",
                clear_all: "Clear All Filters"
            },
            results: {
                found: "properties found",
                in: "in",
                matching: "matching",
                loading: "Loading properties...",
                error: "Error loading properties",
                no_results: "No properties found",
                try_adjusting: "Try adjusting your filters or search terms",
                load_more: "Load More Properties",
                showing: "Showing"
            }
        });

    // View state
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Dynamic filter options (loaded from API)
    const [availableLocations, setAvailableLocations] = useState<string[]>([]);
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [filtersLoaded, setFiltersLoaded] = useState(false);

    // Filter states - initialized from URL params
    const [selectedLocation, setSelectedLocation] = useState(t.filters.all_locations);
    const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
    const [selectedType, setSelectedType] = useState(t.filters.all_types);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Data states
    const [properties, setProperties] = useState<Property[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Initialize from URL params on mount
    useEffect(() => {
        const q = searchParams.get('q');
        const location = searchParams.get('location');
        const type = searchParams.get('type');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');

        if (q) setSearchQuery(q);
        if (location) setSelectedLocation(location);
        if (type) setSelectedType(type);

        // Find matching price range
        if (minPrice || maxPrice) {
            const min = minPrice ? Number(minPrice) : undefined;
            const max = maxPrice ? Number(maxPrice) : undefined;
            const index = priceRanges.findIndex(r => r.min === min && r.max === max);
            if (index > -1) setSelectedPriceIndex(index);
        }
    }, [searchParams]);

    // Load dynamic filter options from API
    useEffect(() => {
        const loadFilterOptions = async () => {
            const options = await SearchService.getFilterOptions();
            setAvailableLocations([t.filters.all_locations, ...options.locations]);
            setAvailableTypes([t.filters.all_types, ...options.types.map(t =>
                t.charAt(0).toUpperCase() + t.slice(1)
            )]);
            setFiltersLoaded(true);
        };
        loadFilterOptions();
    }, [t.filters.all_locations, t.filters.all_types]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        if (debouncedSearch) params.set('q', debouncedSearch);
        if (selectedLocation !== t.filters.all_locations) params.set('location', selectedLocation);
        if (selectedType !== t.filters.all_types) params.set('type', selectedType.toLowerCase());

        const priceRange = priceRanges[selectedPriceIndex];
        if (priceRange.min !== undefined) params.set('minPrice', priceRange.min.toString());
        if (priceRange.max !== undefined) params.set('maxPrice', priceRange.max.toString());

        const queryString = params.toString();
        const newUrl = queryString ? `/${lang}/buy?${queryString}` : `/${lang}/buy`;

        // Update URL without triggering navigation
        window.history.replaceState({}, '', newUrl);
    }, [debouncedSearch, selectedLocation, selectedType, selectedPriceIndex, lang, t.filters]);

    // Build query parameters from filters
    const buildQueryParams = useCallback(() => {
        const params = new URLSearchParams();

        params.set('page', currentPage.toString());
        params.set('limit', '12');

        // Location filter (country)
        if (selectedLocation !== t.filters.all_locations) {
            params.set('country', selectedLocation);
        }

        // Price filter
        const priceRange = priceRanges[selectedPriceIndex];
        if (priceRange.min !== undefined) {
            params.set('minPrice', priceRange.min.toString());
        }
        if (priceRange.max !== undefined) {
            params.set('maxPrice', priceRange.max.toString());
        }

        // Property type filter
        if (selectedType !== t.filters.all_types) {
            params.set('type', selectedType.toLowerCase());
        }

        // Search query
        if (debouncedSearch.trim()) {
            params.set('q', debouncedSearch.trim());
        }

        // Default sort (using valid schema value)
        params.set('sortBy', 'newest');

        // FORCE Listing Type
        params.set('listingType', listingType);

        return params.toString();
    }, [currentPage, selectedLocation, selectedPriceIndex, selectedType, debouncedSearch, t.filters, listingType]);

    // Fetch properties from API
    const fetchProperties = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const queryString = buildQueryParams();
            const response = await fetch(`/api/properties?${queryString}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                // Transform API response to component format
                const transformedProperties = result.data.map((prop: any) => ({
                    id: prop.id,
                    title: prop.title,
                    titleAr: prop.titleAr, // Ensure this is passed
                    location: {
                        city: prop.location?.city || prop.city || 'Unknown',
                        cityAr: prop.location?.cityAr,
                        country: prop.location?.country || prop.country || 'Unknown',
                        countryAr: prop.location?.countryAr,
                        address: prop.location?.address,
                    },
                    price: {
                        amount: prop.price?.amount || prop.price || 0,
                        currency: prop.price?.currency || 'EUR',
                    },
                    specs: {
                        bedrooms: prop.specs?.bedrooms || prop.bedrooms,
                        bathrooms: prop.specs?.bathrooms || prop.bathrooms,
                        livingAreaSqm: prop.specs?.livingAreaSqm || prop.area,
                        plotAreaSqm: prop.specs?.plotAreaSqm || prop.plot,
                    },
                    images: prop.images || [{ url: prop.image, alt: prop.title }],
                    slug: prop.slug,
                    type: prop.type,
                    flags: prop.flags,
                }));

                setProperties(transformedProperties);
                setPagination(result.pagination);
            } else {
                throw new Error(result.error || 'Failed to fetch properties');
            }
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError(err instanceof Error ? err.message : 'Failed to load properties');
            setProperties([]);
            setPagination(null);
        } finally {
            setIsLoading(false);
        }
    }, [buildQueryParams]);

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedLocation, selectedPriceIndex, selectedType, debouncedSearch]);


    // Handle pagination
    const handleLoadMore = () => {
        if (pagination?.hasNext) {
            setCurrentPage(prev => prev + 1);
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedLocation(t.filters.all_locations);
        setSelectedPriceIndex(0);
        setSelectedType(t.filters.all_types);
        setSearchQuery('');
        router.push(`/${lang}/buy`);
    };

    // Check if any filter is active
    const hasActiveFilters = selectedLocation !== t.filters.all_locations ||
        selectedPriceIndex !== 0 ||
        selectedType !== t.filters.all_types ||
        searchQuery.trim() !== '';

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Page Hero */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <em>{t.hero_title}</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        {t.hero_subtitle}
                    </p>
                </div>
            </section>

            {/* Filter Bar */}
            <section className={styles.filterSection}>
                <div className={styles.filterContainer}>
                    {/* Search */}
                    <div className={styles.searchBox}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder={t.search_placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search properties"
                        />
                        {searchQuery && (
                            <button
                                className={styles.clearSearchBtn}
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className={styles.filters}>
                        {/* Location Dropdown - DYNAMIC */}
                        <div className={styles.filterDropdown}>
                            <MapPin size={16} />
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                title="Filter by location"
                            >
                                {(filtersLoaded ? availableLocations : [t.filters.all_locations]).map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} />
                        </div>

                        {/* Price Dropdown */}
                        <div className={styles.filterDropdown}>
                            <select
                                value={selectedPriceIndex}
                                onChange={(e) => setSelectedPriceIndex(Number(e.target.value))}
                                title="Filter by price range"
                            >
                                {priceRanges.map((range, index) => (
                                    <option key={range.label} value={index}>{range.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} />
                        </div>

                        {/* Type Dropdown - DYNAMIC */}
                        <div className={styles.filterDropdown}>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                title="Filter by property type"
                            >
                                {(filtersLoaded ? availableTypes : [t.filters.all_types]).map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} />
                        </div>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <button
                                className={styles.clearFiltersBtn}
                                onClick={clearAllFilters}
                            >
                                <X size={14} />
                                {t.filters.clear}
                            </button>
                        )}
                    </div>

                    {/* View Toggle */}
                    <div className={styles.viewToggle}>
                        <button
                            className={viewMode === 'grid' ? styles.active : ''}
                            onClick={() => setViewMode('grid')}
                            aria-label="Grid view"
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            className={viewMode === 'list' ? styles.active : ''}
                            onClick={() => setViewMode('list')}
                            aria-label="List view"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Results Count & Active Filters Summary */}
                <div className={styles.resultsInfo}>
                    {isLoading ? (
                        <span>{t.results.loading}</span>
                    ) : error ? (
                        <span className={styles.errorText}>{t.results.error}</span>
                    ) : (
                        <span>
                            <strong>{pagination?.total || properties.length}</strong> {t.results.found}
                            {selectedLocation !== t.filters.all_locations && ` ${t.results.in} ${selectedLocation}`}
                            {debouncedSearch && ` ${t.results.matching} "${debouncedSearch}"`}
                        </span>
                    )}
                </div>
            </section>

            {/* Property Grid */}
            <section className={styles.propertiesSection}>
                {/* Loading State */}
                {isLoading && (
                    <div className={styles.loadingState}>
                        <Loader2 className={styles.spinner} size={40} />
                        <p>{t.results.loading}</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className={styles.errorState}>
                        <AlertCircle size={48} />
                        <h3>{t.results.error}</h3>
                        <p>{error}</p>
                        <button onClick={fetchProperties} className={styles.retryBtn}>
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && properties.length === 0 && (
                    <div className={styles.emptyState}>
                        <Search size={48} />
                        <h3>{t.results.no_results}</h3>
                        <p>{t.results.try_adjusting}</p>
                        <button
                            onClick={clearAllFilters}
                            className={styles.clearFiltersBtn}
                        >
                            {t.filters.clear_all}
                        </button>
                    </div>
                )}

                {/* Properties Grid */}
                {!isLoading && !error && properties.length > 0 && (
                    <>
                        <div className={`${styles.propertiesGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
                            {properties.map(property => (
                                <PropertyCard
                                    key={property.id}
                                    property={{
                                        id: property.id,
                                        title: property.title,
                                        titleAr: property.titleAr,
                                        location: {
                                            city: property.location.city,
                                            cityAr: property.location.cityAr,
                                            country: property.location.country,
                                            countryAr: property.location.countryAr
                                        },
                                        price: { amount: property.price.amount, currency: property.price.currency },
                                        images: property.images.map((img, idx) => ({
                                            id: `img-${property.id}-${idx}`,
                                            url: img.url,
                                            alt: img.alt || property.title,
                                            isPrimary: img.isPrimary || idx === 0,
                                            order: idx,
                                        })),
                                        slug: property.slug,
                                        type: (property.type || 'apartment') as any,
                                        listingType: listingType,
                                        specs: {
                                            bedrooms: property.specs?.bedrooms,
                                            bathrooms: property.specs?.bathrooms,
                                            livingAreaSqm: property.specs?.livingAreaSqm,
                                        },
                                    }}
                                    lang={lang}
                                    dict={dict}
                                />
                            ))}
                        </div>

                        {/* Pagination / Load More */}
                        {pagination && (
                            <div className={styles.paginationInfo}>
                                <span>
                                    {t.results.showing} {properties.length} {t.results.in} {pagination.total} {t.results.found}
                                </span>
                            </div>
                        )}

                        {pagination?.hasNext && (
                            <div className={styles.loadMore}>
                                <button
                                    className={styles.loadMoreBtn}
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                >
                                    {isLoading ? t.results.loading : t.results.load_more}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </PageLayout>
    );
}

// Wrap with Suspense for useSearchParams
export default function BuyClient({ lang, dict, listingType = 'sale' }: BuyClientProps) {
    return (
        <Suspense fallback={
            <PageLayout lang={lang} dict={dict}>
                <div className={styles.suspenseFallback}>
                    <Loader2 className={styles.spinner} size={40} />
                </div>
            </PageLayout>
        }>
            <BuyPageContent lang={lang} dict={dict} listingType={listingType} />
        </Suspense>
    );
}
