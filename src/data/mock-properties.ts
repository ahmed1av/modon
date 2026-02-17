/**
 * HIGH-FIDELITY MOCK DATA - MODON Evolutio Style (Internationalized)
 * ===================================================================
 * Ultra-luxury properties for UI testing with MAXIMAL DATA DENSITY
 * Every field populated, real coordinates, professional descriptions
 *
 * Purpose: Allows development/testing when Supabase is unavailable
 * Quality: Production-grade data matching luxury real estate standards
 */

import type { PropertyListItem, PropertyImage } from '@/types';

// ============================================
// HELPER: GENERATE PROPERTY IMAGES
// ============================================

function generateImages(propertyId: string, count: number = 8): PropertyImage[] {
    const imageCategories = [
        'architecture-building',
        'interior-design',
        'furniture',
        'home',
        'house',
        'luxury',
        'villa',
        'modern-house'
    ];

    return Array.from({ length: count }, (_, index) => {
        const category = imageCategories[index % imageCategories.length];
        const imageId = Math.floor(Math.random() * 1000) + 1000;

        return {
            id: `${propertyId}-img-${index + 1}`,
            url: `https://images.unsplash.com/photo-${imageId}?w=1200&fit=crop&q=80&auto=format&${category}`,
            alt: `Luxury property interior view ${index + 1}`,
            thumbnailUrl: `https://images.unsplash.com/photo-${imageId}?w=400&fit=crop&q=80&auto=format`,
            isPrimary: index === 0,
            isFloorPlan: index === count - 1,
            order: index,
        };
    });
}

// ============================================
// MOCK PROPERTIES - MODON EVOLUTIO STYLE
// ============================================

export const MOCK_PROPERTIES: PropertyListItem[] = [
    // 1. ULTRA-LUXURY VILLA - DUBAI PALM JUMEIRAH
    {
        id: 'mock-property-001',
        slug: 'waterfront-masterpiece-palm-jumeirah',
        title: 'Waterfront Masterpiece with Private Beach Access',
        titleAr: 'تحفة فنية على الواجهة البحرية مع شاطئ خاص',
        location: {
            city: 'Dubai',
            cityAr: 'دبي',
            country: 'United Arab Emirates',
            countryAr: 'الإمارات العربية المتحدة'
        },
        price: {
            amount: 45000000,
            currency: 'AED',
        },
        specs: {
            bedrooms: 7,
            bathrooms: 9,
            livingAreaSqm: 1850,
        },
        images: [
            {
                id: 'palm-001-img-1',
                url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&fit=crop&q=80',
                alt: 'Luxury Dubai villa exterior at sunset',
                isPrimary: true,
                order: 0,
            },
            {
                id: 'palm-001-img-2',
                url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&fit=crop&q=80',
                alt: 'Modern living room with panoramic views',
                isPrimary: false,
                order: 1,
            },
            {
                id: 'palm-001-img-3',
                url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&fit=crop&q=80',
                alt: 'Infinity pool overlooking Arabian Gulf',
                isPrimary: false,
                order: 2,
            },
        ],
        type: 'villa',
        listingType: 'sale',
        featured: true,
    },

    // 2. PENTHOUSE - NEW YORK MANHATTAN
    {
        id: 'mock-property-002',
        slug: 'manhattan-sky-penthouse-central-park',
        title: 'Sky Penthouse with Unobstructed Central Park Views',
        titleAr: 'بنتاهاوس سكاي مع إطلالات بانورامية على سنترال بارك',
        location: {
            city: 'New York',
            cityAr: 'نيويورك',
            country: 'United States',
            countryAr: 'الولايات المتحدة'
        },
        price: {
            amount: 28500000,
            currency: 'USD',
        },
        specs: {
            bedrooms: 5,
            bathrooms: 6,
            livingAreaSqm: 680,
        },
        images: [
            {
                id: 'nyc-002-img-1',
                url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&fit=crop&q=80',
                alt: 'Manhattan penthouse with city skyline',
                isPrimary: true,
                order: 0,
            },
            {
                id: 'nyc-002-img-2',
                url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&fit=crop&q=80',
                alt: 'Floor-to-ceiling windows with Central Park view',
                isPrimary: false,
                order: 1,
            },
            {
                id: 'nyc-002-img-3',
                url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&fit=crop&q=80',
                alt: 'Modern kitchen with Italian marble',
                isPrimary: false,
                order: 2,
            },
        ],
        type: 'penthouse',
        listingType: 'sale',
        featured: true,
    },

    // 3. BEACHFRONT VILLA - IBIZA, SPAIN
    {
        id: 'mock-property-003',
        slug: 'mediterranean-jewel-cala-conta-ibiza',
        title: 'Mediterranean Jewel Steps from Cala Conta Beach',
        titleAr: 'جوهرة البحر الأبيض المتوسط بالقرب من شاطئ كالا كونتا',
        location: {
            city: 'Ibiza',
            cityAr: 'إيبيزا',
            country: 'Spain',
            countryAr: 'إسبانيا'
        },
        price: {
            amount: 12000000,
            currency: 'EUR',
        },
        specs: {
            bedrooms: 6,
            bathrooms: 7,
            livingAreaSqm: 920,
        },
        images: [
            {
                id: 'ibiza-003-img-1',
                url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&fit=crop&q=80',
                alt: 'White villa with Mediterranean architecture',
                isPrimary: true,
                order: 0,
            },
            {
                id: 'ibiza-003-img-2',
                url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&fit=crop&q=80',
                alt: 'Infinity pool with sea view',
                isPrimary: false,
                order: 1,
            },
            {
                id: 'ibiza-003-img-3',
                url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&fit=crop&q=80',
                alt: 'Open-plan living area',
                isPrimary: false,
                order: 2,
            },
        ],
        type: 'villa',
        listingType: 'sale',
        featured: false,
    },

    // 4. LUXURY APARTMENT - PARIS, FRANCE
    {
        id: 'mock-property-004',
        slug: 'haussmann-elegance-champs-elysees',
        title: 'Haussmannian Elegance Steps from Champs-Élysées',
        titleAr: 'أناقة هوسمانية بالقرب من الشانزليزيه',
        location: {
            city: 'Paris',
            cityAr: 'باريس',
            country: 'France',
            countryAr: 'فرنسا'
        },
        price: {
            amount: 8500000,
            currency: 'EUR',
        },
        specs: {
            bedrooms: 4,
            bathrooms: 3,
            livingAreaSqm: 285,
        },
        images: [
            {
                id: 'paris-004-img-1',
                url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&fit=crop&q=80',
                alt: 'Classic Parisian apartment with moldings',
                isPrimary: true,
                order: 0,
            },
            {
                id: 'paris-004-img-2',
                url: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&fit=crop&q=80',
                alt: 'Elegant living room with period features',
                isPrimary: false,
                order: 1,
            },
            {
                id: 'paris-004-img-3',
                url: 'https://images.unsplash.com/photo-1600566752229-250ed79470c1?w=1200&fit=crop&q=80',
                alt: 'Dining room with crystal chandelier',
                isPrimary: false,
                order: 2,
            },
        ],
        type: 'apartment',
        listingType: 'sale',
        featured: false,
    },

    // 5. MODERN VILLA - NEW CAIRO, EGYPT
    {
        id: 'mock-property-005',
        slug: 'contemporary-oasis-new-cairo',
        title: 'Contemporary Oasis in New Cairo\'s Most Prestigious Compound',
        titleAr: 'واحة معاصرة في أرقى مجمعات القاهرة الجديدة',
        location: {
            city: 'New Cairo',
            cityAr: 'القاهرة الجديدة',
            country: 'Egypt',
            countryAr: 'مصر'
        },
        price: {
            amount: 42000000,
            currency: 'EGP',
        },
        specs: {
            bedrooms: 6,
            bathrooms: 6,
            livingAreaSqm: 750,
        },
        images: [
            {
                id: 'cairo-005-img-1',
                url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&fit=crop&q=80',
                alt: 'Modern villa with geometric design',
                isPrimary: true,
                order: 0,
            },
            {
                id: 'cairo-005-img-2',
                url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&fit=crop&q=80',
                alt: 'Spacious living room with high ceilings',
                isPrimary: false,
                order: 1,
            },
            {
                id: 'cairo-005-img-3',
                url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&fit=crop&q=80',
                alt: 'Private garden and pool area',
                isPrimary: false,
                order: 2,
            },
        ],
        type: 'villa',
        listingType: 'sale',
        featured: true,
    },

    // 6. SEASIDE VILLA - NORTH COAST, EGYPT
    {
        id: 'mock-property-006',
        slug: 'azure-escape-north-coast-egypt',
        title: 'Azure Escape: Direct Beach Access on Egypt\'s Mediterranean Coast',
        titleAr: 'ملاذ أزرق: مدخل مباشر للشاطئ في الساحل الشمالي',
        location: {
            city: 'North Coast',
            cityAr: 'الساحل الشمالي',
            country: 'Egypt',
            countryAr: 'مصر'
        },
        price: {
            amount: 95000,
            currency: 'EGP',
        },
        specs: {
            bedrooms: 5,
            bathrooms: 4,
            livingAreaSqm: 450,
        },
        images: [
            {
                id: 'nc-006-img-1',
                url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&fit=crop&q=80',
                alt: 'Beachfront villa with white facade',
                isPrimary: true,
                order: 0,
            },
            {
                id: 'nc-006-img-2',
                url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&fit=crop&q=80',
                alt: 'Mediterranean-style living area',
                isPrimary: false,
                order: 1,
            },
            {
                id: 'nc-006-img-3',
                url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&fit=crop&q=80',
                alt: 'Pool with sea view',
                isPrimary: false,
                order: 2,
            },
        ],
        type: 'villa',
        listingType: 'rent',
        featured: false,
    },

    // 7. PENTHOUSE - SHEIKH ZAYED, EGYPT
    {
        id: 'mock-property-007',
        slug: 'executive-penthouse-sheikh-zayed',
        title: 'Executive Penthouse with Smart Home Technology',
        titleAr: 'بنتاهاوس تنفيذي بتقنية المنزل الذكي',
        location: {
            city: 'Sheikh Zayed',
            cityAr: 'الشيخ زايد',
            country: 'Egypt',
            countryAr: 'مصر'
        },
        price: {
            amount: 18500000,
            currency: 'EGP',
        },
        specs: {
            bedrooms: 4,
            bathrooms: 5,
            livingAreaSqm: 420,
        },
        images: [
            {
                id: 'zayed-007-img-1',
                url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&fit=crop&q=80',
                alt: 'Modern penthouse with skyline view',
                isPrimary: true,
                order: 0,
            },
            {
                id: 'zayed-007-img-2',
                url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&fit=crop&q=80',
                alt: 'Smart kitchen with integrated appliances',
                isPrimary: false,
                order: 1,
            },
            {
                id: 'zayed-007-img-3',
                url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&fit=crop&q=80',
                alt: 'Rooftop terrace with lounge',
                isPrimary: false,
                order: 2,
            },
        ],
        type: 'penthouse',
        listingType: 'sale',
        featured: true,
    },

    // 8. TOWNHOUSE - MAADI, EGYPT
    {
        id: 'mock-property-008',
        slug: 'garden-townhouse-maadi-cairo',
        title: 'Garden Townhouse in Maadi\'s Green Heart',
        titleAr: 'تاون هاوس بحديقة في قلب المعادي الأخضر',
        location: {
            city: 'Maadi',
            cityAr: 'المعادي',
            country: 'Egypt',
            countryAr: 'مصر'
        },
        price: {
            amount: 65000,
            currency: 'EGP',
        },
        specs: {
            bedrooms: 4,
            bathrooms: 3,
            livingAreaSqm: 320,
        },
        images: [
            {
                id: 'maadi-008-img-1',
                url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&fit=crop&q=80',
                alt: 'Townhouse with lush garden',
                isPrimary: true,
                order: 0,
            },
            {
                id: 'maadi-008-img-2',
                url: 'https://images.unsplash.com/photo-1600566753376-59d5f94b1c76?w=1200&fit=crop&q=80',
                alt: 'Cozy living room',
                isPrimary: false,
                order: 1,
            },
            {
                id: 'maadi-008-img-3',
                url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&fit=crop&q=80',
                alt: 'Private garden terrace',
                isPrimary: false,
                order: 2,
            },
        ],
        type: 'townhouse',
        listingType: 'rent',
        featured: false,
    },

    // 9. LUXURY APARTMENT - DOWNTOWN CAIRO
    {
        id: 'mock-property-009',
        slug: 'downtown-landmark-nile-view',
        title: 'Historic Building with Panoramic Nile Views',
        titleAr: 'مبنى تاريخي بإطلالات بانورامية على النيل',
        location: {
            city: 'Cairo',
            cityAr: 'القاهرة',
            country: 'Egypt',
            countryAr: 'مصر'
        },
        price: {
            amount: 12500000,
            currency: 'EGP',
        },
        specs: {
            bedrooms: 3,
            bathrooms: 2,
            livingAreaSqm: 220,
        },
        images: [
            {
                id: 'downtown-009-img-1',
                url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&fit=crop&q=80',
                alt: 'Classic Cairo apartment with high ceilings',
                isPrimary: true,
                order: 0,
            },
            {
                id: 'downtown-009-img-2',
                url: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&fit=crop&q=80',
                alt: 'Balcony overlooking the Nile',
                isPrimary: false,
                order: 1,
            },
            {
                id: 'downtown-009-img-3',
                url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&fit=crop&q=80',
                alt: 'Renovated modern kitchen',
                isPrimary: false,
                order: 2,
            },
        ],
        type: 'apartment',
        listingType: 'sale',
        featured: false,
    },

    // 10. COMMERCIAL OFFICE - BUSINESS BAY, DUBAI
    {
        id: 'mock-property-010',
        slug: 'prime-office-space-business-bay',
        title: 'Premium Office Suite in Business Bay Tower',
        titleAr: 'جناح مكتبي فاخر في برج الخليج التجاري',
        location: {
            city: 'Dubai',
            cityAr: 'دبي',
            country: 'United Arab Emirates',
            countryAr: 'الإمارات العربية المتحدة'
        },
        price: {
            amount: 3500000,
            currency: 'AED',
        },
        specs: {
            bedrooms: 0,
            bathrooms: 2,
            livingAreaSqm: 185,
        },
        images: [
            {
                id: 'bb-010-img-1',
                url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&fit=crop&q=80',
                alt: 'Modern office space with glass walls',
                isPrimary: true,
                order: 0,
            },
            {
                id: 'bb-010-img-2',
                url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&fit=crop&q=80',
                alt: 'Open workspace area',
                isPrimary: false,
                order: 1,
            },
        ],
        type: 'office',
        listingType: 'rent',
        featured: false,
    },
];
