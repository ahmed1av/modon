/**
 * MODON Platform - Property Entity (Core Layer)
 * =============================================
 * Pure business logic with no external dependencies
 * Following CoreX Clean Architecture principles
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type PropertyStatus = 'draft' | 'pending' | 'active' | 'published' | 'sold' | 'rented' | 'archived';
export type PropertyType = 'house' | 'villa' | 'apartment' | 'penthouse' | 'land' | 'commercial';
export type ListingType = 'sale' | 'rent';
export type RentalPeriod = 'day' | 'week' | 'month' | 'year';

// ============================================
// PROPERTY SPECIFICATIONS
// ============================================

export interface PropertySpecs {
    bedrooms?: number;
    bathrooms?: number;
    livingAreaSqm?: number;    // Living area in m²
    plotAreaSqm?: number;      // Plot size in m²
    totalFloors?: number;
    floorNumber?: number;      // For apartments
    garages?: number;
    pool?: boolean;
    garden?: boolean;
    terrace?: boolean;
    seaview?: boolean;
    yearBuilt?: number;
    yearRenovated?: number;
}

// ============================================
// LOCATION
// ============================================

export interface PropertyLocation {
    address: string;
    addressLine2?: string;
    city: string;
    state?: string;
    region?: string;
    country: string;
    postalCode?: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    hideExactLocation?: boolean;
}

// ============================================
// PRICING
// ============================================

export interface PropertyPrice {
    amount: number;
    currency: string;
    pricePerSqm?: number;
    priceOnRequest?: boolean;
    previousPrice?: number;
    rentalPeriod?: RentalPeriod;
    deposit?: number;
}

// ============================================
// MEDIA
// ============================================

export interface PropertyImage {
    id: string;
    url: string;
    thumbnailUrl?: string;
    webpUrl?: string;
    avifUrl?: string;
    alt: string;
    caption?: string;
    order: number;
    isPrimary: boolean;
    isFloorPlan?: boolean;
}

// ============================================
// FEATURES
// ============================================

export interface PropertyFeature {
    id?: string;
    name: string;
    category: string;
    icon?: string;
}

// ============================================
// FLAGS
// ============================================

export interface PropertyFlags {
    featured: boolean;
    exclusive: boolean;
    newDevelopment: boolean;
    offMarket: boolean;
    acceptsCrypto: boolean;
}

// ============================================
// ANALYTICS
// ============================================

export interface PropertyAnalytics {
    views: number;
    inquiries: number;
    favorites: number;
    shares: number;
}

// ============================================
// SEO
// ============================================

export interface PropertySEO {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
}

// ============================================
// AGENT/AGENCY (Embedded)
// ============================================

export interface PropertyAgent {
    id: string;
    name: string;
    title?: string;
    avatar?: string;
    phone?: string;
    email?: string;
}

export interface PropertyAgency {
    id: string;
    name: string;
    slug: string;
    logo?: string;
}

// ============================================
// MAIN PROPERTY INTERFACE
// ============================================

export interface Property {
    id: string;
    referenceCode?: string;
    slug: string;
    title: string;
    headline?: string;
    description: string;
    descriptionAr?: string;
    shortDescription?: string;

    // Type & Status
    type: PropertyType;
    listingType: ListingType;
    status: PropertyStatus;

    // Flags (legacy compatibility)
    isFeatured?: boolean;
    isOffMarket?: boolean;
    isExclusive?: boolean;

    // New Flags structure
    flags?: PropertyFlags;

    // Location
    location: PropertyLocation;

    // Specifications
    specs: PropertySpecs;

    // Pricing
    price: PropertyPrice;

    // Media
    images: PropertyImage[];
    videoUrl?: string;
    virtualTourUrl?: string;
    floorPlanUrl?: string;

    // Features
    features: PropertyFeature[];
    amenities?: string[];
    nearbyPlaces?: string[];
    lifestyle?: string[];

    // Energy
    energyRating?: string;

    // Agent & Ownership
    agentId?: string;
    agencyId?: string;
    ownerId?: string;

    // Embedded data (from joins)
    agent?: PropertyAgent;
    agency?: PropertyAgency;

    // SEO
    seo?: PropertySEO;
    metaTitle?: string;
    metaDescription?: string;

    // Analytics
    analytics?: PropertyAnalytics;
    viewCount?: number;
    inquiryCount?: number;
    favoriteCount?: number;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    availableFrom?: Date;
    listedAt?: Date;
    publishedAt?: Date;
    soldAt?: Date;
}

// ============================================
// PROPERTY FACTORY
// ============================================

/**
 * Property Entity Factory - Creates a new property with defaults
 */
export function createProperty(
    data: Partial<Property> & Pick<Property, 'title' | 'type' | 'listingType' | 'location' | 'specs' | 'price'>
): Property {
    const now = new Date();

    return {
        id: data.id || generateId(),
        referenceCode: data.referenceCode,
        slug: data.slug || generateSlug(data.title),
        title: data.title,
        headline: data.headline,
        description: data.description || '',
        descriptionAr: data.descriptionAr,
        shortDescription: data.shortDescription,

        type: data.type,
        listingType: data.listingType,
        status: data.status || 'draft',

        isFeatured: data.isFeatured || false,
        isOffMarket: data.isOffMarket || false,
        isExclusive: data.isExclusive || false,

        flags: data.flags || {
            featured: false,
            exclusive: false,
            newDevelopment: false,
            offMarket: false,
            acceptsCrypto: false,
        },

        location: data.location,
        specs: data.specs,
        price: calculatePricePerMeter(data.price, data.specs.livingAreaSqm || 0),

        images: data.images || [],
        videoUrl: data.videoUrl,
        virtualTourUrl: data.virtualTourUrl,
        floorPlanUrl: data.floorPlanUrl,

        features: data.features || [],
        amenities: data.amenities || [],
        nearbyPlaces: data.nearbyPlaces || [],
        lifestyle: data.lifestyle,
        energyRating: data.energyRating,

        agentId: data.agentId,
        agencyId: data.agencyId,
        ownerId: data.ownerId,

        agent: data.agent,
        agency: data.agency,

        seo: data.seo,
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || data.shortDescription,

        analytics: data.analytics || {
            views: 0,
            inquiries: 0,
            favorites: 0,
            shares: 0,
        },
        viewCount: data.viewCount || 0,
        inquiryCount: data.inquiryCount || 0,
        favoriteCount: data.favoriteCount || 0,

        createdAt: data.createdAt || now,
        updatedAt: data.updatedAt || now,
        availableFrom: data.availableFrom,
        listedAt: data.listedAt,
        publishedAt: data.publishedAt,
        soldAt: data.soldAt,
    };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate price per square meter
 */
function calculatePricePerMeter(price: PropertyPrice, area: number): PropertyPrice {
    return {
        ...price,
        pricePerSqm: area > 0 ? Math.round(price.amount / area) : undefined,
    };
}

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Generate unique ID (simplified)
 */
function generateId(): string {
    return `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// BUSINESS RULES
// ============================================

export function canPublish(property: Property): boolean {
    return (
        property.status === 'draft' &&
        property.title.length > 0 &&
        property.description.length >= 100 &&
        property.images.length >= 3 &&
        property.price.amount > 0
    );
}

export function canMarkAsSold(property: Property): boolean {
    return (property.status === 'published' || property.status === 'active') &&
        property.listingType === 'sale';
}

export function isPremiumProperty(property: Property): boolean {
    return property.price.amount >= 5000000; // €5M+
}

export function hasVirtualTour(property: Property): boolean {
    return !!property.virtualTourUrl;
}

export function getDisplayPrice(property: Property): string {
    if (property.price.priceOnRequest) {
        return 'Price on Request';
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: property.price.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formatter.format(property.price.amount);
}

export function getPrimaryImage(property: Property): PropertyImage | undefined {
    return property.images.find(img => img.isPrimary) || property.images[0];
}
