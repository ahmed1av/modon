/**
 * MODON Platform - Zod Schemas (Contracts Layer)
 * ===============================================
 * Single source of truth for validation
 */

import { z } from 'zod';

// ============================================
// PROPERTY SCHEMAS
// ============================================

export const PropertyLocationSchema = z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    region: z.string().min(2, 'Region is required'),
    country: z.string().min(2, 'Country is required'),
    postalCode: z.string().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});

export const PropertySpecsSchema = z.object({
    bedrooms: z.number().int().min(0).max(50),
    bathrooms: z.number().int().min(0).max(30),
    area: z.number().min(1, 'Area must be at least 1 m²'),
    plot: z.number().min(0).optional(),
    floors: z.number().int().min(1).max(100).optional(),
    garages: z.number().int().min(0).optional(),
    pool: z.boolean().optional(),
    garden: z.boolean().optional(),
    terrace: z.boolean().optional(),
    seaview: z.boolean().optional(),
    yearBuilt: z.number().int().min(1800).max(2100).optional(),
});

export const PropertyPriceSchema = z.object({
    amount: z.number().min(0, 'Price must be positive'),
    currency: z.enum(['EUR', 'USD', 'GBP', 'AED', 'SAR']),
    pricePerMeter: z.number().optional(),
    previousPrice: z.number().optional(),
});

export const PropertyImageSchema = z.object({
    id: z.string(),
    url: z.string().url('Invalid image URL'),
    alt: z.string().min(1, 'Alt text is required'),
    order: z.number().int().min(0),
    isPrimary: z.boolean(),
});

export const PropertyFeatureSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    icon: z.string().optional(),
});

export const PropertyStatusSchema = z.enum([
    'draft',
    'pending',
    'published',
    'sold',
    'rented',
    'archived',
]);

export const PropertyTypeSchema = z.enum([
    'house',
    'villa',
    'apartment',
    'penthouse',
    'land',
    'commercial',
]);

export const ListingTypeSchema = z.enum(['sale', 'rent']);

export const PropertySchema = z.object({
    id: z.string().optional(),
    slug: z.string().optional(),
    title: z.string().min(10, 'Title must be at least 10 characters'),
    description: z.string().min(100, 'Description must be at least 100 characters'),
    shortDescription: z.string().max(300).optional(),

    type: PropertyTypeSchema,
    listingType: ListingTypeSchema,
    status: PropertyStatusSchema.optional().default('draft'),

    isFeatured: z.boolean().default(false),
    isOffMarket: z.boolean().default(false),
    isExclusive: z.boolean().default(false),

    location: PropertyLocationSchema,
    specs: PropertySpecsSchema,
    price: PropertyPriceSchema,

    images: z.array(PropertyImageSchema).min(3, 'At least 3 images required'),
    videoUrl: z.string().url().optional(),
    virtualTourUrl: z.string().url().optional(),
    floorPlanUrl: z.string().url().optional(),

    features: z.array(PropertyFeatureSchema).optional().default([]),
    lifestyle: z.array(z.string()).optional(),

    agentId: z.string(),
    ownerId: z.string().optional(),

    metaTitle: z.string().max(70).optional(),
    metaDescription: z.string().max(160).optional(),
});

export const CreatePropertySchema = PropertySchema.omit({
    id: true,
    slug: true,
    status: true,
});

export const UpdatePropertySchema = PropertySchema.partial();

// ============================================
// SEARCH SCHEMAS
// ============================================

export const PropertySearchSchema = z.object({
    query: z.string().optional(),
    type: PropertyTypeSchema.optional(),
    listingType: ListingTypeSchema.optional(),

    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),

    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    currency: z.enum(['EUR', 'USD', 'GBP', 'AED', 'SAR']).optional(),

    minBedrooms: z.number().int().min(0).optional(),
    maxBedrooms: z.number().int().min(0).optional(),
    minBathrooms: z.number().int().min(0).optional(),
    maxBathrooms: z.number().int().min(0).optional(),

    minArea: z.number().min(0).optional(),
    maxArea: z.number().min(0).optional(),

    features: z.array(z.string()).optional(),
    lifestyle: z.array(z.string()).optional(),

    hasPool: z.boolean().optional(),
    hasGarden: z.boolean().optional(),
    hasSeaview: z.boolean().optional(),

    isFeatured: z.boolean().optional(),
    isOffMarket: z.boolean().optional(),

    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'oldest', 'area']).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
});

// ============================================
// USER SCHEMAS
// ============================================

export const UserRoleSchema = z.enum(['buyer', 'agent', 'admin', 'super_admin']);

export const UserProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
    avatar: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    website: z.string().url().optional(),
});

export const UserPreferencesSchema = z.object({
    language: z.enum(['en', 'ar', 'nl', 'es', 'de']),
    currency: z.enum(['EUR', 'USD', 'GBP', 'AED', 'SAR']),
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'system']),
});

// ============================================
// AUTH SCHEMAS
// ============================================

export const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional().default(false),
});

export const RegisterSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain uppercase, lowercase, number, and special character'
        ),
    confirmPassword: z.string(),
    profile: UserProfileSchema.pick({ firstName: true, lastName: true }),
    acceptTerms: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
    token: z.string().min(1),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain uppercase, lowercase, number, and special character'
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

// ============================================
// INQUIRY SCHEMAS
// ============================================

export const InquirySchema = z.object({
    propertyId: z.string(),
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
    preferredContact: z.enum(['email', 'phone', 'whatsapp']).optional(),
    requestViewing: z.boolean().optional(),
    viewingDate: z.string().datetime().optional(),
});

// ============================================
// API RESPONSE SCHEMAS
// ============================================

export const PaginationSchema = z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
});

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
    z.object({
        success: z.boolean(),
        data: dataSchema.optional(),
        error: z.string().optional(),
        message: z.string().optional(),
        pagination: PaginationSchema.optional(),
    });

// ============================================
// TYPE EXPORTS
// ============================================

export type PropertyLocation = z.infer<typeof PropertyLocationSchema>;
export type PropertySpecs = z.infer<typeof PropertySpecsSchema>;
export type PropertyPrice = z.infer<typeof PropertyPriceSchema>;
export type PropertyImage = z.infer<typeof PropertyImageSchema>;
export type PropertyFeature = z.infer<typeof PropertyFeatureSchema>;
export type PropertyStatus = z.infer<typeof PropertyStatusSchema>;
export type PropertyType = z.infer<typeof PropertyTypeSchema>;
export type ListingType = z.infer<typeof ListingTypeSchema>;
export type Property = z.infer<typeof PropertySchema>;
export type CreateProperty = z.infer<typeof CreatePropertySchema>;
export type UpdateProperty = z.infer<typeof UpdatePropertySchema>;
export type PropertySearch = z.infer<typeof PropertySearchSchema>;

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;

export type Inquiry = z.infer<typeof InquirySchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
