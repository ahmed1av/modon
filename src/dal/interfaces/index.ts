/**
 * MODON Platform - Repository Interfaces (DAL Layer)
 * ===================================================
 * Contracts for data access - enables dependency inversion
 */

import { Property, PropertyStatus, PropertyType, ListingType } from '@/core/entities/Property';
import { User, UserRole, UserStatus } from '@/core/entities/User';

// ============================================
// COMMON TYPES
// ============================================

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev?: boolean;
        hasPrevious?: boolean;
    };
}

export interface SortOptions {
    field: string;
    direction: 'asc' | 'desc';
}

// ============================================
// PROPERTY REPOSITORY
// ============================================

export interface PropertySearchCriteria {
    query?: string;
    type?: PropertyType | PropertyType[];
    listingType?: ListingType;
    status?: PropertyStatus;

    city?: string;
    region?: string;
    country?: string;

    minPrice?: number;
    maxPrice?: number;
    currency?: string;

    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;

    minArea?: number;
    maxArea?: number;

    features?: string[];
    lifestyle?: string[];

    hasPool?: boolean;
    hasGarden?: boolean;
    hasSeaview?: boolean;

    // Flags (both naming conventions)
    isFeatured?: boolean;
    isOffMarket?: boolean;
    isExclusive?: boolean;
    featured?: boolean;
    exclusive?: boolean;

    agentId?: string;
    agencyId?: string;

    // Pagination
    page?: number;
    limit?: number;
    sort?: SortOptions;

    // Alternative sorting (repository compatibility)
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface IPropertyRepository {
    // CRUD Operations
    findById(id: string): Promise<Property | null>;
    findBySlug(slug: string): Promise<Property | null>;
    findByReferenceCode?(referenceCode: string): Promise<Property | null>;
    findAll(criteria?: PropertySearchCriteria): Promise<PaginatedResult<Property>>;
    create(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property>;
    update(id: string, data: Partial<Property>): Promise<Property>;
    delete(id: string): Promise<void>;

    // Specialized Queries
    findFeatured(limit?: number): Promise<Property[]>;
    findExclusive?(limit?: number): Promise<Property[]>;
    findByAgent(agentId: string, criteria?: PropertySearchCriteria): Promise<PaginatedResult<Property>>;
    findByAgency?(agencyId: string, criteria?: PropertySearchCriteria): Promise<PaginatedResult<Property>>;
    findByCity?(city: string, page?: number, limit?: number): Promise<PaginatedResult<Property>>;
    findSimilar(propertyId: string, limit?: number): Promise<Property[]>;
    findRecent?(limit?: number): Promise<Property[]>;
    findByLocation?(latitude: number, longitude: number, radiusKm: number, limit?: number): Promise<Property[]>;

    // Status Management
    publish?(id: string): Promise<Property>;
    unpublish?(id: string): Promise<Property>;
    markAsSold?(id: string, soldAt?: Date): Promise<Property>;
    archive?(id: string): Promise<Property>;

    // Analytics
    incrementViews?(id: string): Promise<void>;
    incrementShares?(id: string): Promise<void>;
    incrementViewCount?(id: string): Promise<void>;
    incrementInquiryCount?(id: string): Promise<void>;
    incrementFavoriteCount?(id: string): Promise<void>;
    decrementFavoriteCount?(id: string): Promise<void>;
    getAnalytics?(propertyId: string): Promise<{
        views: number;
        inquiries: number;
        favorites: number;
        shares: number;
        viewsHistory?: { date: string; count: number }[];
    }>;

    // Aggregations
    countByStatus?: (status?: PropertyStatus) => Promise<number | Record<PropertyStatus, number>>;
    countByType?(type: PropertyType): Promise<number>;
    countByCity?(): Promise<Record<string, number>>;
    getAveragePrice?(criteria?: PropertySearchCriteria): Promise<number>;
    getPriceRange?(criteria?: PropertySearchCriteria): Promise<{ min: number; max: number }>;
}

// ============================================
// USER REPOSITORY
// ============================================

export interface UserSearchCriteria {
    query?: string;
    role?: UserRole;
    status?: UserStatus;
    emailVerified?: boolean;

    page?: number;
    limit?: number;
    sort?: SortOptions;
}

export interface IUserRepository {
    // CRUD Operations
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(criteria?: UserSearchCriteria): Promise<PaginatedResult<User>>;
    create(user: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: string;
    }): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
    exists(email: string): Promise<boolean>;

    // Password & Auth
    verifyPassword(email: string, password: string): Promise<User | null>;
    updatePassword(id: string, passwordHash: string): Promise<void>;

    // Session Management
    createSession(userId: string, refreshTokenHash: string, metadata: {
        ip: string;
        userAgent: string;
    }): Promise<void>;
    findSession?(refreshTokenHash: string): Promise<{
        userId: string;
        refreshTokenHash: string;
        isValid: boolean;
    } | null>;
    revokeSession?(refreshTokenHash: string): Promise<void>;
    revokeAllSessions?(userId: string): Promise<void>;

    // Agent-specific
    findAgents?(page?: number, limit?: number): Promise<PaginatedResult<User>>;
    findAgentsByCity?(city: string): Promise<User[]>;
    findTopAgents?(limit?: number): Promise<User[]>;

    // Auth-related
    verifyEmail?(id: string): Promise<User>;
    updateLastLogin(id: string, ip?: string): Promise<void>;

    // Status Management
    activate?(id: string): Promise<User>;
    suspend?(id: string): Promise<User>;
    deactivate?(id: string): Promise<User>;

    // Preferences
    updatePreferences?(id: string, preferences: Partial<User['preferences']>): Promise<User>;
    updateProfile?(id: string, profile: Partial<User['profile']>): Promise<User>;

    // 2FA
    enable2FA?(id: string, secret: string): Promise<void>;
    disable2FA?(id: string): Promise<void>;
}

// ============================================
// INQUIRY REPOSITORY
// ============================================

export interface Inquiry {
    id: string;
    propertyId: string;
    userId?: string;
    agentId: string;

    name: string;
    email: string;
    phone?: string;
    message: string;

    preferredContact?: 'email' | 'phone' | 'whatsapp';
    requestViewing: boolean;
    viewingDate?: Date;

    status: 'new' | 'read' | 'replied' | 'closed';

    createdAt: Date;
    updatedAt: Date;
    readAt?: Date;
    repliedAt?: Date;
}

export interface InquirySearchCriteria {
    propertyId?: string;
    agentId?: string;
    userId?: string;
    status?: Inquiry['status'];

    page?: number;
    limit?: number;
    sort?: SortOptions;
}

export interface IInquiryRepository {
    findById(id: string): Promise<Inquiry | null>;
    findAll(criteria?: InquirySearchCriteria): Promise<PaginatedResult<Inquiry>>;
    create(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inquiry>;
    update(id: string, data: Partial<Inquiry>): Promise<Inquiry>;
    delete(id: string): Promise<void>;

    findByProperty(propertyId: string): Promise<Inquiry[]>;
    findByAgent(agentId: string): Promise<Inquiry[]>;
    findByUser(userId: string): Promise<Inquiry[]>;

    markAsRead(id: string): Promise<Inquiry>;
    markAsReplied(id: string): Promise<Inquiry>;
    close(id: string): Promise<Inquiry>;

    countByStatus(agentId: string): Promise<Record<Inquiry['status'], number>>;
    countUnread(agentId: string): Promise<number>;
}

// ============================================
// FAVORITE REPOSITORY
// ============================================

export interface Favorite {
    id: string;
    userId: string;
    propertyId: string;
    createdAt: Date;
}

export interface IFavoriteRepository {
    findByUser(userId: string, page?: number, limit?: number): Promise<PaginatedResult<Favorite>>;
    findByProperty(propertyId: string): Promise<Favorite[]>;

    add(userId: string, propertyId: string): Promise<Favorite>;
    remove(userId: string, propertyId: string): Promise<void>;

    isFavorite(userId: string, propertyId: string): Promise<boolean>;
    countByProperty(propertyId: string): Promise<number>;
    countByUser(userId: string): Promise<number>;
}

// ============================================
// SEARCH HISTORY REPOSITORY
// ============================================

export interface SearchHistory {
    id: string;
    userId: string;
    query: string;
    filters: Record<string, unknown>;
    resultCount: number;
    createdAt: Date;
}

export interface ISearchHistoryRepository {
    findByUser(userId: string, limit?: number): Promise<SearchHistory[]>;
    create(history: Omit<SearchHistory, 'id' | 'createdAt'>): Promise<SearchHistory>;
    delete(id: string): Promise<void>;
    clearByUser(userId: string): Promise<void>;

    getPopularSearches(limit?: number): Promise<Array<{ query: string; count: number }>>;
}
