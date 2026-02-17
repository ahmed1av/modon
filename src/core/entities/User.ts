/**
 * MODON Platform - User Entity (Core Layer)
 * ==========================================
 * Pure business logic with no external dependencies
 */

export type UserRole = 'buyer' | 'agent' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface UserPreferences {
    language: string;
    currency: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
    theme: 'light' | 'dark' | 'system';
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    company?: string;
    jobTitle?: string;
    website?: string;
}

export interface UserAddress {
    street?: string;
    city?: string;
    region?: string;
    country: string;
    postalCode?: string;
}

export interface User {
    id: string;
    email: string;
    emailVerified: boolean;

    role: UserRole;
    status: UserStatus;

    profile: UserProfile;
    address?: UserAddress;
    preferences: UserPreferences;

    // Agent-specific fields
    agentLicense?: string;
    agentRating?: number;
    agentReviewCount?: number;
    specializations?: string[];

    // Admin fields
    permissions?: string[];

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;

    // Security
    twoFactorEnabled: boolean;

    // Analytics
    propertyCount?: number;
    inquiryCount?: number;
}

/**
 * Create new user with defaults
 */
export function createUser(
    data: Pick<User, 'email' | 'role'> & { profile: Partial<UserProfile> }
): User {
    const now = new Date();

    return {
        id: generateUserId(),
        email: data.email.toLowerCase(),
        emailVerified: false,

        role: data.role,
        status: 'pending_verification',

        profile: {
            firstName: data.profile.firstName || '',
            lastName: data.profile.lastName || '',
            phone: data.profile.phone,
            avatar: data.profile.avatar,
            bio: data.profile.bio,
            company: data.profile.company,
            jobTitle: data.profile.jobTitle,
            website: data.profile.website,
        },

        preferences: getDefaultPreferences(),

        createdAt: now,
        updatedAt: now,

        twoFactorEnabled: false,
    };
}

/**
 * Default user preferences
 */
function getDefaultPreferences(): UserPreferences {
    return {
        language: 'en',
        currency: 'EUR',
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        newsletter: false,
        theme: 'light',
    };
}

/**
 * Generate unique user ID
 */
function generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * User Business Rules
 */
export function getFullName(user: User): string {
    return `${user.profile.firstName} ${user.profile.lastName}`.trim() || user.email;
}

export function isVerified(user: User): boolean {
    return user.emailVerified && user.status === 'active';
}

export function canCreateListings(user: User): boolean {
    return user.role === 'agent' || user.role === 'admin' || user.role === 'super_admin';
}

export function canManageUsers(user: User): boolean {
    return user.role === 'admin' || user.role === 'super_admin';
}

export function isAgent(user: User): boolean {
    return user.role === 'agent';
}

export function isAdmin(user: User): boolean {
    return user.role === 'admin' || user.role === 'super_admin';
}

export function hasPermission(user: User, permission: string): boolean {
    if (user.role === 'super_admin') return true;
    return user.permissions?.includes(permission) ?? false;
}
