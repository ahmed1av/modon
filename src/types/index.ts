/**
 * Shared TypeScript Types for MODON Platform
 * ===========================================
 * Replaces all 'any' types with strict interfaces
 * CRITICAL FIX #7: Excessive Use of 'any' Type
 */

// ============================================
// PROPERTY TYPES
// ============================================

export interface PropertyImage {
    id: string;
    url: string;
    alt?: string;
    thumbnailUrl?: string;
    webpUrl?: string;
    avifUrl?: string;
    caption?: string;
    isPrimary: boolean;
    isFloorPlan?: boolean;
    order: number;
}

export interface PropertyLocation {
    address: string;
    addressLine2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    hideExactLocation?: boolean;
}

export interface PropertyPrice {
    amount: number;
    currency: string;
    pricePerSqm?: number;
    priceOnRequest?: boolean;
    rentalPeriod?: 'monthly' | 'yearly' | 'weekly';
    deposit?: number;
}

export interface PropertySpecs {
    bedrooms?: number;
    bathrooms?: number;
    livingAreaSqm?: number;
    plotAreaSqm?: number;
    totalFloors?: number;
    floorNumber?: number;
    yearBuilt?: number;
    yearRenovated?: number;
}

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

export interface Property {
    id: string;
    referenceCode: string;
    slug: string;
    type: PropertyType;
    listingType: ListingType;
    status: PropertyStatus;
    title: string;
    headline?: string;
    description: string;
    descriptionAr?: string;
    location: PropertyLocation;
    price: PropertyPrice;
    specs: PropertySpecs;
    images: PropertyImage[];
    features?: PropertyFeature[];
    amenities?: string[];
    nearbyPlaces?: string[];
    energyRating?: string;
    virtualTourUrl?: string;
    videoUrl?: string;
    floorPlanUrl?: string;
    agentId?: string;
    agencyId?: string;
    agent?: PropertyAgent;
    agency?: PropertyAgency;
    flags?: PropertyFlags;
    analytics?: PropertyAnalytics;
    seo?: PropertySEO;
    availableFrom?: Date;
    listedAt?: Date;
    soldAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type PropertyType =
    | 'apartment'
    | 'villa'
    | 'townhouse'
    | 'penthouse'
    | 'duplex'
    | 'land'
    | 'commercial'
    | 'office';

export type ListingType = 'sale' | 'rent' | 'off-market';

export type PropertyStatus = 'draft' | 'active' | 'sold' | 'rented' | 'off_market';

export interface PropertyFeature {
    id: string;
    name: string;
    category: string;
}

export interface PropertyFlags {
    featured: boolean;
    exclusive: boolean;
    newDevelopment: boolean;
    offMarket: boolean;
    acceptsCrypto: boolean;
}

export interface PropertyAnalytics {
    views: number;
    inquiries: number;
    favorites: number;
    shares: number;
}

export interface PropertySEO {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
}

// Simplified property for listings (reduced payload)
export interface PropertyListItem {
    id: string;
    slug: string;
    title: string;
    titleAr?: string;
    location: {
        city: string;
        cityAr?: string;
        country: string;
        countryAr?: string;
    };
    price: {
        amount: number;
        currency: string;
    };
    specs?: {
        bedrooms?: number;
        bathrooms?: number;
        livingAreaSqm?: number;
    };
    images: PropertyImage[];
    type: PropertyType;
    listingType: ListingType;
    featured?: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T = unknown> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// ============================================
// SEARCH & FILTER TYPES
// ============================================

export interface SearchFilters {
    query?: string;
    type?: PropertyType | PropertyType[];
    listingType?: ListingType;
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    minArea?: number;
    maxArea?: number;
    featured?: boolean;
    exclusive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'price' | 'createdAt' | 'views' | 'favorites';
    sortOrder?: 'asc' | 'desc';
}

export interface SearchSuggestion {
    type: 'location' | 'property';
    text: string;
    subtext?: string;
    id: string;
}

// ============================================
// DICTIONARY (i18n) TYPES
// ============================================

export interface Dictionary {
    common: {
        loading: string;
        error: string;
        view_all: string;
        read_more: string;
        contact_us: string;
        learn_more: string;
    };
    nav: {
        buy: string;
        rent: string;
        sell: string;
        sell_menu: string;
        sell_private: string;
        sell_professional: string;
        sell_developer: string;
        new_developments: string;
        property_finders: string;
        off_market: string;
        off_market_buy: string;
        off_market_sell: string;
        about: string;
        about_company: string;
        about_team: string;
        about_agents: string;
        contact: string;
        favorites: string;
    };
    hero: {
        title_line1: string;
        title_line2: string;
        search_placeholder: string;
        search_button: string;
    };
    home: {
        about: {
            title_line1: string;
            title_line2: string;
            title_highlight: string;
            text1: string;
            text2: string;
        };
        bespoke: {
            title_line1: string;
            title_line2: string;
            text: string;
            cta: string;
        };
        featured: {
            title: string;
            view_all: string;
            loading: string;
        };
        prefer: {
            title_line1: string;
            title_line2: string;
            list: string[];
        };
        equestrian: {
            title: string;
            cta: string;
        };
        guide: {
            title: string;
            subtitle: string;
            text1: string;
            text2: string;
        };
        access_form: {
            title: string;
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
            message: string;
            marketing_consent_start: string;
            privacy_policy: string;
            marketing_consent_end: string;
            submit: string;
        };
    };
    footer: {
        columns: {
            buy: string;
            property_finders: string;
            sell: string;
            off_market: string;
            about: string;
            contact: string;
        };
        links: {
            all_types: string;
            residential: string;
            commercial: string;
            industrial: string;
            bespoke: string;
            how_it_works: string;
            private_seller: string;
            professional_seller: string;
            developers: string;
            sell_off: string;
            buy_off: string;
            company: string;
            team: string;
            agents: string;
            investors: string;
            get_in_touch: string;
            locations: string;
        };
        contact_info: {
            phone: string;
            address: string;
        };
        legal: {
            privacy: string;
            terms: string;
            copyright: string;
        };
    };
    property_card: {
        sqm: string;
        beds: string;
        baths: string;
        view_details: string;
        featured: string;
        price_on_request: string;
        add_favorite: string;
        remove_favorite: string;
    };
    buy_page: {
        hero_title: string;
        hero_subtitle: string;
        search_placeholder: string;
        filters: {
            all_locations: string;
            all_types: string;
            all_prices: string;
            clear: string;
            clear_all: string;
        };
        results: {
            found: string;
            in: string;
            matching: string;
            loading: string;
            error: string;
            no_results: string;
            try_adjusting: string;
            load_more: string;
            showing: string;
        };
    };
    rent_page: {
        hero_title: string;
        hero_subtitle: string;
        search_placeholder: string;
        filters: {
            all_locations: string;
            all_types: string;
            all_prices: string;
            clear: string;
            clear_all: string;
        };
        results: {
            found: string;
            in: string;
            matching: string;
            loading: string;
            error: string;
            no_results: string;
            try_adjusting: string;
            load_more: string;
            showing: string;
        };
    };
    our_company: {
        hero_title: string;
        hero_subtitle: string;
        intro_title_1: string;
        intro_title_2: string;
        intro_text_1: string;
        intro_text_2: string;
        values_title: string;
        values: {
            client_first: { title: string; description: string };
            global_perspective: { title: string; description: string };
            excellence: { title: string; description: string };
            trust_integrity: { title: string; description: string };
        };
        timeline_title: string;
        milestones: {
            founded: { title: string; description: string };
            expansion: { title: string; description: string };
            network: { title: string; description: string };
            digital: { title: string; description: string };
        };
        quote: string;
        quote_author: string;
        team_cta: {
            title: string;
            text: string;
            button: string;
        };
    };
    management_team: {
        hero_title: string;
        hero_subtitle: string;
        members: {
            name: string;
            role: string;
            image: string;
            bio: string;
            linkedin?: string;
            email?: string;
        }[];
        join_team: {
            title: string;
            text: string;
            button: string;
        };
    };
    real_estate_agents: {
        hero_title: string;
        hero_subtitle: string;
        intro_title: string;
        intro_text: string;
        members: {
            name: string;
            title: string;
            region: string;
            specialization: string;
            image: string;
            email: string;
        }[];
        join_team: {
            title: string;
            text: string;
            button: string;
        };
        contact_button: string;
    };
    contact_page: {
        title: string;
        subtitle: string;
        form: {
            name: string;
            email: string;
            phone: string;
            message: string;
            submit: string;
        };
        contact_info: {
            address: string;
            phone: string;
            email: string;
        };
    };
    property_details: {
        title_suffix: string;
        not_found: {
            title: string;
            description: string;
        };
        breadcrumb: {
            home: string;
            buy: string;
        };
        badges: {
            exclusive: string;
            featured: string;
        };
        price: {
            per_meter: string;
        };
        ref: string;
        stats: {
            bedrooms: string;
            bathrooms: string;
            living_area: string;
            plot_size: string;
        };
        sections: {
            description: string;
            virtual_tour: string;
            features: string;
            details: string;
        };
        specs: {
            type: string;
            bedrooms: string;
            bathrooms: string;
        };
        contact_form: {
            title: string;
            subtitle: string;
            name: string;
            email: string;
            phone: string;
            message: string;
            submit: string;
            sending: string;
            sent_title: string;
            sent_desc: string;
            send_another: string;
            failed: string;
            privacy: string;
            privacy_link: string;
            preferred: string;
            schedule: string;
        };
        actions: {
            save: string;
            saved: string;
            share: string;
            pdf: string;
            generating: string;
            link_copied: string;
        };
    };
    investors: {
        hero_title: string;
        hero_subtitle: string;
        problem_title: string;
        problem_text: string;
        solution_title: string;
        solution_text: string;
        market_title: string;
        market_cap: string;
        business_model_title: string;
        revenue_streams: string[];
        tech_title: string;
        tech_stack: string[];
        demo_title: string;
        cta: string;
        contact_sales: string;
    };
}

// ============================================
// USER & AUTH TYPES
// ============================================

export type UserRole = 'buyer' | 'agent' | 'admin' | 'super_admin';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    profile: {
        firstName: string;
        lastName: string;
        phone?: string;
        avatar?: string;
    };
    preferences?: {
        language: 'en' | 'ar';
        currency: string;
        notifications: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthSession {
    userId: string;
    email: string;
    role: UserRole;
    permissions: string[];
    expiresAt: Date;
}

// ============================================
// LEAD / INQUIRY TYPES
// ============================================

export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
    propertyId?: string;
    source: 'contact_form' | 'property_inquiry' | 'newsletter';
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

export interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    propertySlug?: string;
    source?: string;
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface HomeClientProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export interface BuyClientProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
    searchParams?: Record<string, string | string[] | undefined>;
}

export interface PropertyCardProps {
    property: PropertyListItem;
    lang?: 'en' | 'ar';
    dict?: Dictionary;
    showFavorite?: boolean;
    onFavoriteToggle?: (propertyId: string) => void;
}

export interface PropertyDetailProps {
    property: Property;
    lang: 'en' | 'ar';
    dict: Dictionary;
}

// ============================================
// FORM VALIDATION TYPES
// ============================================

export interface ValidationError {
    field: string;
    message: string;
}

export interface FormState<T> {
    data: T;
    errors: ValidationError[];
    isSubmitting: boolean;
    isValid: boolean;
}
