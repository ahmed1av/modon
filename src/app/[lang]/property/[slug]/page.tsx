/**
 * Property Details Page
 * ======================
 * REAL DATABASE INTEGRATION
 * Fetches property data from Supabase
 */

import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { PropertyType, ListingType } from '@/types';
import {
    MapPin,
    Bed,
    Bath,
    Maximize,
    Download,
    Share2,
    Heart,
    Phone,
    Mail,
    Check
} from 'lucide-react';
import Header from '@/app/components/navigation/Header';
import Footer from '@/app/components/Footer';
import ImageGallery from '@/app/components/property/ImageGallery';
import ContactForm from '@/app/components/property/ContactForm';
import PropertyCard from '@/app/components/property/PropertyCard';
import PropertyActionButtons from './PropertyActionButtons'; // Phase 2: PDF Download
import styles from './property.module.css';
// MOCK UNIVERSE IMPORTS - Fallback when Supabase is offline
import { getDictionary } from '@/lib/get-dictionary';
import { MOCK_PROPERTIES } from '@/data/mock-properties';
import { MOCK_PROPERTIES_EXTENDED, MOCK_AGENTS, getAgentById, GENERIC_MOCK_PROPERTY } from '@/data/mock-universe';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface PropertyRow {
    id: string;
    title: string;
    slug: string;
    description: string;
    type: string;
    listing_type: string;
    status: string;
    address?: string;
    location?: string;
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
    price: number;
    currency: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    plot_area?: number;
    terrace_area?: number;
    garages?: number;
    floors?: number;
    year_built?: number;
    image_url: string;
    images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
    virtual_tour_url?: string; // NEW: Virtual tour URL
    features?: string[];
    amenities?: string[];
    is_featured: boolean;
    is_new: boolean;
    is_exclusive: boolean;
    is_off_market: boolean;
    reference_code: string;
    created_at: string;
    updated_at: string;
}

interface Property {
    id: string;
    slug: string;
    referenceCode: string;
    title: string;
    subtitle: string;
    description: string;
    price: number;
    currency: string;
    pricePerMeter: number;
    location: {
        address: string;
        city: string;
        region?: string;
        country: string;
        coordinates?: { lat: number; lng: number };
    };
    specs: {
        bedrooms: number;
        bathrooms: number;
        livingArea: number;
        plotSize?: number;
        terraceSize?: number;
        garages?: number;
        floors?: number;
        yearBuilt?: number;
    };
    features: string[];
    type: string;
    listingType: string;
    status: string;
    featured: boolean;
    exclusive: boolean;
    images: Array<{ url: string; alt: string; isPrimary?: boolean }>;
    virtualTourUrl?: string; // NEW: Virtual tour URL
    agent: {
        id: string;
        name: string;
        title: string;
        phone: string;
        email: string;
        avatarUrl: string;
        languages: string[];
    };
}

// ============================================
// SUPABASE CLIENT (Server-side)
// ============================================

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // SECURITY (VULN-006 FIX): Public routes must ONLY use the anon key.
    // The service role key bypasses RLS and must NEVER be used in public-facing code.
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error('Supabase credentials not configured');
    }

    return createClient(url, key, {
        auth: { persistSession: false }
    });
}

// SECURITY (VULN-005): Allowed domains for virtual tour iframes
const ALLOWED_IFRAME_DOMAINS = [
    'my.matterport.com',
    'player.vimeo.com',
    'www.youtube.com',
    'youtube.com',
    'kuula.co',
];

function isAllowedIframeUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' && ALLOWED_IFRAME_DOMAINS.some(domain => parsed.hostname === domain || parsed.hostname.endsWith('.' + domain));
    } catch {
        return false;
    }
}

// ============================================
// DATA FETCHING
// ============================================

async function getPropertyBySlug(slug: string): Promise<Property | null> {
    try {
        const supabase = getSupabase();

        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'active')
            .single();

        if (error || !data) {
            console.warn('[Property] Database fetch failed, using mock fallback:', error?.message);

            // MOCK FALLBACK: Search in mock data
            const allMockProperties = [...MOCK_PROPERTIES, ...MOCK_PROPERTIES_EXTENDED];
            const mockProperty = allMockProperties.find(p => p.slug === slug);

            if (mockProperty) {
                // Transform mock property to Property interface
                const mockAgent = MOCK_AGENTS[0]; // Default to first agent
                return {
                    id: mockProperty.id,
                    slug: mockProperty.slug,
                    referenceCode: `MOD-${mockProperty.id.slice(0, 8).toUpperCase()}`,
                    title: mockProperty.title,
                    subtitle: `${mockProperty.location.city}, ${mockProperty.location.country}`,
                    description: `Discover this exceptional ${mockProperty.type} in ${mockProperty.location.city}. Featuring ${mockProperty.specs?.bedrooms || 0} bedrooms, ${mockProperty.specs?.bathrooms || 0} bathrooms, and ${mockProperty.specs?.livingAreaSqm || 0} sqm of refined living space. This property offers the perfect blend of luxury and comfort in one of Egypt's most sought-after locations.`,
                    price: mockProperty.price.amount,
                    currency: mockProperty.price.currency || 'EGP',
                    pricePerMeter: mockProperty.specs?.livingAreaSqm ? Math.round(mockProperty.price.amount / mockProperty.specs.livingAreaSqm) : 0,
                    location: {
                        address: mockProperty.location.city,
                        city: mockProperty.location.city,
                        country: mockProperty.location.country,
                    },
                    specs: {
                        bedrooms: mockProperty.specs?.bedrooms || 0,
                        bathrooms: mockProperty.specs?.bathrooms || 0,
                        livingArea: mockProperty.specs?.livingAreaSqm || 0,
                        plotSize: undefined
                    },
                    features: ['Modern Design', 'Prime Location', 'High-Quality Finishes', '24/7 Security', 'Underground Parking'],
                    type: mockProperty.type,
                    listingType: mockProperty.listingType,
                    status: 'active',
                    featured: mockProperty.featured || false,
                    exclusive: false,
                    images: mockProperty.images.map(img => ({
                        url: img.url,
                        alt: img.alt || mockProperty.title,
                        isPrimary: img.isPrimary
                    })),
                    agent: {
                        id: mockAgent.id,
                        name: mockAgent.name,
                        title: mockAgent.title,
                        phone: mockAgent.phone,
                        email: mockAgent.email,
                        avatarUrl: mockAgent.avatar,
                        languages: mockAgent.languages,
                    }
                };
            }

            // GENERIC FALLBACK: Use generic mock property for any slug
            console.warn('[Property] No mock match found, serving generic fallback');
            const genericAgent = MOCK_AGENTS[0];
            return {
                id: GENERIC_MOCK_PROPERTY.id,
                slug: slug, // Keep the requested slug
                referenceCode: `MOD-DEMO-${Date.now().toString(36).toUpperCase()}`,
                title: GENERIC_MOCK_PROPERTY.title,
                subtitle: `${GENERIC_MOCK_PROPERTY.location.city}, ${GENERIC_MOCK_PROPERTY.location.country}`,
                description: 'This is a demonstration property showcasing our platform. The property you requested is currently being updated. Contact our team to learn about our latest luxury listings and find your perfect home in Egypt.',
                price: GENERIC_MOCK_PROPERTY.price.amount,
                currency: GENERIC_MOCK_PROPERTY.price.currency || 'EGP',
                pricePerMeter: 50000,
                location: {
                    address: GENERIC_MOCK_PROPERTY.location.city,
                    city: GENERIC_MOCK_PROPERTY.location.city,
                    country: GENERIC_MOCK_PROPERTY.location.country,
                },
                specs: {
                    bedrooms: GENERIC_MOCK_PROPERTY.specs?.bedrooms || 4,
                    bathrooms: GENERIC_MOCK_PROPERTY.specs?.bathrooms || 3,
                    livingArea: GENERIC_MOCK_PROPERTY.specs?.livingAreaSqm || 300,
                },
                features: ['Modern Design', 'Prime Location', 'High-Quality Finishes', '24/7 Security'],
                type: GENERIC_MOCK_PROPERTY.type,
                listingType: GENERIC_MOCK_PROPERTY.listingType,
                status: 'active',
                featured: true,
                exclusive: false,
                images: GENERIC_MOCK_PROPERTY.images.map(img => ({
                    url: img.url,
                    alt: img.alt || 'Luxury Property',
                    isPrimary: img.isPrimary
                })),
                agent: {
                    id: genericAgent.id,
                    name: genericAgent.name,
                    title: genericAgent.title,
                    phone: genericAgent.phone,
                    email: genericAgent.email,
                    avatarUrl: genericAgent.avatar,
                    languages: genericAgent.languages,
                }
            };
        }

        const row = data as PropertyRow;

        // Transform database row to Property interface
        return {
            id: row.id,
            slug: row.slug,
            referenceCode: row.reference_code || `MOD-${row.id.slice(0, 8).toUpperCase()}`,
            title: row.title,
            subtitle: `${row.location || row.address || ''}, ${row.city}`,
            description: row.description,
            price: row.price,
            currency: row.currency || 'EGP',
            pricePerMeter: row.area > 0 ? Math.round(row.price / row.area) : 0,
            location: {
                address: row.address || row.location || row.city,
                city: row.city,
                country: row.country,
                coordinates: row.latitude && row.longitude
                    ? { lat: row.latitude, lng: row.longitude }
                    : undefined
            },
            specs: {
                bedrooms: row.bedrooms,
                bathrooms: row.bathrooms,
                livingArea: row.area,
                plotSize: row.plot_area,
                terraceSize: row.terrace_area,
                garages: row.garages,
                floors: row.floors,
                yearBuilt: row.year_built
            },
            features: row.features || [],
            type: row.type,
            listingType: row.listing_type,
            status: row.status,
            featured: row.is_featured,
            exclusive: row.is_exclusive,
            images: row.images?.length
                ? row.images.map(img => ({
                    url: img.url,
                    alt: img.alt || row.title,
                    isPrimary: img.isPrimary
                }))
                : [{ url: row.image_url, alt: row.title, isPrimary: true }],
            virtualTourUrl: row.virtual_tour_url, // NEW: Virtual tour URL
            // Default agent - in production, fetch from agents table
            agent: {
                id: 'agent-1',
                name: 'Ahmed Al-Rashid',
                title: 'Senior Property Advisor',
                phone: '+20 100 123 4567',
                email: 'ahmed@modon.com',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
                languages: ['English', 'Arabic', 'French'],
            }
        };
    } catch (error) {
        console.error('[Property] Error fetching property:', error);

        // ULTIMATE FALLBACK: Return generic mock when everything fails
        const fallbackAgent = MOCK_AGENTS[0];
        return {
            id: GENERIC_MOCK_PROPERTY.id,
            slug: slug,
            referenceCode: `MOD-ERR-${Date.now().toString(36).toUpperCase()}`,
            title: GENERIC_MOCK_PROPERTY.title,
            subtitle: 'Cairo, Egypt',
            description: 'This is a demonstration property. Our database is currently undergoing maintenance. Please contact us for the latest property listings.',
            price: GENERIC_MOCK_PROPERTY.price.amount,
            currency: 'EGP',
            pricePerMeter: 50000,
            location: {
                address: 'Cairo',
                city: 'Cairo',
                country: 'Egypt',
            },
            specs: {
                bedrooms: 4,
                bathrooms: 3,
                livingArea: 300,
            },
            features: ['Modern Design', 'Prime Location'],
            type: 'villa',
            listingType: 'sale',
            status: 'active',
            featured: true,
            exclusive: false,
            images: GENERIC_MOCK_PROPERTY.images.map(img => ({
                url: img.url,
                alt: img.alt || 'Luxury Property',
                isPrimary: img.isPrimary
            })),
            agent: {
                id: fallbackAgent.id,
                name: fallbackAgent.name,
                title: fallbackAgent.title,
                phone: fallbackAgent.phone,
                email: fallbackAgent.email,
                avatarUrl: fallbackAgent.avatar,
                languages: fallbackAgent.languages,
            }
        };
    }
}

async function getSimilarProperties(currentId: string, city: string, type: string, limit = 3): Promise<Property[]> {
    // Validate that currentId is a valid UUID before querying Supabase
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(currentId)) {
        console.warn('[Property] Skipping similar properties query: currentId is not a valid UUID (mock data fallback)');
        return [];
    }

    try {
        const supabase = getSupabase();

        // Try to get properties from same city and type
        let { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('status', 'active')
            .neq('id', currentId)
            .eq('city', city)
            .limit(limit);

        // If not enough results, expand search
        if (!data || data.length < limit) {
            const existingIds = data?.map(p => p.id) || [];
            const needed = limit - (data?.length || 0);

            const { data: moreData } = await supabase
                .from('properties')
                .select('*')
                .eq('status', 'active')
                .neq('id', currentId)
                .not('id', 'in', `(${existingIds.join(',')})`)
                .limit(needed);

            data = [...(data || []), ...(moreData || [])];
        }

        if (error) {
            console.error('[Property] Similar properties error:', error.message);
            return [];
        }

        return ((data || []) as PropertyRow[]).map(row => ({
            id: row.id,
            slug: row.slug,
            referenceCode: row.reference_code,
            title: row.title,
            subtitle: `${row.city}, ${row.country}`,
            description: row.description,
            price: row.price,
            currency: row.currency || 'EGP',
            pricePerMeter: row.area > 0 ? Math.round(row.price / row.area) : 0,
            location: {
                address: row.address || row.city,
                city: row.city,
                country: row.country
            },
            specs: {
                bedrooms: row.bedrooms,
                bathrooms: row.bathrooms,
                livingArea: row.area,
                plotSize: row.plot_area
            },
            features: row.features || [],
            type: row.type,
            listingType: row.listing_type,
            status: row.status,
            featured: row.is_featured,
            exclusive: row.is_exclusive,
            images: row.images?.length
                ? row.images.map(img => ({
                    url: img.url,
                    alt: img.alt || row.title,
                    isPrimary: img.isPrimary
                }))
                : [{ url: row.image_url, alt: row.title, isPrimary: true }],
            agent: {
                id: 'agent-1',
                name: 'MODON Team',
                title: 'Property Advisor',
                phone: '+20 100 123 4567',
                email: 'info@modon.com',
                avatarUrl: '',
                languages: ['English', 'Arabic'],
            }
        }));
    } catch (error) {
        console.error('[Property] Error fetching similar properties:', error);
        return [];
    }
}

// ============================================
// PAGE PROPS
// ============================================

interface PageProps {
    params: Promise<{
        slug: string;
        lang: string;
    }>;
}

// ============================================
// DYNAMIC METADATA (SEO)
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const property = await getPropertyBySlug(slug);

    if (!property) {
        return {
            title: 'Property Not Found | MODON Development',
            description: 'The requested property could not be found.',
        };
    }

    const formattedPrice = new Intl.NumberFormat('en-EG', {
        style: 'currency',
        currency: property.currency,
        maximumFractionDigits: 0,
    }).format(property.price);

    return {
        title: `${property.title} | ${formattedPrice} | MODON Development`,
        description: property.description.substring(0, 160),
        keywords: [
            property.type,
            property.location.city,
            property.location.country,
            'luxury real estate',
            'property for sale',
            'MODON Development'
        ],
        openGraph: {
            title: property.title,
            description: property.description.substring(0, 160),
            images: property.images.map(img => ({
                url: img.url,
                alt: img.alt
            })),
            type: 'website',
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: property.title,
            description: property.description.substring(0, 160),
            images: [property.images[0]?.url],
        },
    };
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function PropertyPage({ params }: PageProps) {
    const { slug, lang } = await params;
    const dict = await getDictionary(lang);

    // Fetch property from database
    const property = await getPropertyBySlug(slug);

    // Handle 404
    if (!property) {
        return (
            <div className={styles.notFoundContainer}>
                <div className={styles.notFoundContent}>
                    <h1 className={styles.notFoundTitle}>{dict.property_details.not_found.title}</h1>
                    <p className={styles.notFoundText}>{dict.property_details.not_found.description}</p>
                    <div className={styles.notFoundActions}>
                        <Link href={`/${lang}/buy`} className={styles.notFoundButton}>
                            {dict.common.view_all}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Fetch similar properties
    const similarProperties = await getSimilarProperties(
        property.id,
        property.location.city,
        property.type,
        3
    );

    // Format price helper
    const formatPrice = (price: number, currency: string = 'EGP') => {
        return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-EG', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Transform similar properties for PropertyCard component (PropertyListItem format)
    const similarPropertiesForCard = similarProperties.map(prop => ({
        id: prop.id,
        slug: prop.slug,
        title: prop.title,
        location: {
            city: prop.location.city,
            country: prop.location.country
        },
        price: {
            amount: prop.price,
            currency: prop.currency
        },
        specs: {
            bedrooms: prop.specs.bedrooms,
            bathrooms: prop.specs.bathrooms,
            livingAreaSqm: prop.specs.livingArea
        },
        images: prop.images.map((img, idx) => ({
            id: `img-${prop.id}-${idx}`,
            url: img.url,
            alt: img.alt,
            isPrimary: img.isPrimary || false,
            order: idx
        })),
        type: (['villa', 'apartment', 'penthouse', 'townhouse', 'duplex', 'land', 'commercial', 'office'].includes(prop.type) ? prop.type : 'apartment') as PropertyType,
        listingType: (['sale', 'rent', 'off-market'].includes(prop.listingType) ? prop.listingType : 'sale') as ListingType,
        featured: prop.featured
    }));

    // Helper for property stats translation
    const getStatLabel = (key: keyof typeof dict.property_details.stats) => {
        return dict.property_details.stats[key];
    };

    // Helper for specs translation
    const getSpecLabel = (key: keyof typeof dict.property_details.specs) => {
        return dict.property_details.specs[key];
    };

    return (
        <>
            {/* JSON-LD Structured Data for Google Rich Snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    // SECURITY (VULN-007 FIX): Escape '</script>' sequences to prevent XSS breakout
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'RealEstateListing',
                        name: property.title,
                        description: property.description,
                        image: property.images.map(img => img.url),
                        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://modonevolutio.com'}/${lang}/property/${property.slug}`,
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: property.location.address,
                            addressLocality: property.location.city,
                            addressRegion: property.location.region || property.location.city,
                            addressCountry: property.location.country,
                        },
                        geo: property.location.coordinates ? {
                            '@type': 'GeoCoordinates',
                            latitude: property.location.coordinates.lat,
                            longitude: property.location.coordinates.lng,
                        } : undefined,
                        offers: {
                            '@type': 'Offer',
                            price: property.price,
                            priceCurrency: property.currency,
                            availability: 'https://schema.org/InStock',
                            seller: {
                                '@type': 'Organization',
                                name: 'MODON Evolutio',
                                url: process.env.NEXT_PUBLIC_SITE_URL || 'https://modonevolutio.com',
                            },
                        },
                        numberOfRooms: property.specs.bedrooms,
                        numberOfBathroomsTotal: property.specs.bathrooms,
                        floorSize: {
                            '@type': 'QuantitativeValue',
                            value: property.specs.livingArea,
                            unitCode: 'MTK',
                        },
                        ...(property.specs.plotSize && {
                            additionalProperty: [{
                                '@type': 'PropertyValue',
                                name: 'Plot Size',
                                value: property.specs.plotSize,
                                unitCode: 'MTK',
                            }],
                        }),
                    }).replace(/</g, '\\u003c'),
                }}
            />

            <Header lang={lang as 'en' | 'ar'} dict={dict} />


            <main className={styles.main} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {/* Breadcrumb */}
                <div className={styles.breadcrumbBar}>
                    <div className={styles.container}>
                        <nav className={styles.breadcrumb}>
                            <Link href={`/${lang}`}>{dict.property_details.breadcrumb.home}</Link>
                            <span>/</span>
                            <Link href={`/${lang}/buy`}>{dict.property_details.breadcrumb.buy}</Link>
                            <span>/</span>
                            <Link href={`/${lang}/buy?location=${encodeURIComponent(property.location.city)}`}>
                                {property.location.city}
                            </Link>
                            <span>/</span>
                            <span>{property.title}</span>
                        </nav>
                    </div>
                </div>

                {/* Image Gallery */}
                <section className={styles.gallerySection}>
                    <ImageGallery images={property.images} title={property.title} />
                </section>

                {/* Property Content */}
                <section className={styles.contentSection}>
                    <div className={styles.container}>
                        <div className={styles.contentGrid}>
                            {/* Main Content */}
                            <div className={styles.mainContent}>
                                {/* Header */}
                                <div className={styles.propertyHeader}>
                                    <div className={styles.badges}>
                                        {property.exclusive && (
                                            <span className={styles.badgeExclusive}>{dict.property_details.badges.exclusive}</span>
                                        )}
                                        {property.featured && (
                                            <span className={styles.badgeFeatured}>{dict.property_details.badges.featured}</span>
                                        )}
                                    </div>

                                    <h1 className={styles.propertyTitle}>{property.title}</h1>
                                    <p className={styles.propertySubtitle}>
                                        <MapPin size={18} />
                                        {property.location.address}, {property.location.city}, {property.location.country}
                                    </p>

                                    <div className={styles.priceRow}>
                                        <div className={styles.price}>
                                            {formatPrice(property.price, property.currency)}
                                        </div>
                                        {property.pricePerMeter > 0 && (
                                            <div className={styles.pricePerMeter}>
                                                {formatPrice(property.pricePerMeter, property.currency)} {dict.property_details.price.per_meter}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.referenceCode}>
                                        {dict.property_details.ref} {property.referenceCode}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className={styles.quickStats}>
                                    <div className={styles.stat}>
                                        <Bed size={22} />
                                        <div>
                                            <span className={styles.statValue}>{property.specs.bedrooms}</span>
                                            <span className={styles.statLabel}>{getStatLabel('bedrooms')}</span>
                                        </div>
                                    </div>
                                    <div className={styles.stat}>
                                        <Bath size={22} />
                                        <div>
                                            <span className={styles.statValue}>{property.specs.bathrooms}</span>
                                            <span className={styles.statLabel}>{getStatLabel('bathrooms')}</span>
                                        </div>
                                    </div>
                                    <div className={styles.stat}>
                                        <Maximize size={22} />
                                        <div>
                                            <span className={styles.statValue}>{property.specs.livingArea} m²</span>
                                            <span className={styles.statLabel}>{getStatLabel('living_area')}</span>
                                        </div>
                                    </div>
                                    {property.specs.plotSize && (
                                        <div className={styles.stat}>
                                            <Maximize size={22} />
                                            <div>
                                                <span className={styles.statValue}>{property.specs.plotSize} m²</span>
                                                <span className={styles.statLabel}>{getStatLabel('plot_size')}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className={styles.section}>
                                    <h2 className={styles.sectionTitle}>{dict.property_details.sections.description}</h2>
                                    <div className={styles.description}>
                                        {property.description.split('\n\n').map((paragraph, idx) => (
                                            <p key={idx}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Virtual Tour - SECURITY: Only render iframe from allowed domains */}
                                {property.virtualTourUrl && isAllowedIframeUrl(property.virtualTourUrl) && (
                                    <div className={styles.section}>
                                        <h2 className={styles.sectionTitle}>{dict.property_details.sections.virtual_tour}</h2>
                                        <div className={styles.virtualTourContainer}>
                                            <iframe
                                                src={property.virtualTourUrl}
                                                className={styles.virtualTourIframe}
                                                title={`Virtual Tour - ${property.title}`}
                                                allowFullScreen
                                                loading="lazy"
                                                sandbox="allow-scripts allow-same-origin allow-popups"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                {property.features.length > 0 && (
                                    <div className={styles.section}>
                                        <h2 className={styles.sectionTitle}>{dict.property_details.sections.features}</h2>
                                        <div className={styles.featuresList}>
                                            {property.features.map((feature) => (
                                                <div key={feature} className={styles.feature}>
                                                    <Check size={16} />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Specifications */}
                                <div className={styles.section}>
                                    <h2 className={styles.sectionTitle}>{dict.property_details.sections.details}</h2>
                                    <div className={styles.specsGrid}>
                                        <div className={styles.specRow}>
                                            <span className={styles.specLabel}>{getSpecLabel('type')}</span>
                                            <span className={styles.specValue}>{property.type}</span>
                                        </div>
                                        <div className={styles.specRow}>
                                            <span className={styles.specLabel}>{getSpecLabel('bedrooms')}</span>
                                            <span className={styles.specValue}>{property.specs.bedrooms}</span>
                                        </div>
                                        <div className={styles.specRow}>
                                            <span className={styles.specLabel}>{getSpecLabel('bathrooms')}</span>
                                            <span className={styles.specValue}>{property.specs.bathrooms}</span>
                                        </div>
                                        <div className={styles.specRow}>
                                            <span className={styles.specLabel}>{getSpecLabel('living_area')}</span>
                                            <span className={styles.specValue}>{property.specs.livingArea} m²</span>
                                        </div>
                                        {property.specs.plotSize && (
                                            <div className={styles.specRow}>
                                                <span className={styles.specLabel}>{getSpecLabel('plot_size')}</span>
                                                <span className={styles.specValue}>{property.specs.plotSize} m²</span>
                                            </div>
                                        )}
                                        {property.specs.terraceSize && (
                                            <div className={styles.specRow}>
                                                <span className={styles.specLabel}>{getSpecLabel('terrace')}</span>
                                                <span className={styles.specValue}>{property.specs.terraceSize} m²</span>
                                            </div>
                                        )}
                                        {property.specs.garages && (
                                            <div className={styles.specRow}>
                                                <span className={styles.specLabel}>{getSpecLabel('garages')}</span>
                                                <span className={styles.specValue}>{property.specs.garages}</span>
                                            </div>
                                        )}
                                        {property.specs.floors && (
                                            <div className={styles.specRow}>
                                                <span className={styles.specLabel}>{getSpecLabel('floors')}</span>
                                                <span className={styles.specValue}>{property.specs.floors}</span>
                                            </div>
                                        )}
                                        {property.specs.yearBuilt && (
                                            <div className={styles.specRow}>
                                                <span className={styles.specLabel}>Year Built</span>
                                                <span className={styles.specValue}>{property.specs.yearBuilt}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Location Map Placeholder */}
                                <div className={styles.section}>
                                    <h2 className={styles.sectionTitle}>Location</h2>
                                    <div className={styles.mapPlaceholder}>
                                        <MapPin size={48} />
                                        <p>Interactive Map</p>
                                        <span>{property.location.city}, {property.location.country}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <aside className={styles.sidebar}>
                                {/* Action Buttons */}
                                {/* Action Buttons - Phase 2: PDF Download, Share, Save */}
                                <PropertyActionButtons
                                    propertyId={property.id}
                                    property={{
                                        title: property.title,
                                        price: `${property.currency} ${property.price.toLocaleString()}`,
                                        location: property.location.address,
                                        city: property.location.city,
                                        country: property.location.country,
                                        bedrooms: property.specs.bedrooms,
                                        bathrooms: property.specs.bathrooms,
                                        area: property.specs.livingArea,
                                        type: property.type,
                                        referenceCode: property.referenceCode,
                                        description: property.description,
                                        imageUrl: property.images[0]?.url,
                                    }}
                                    dict={dict}
                                    lang={lang as 'en' | 'ar'}
                                />

                                {/* Agent Card */}
                                <div className={styles.agentCard}>
                                    <div className={styles.agentHeader}>
                                        <Image
                                            src={property.agent.avatarUrl}
                                            alt={property.agent.name}
                                            width={60}
                                            height={60}
                                            className={styles.agentAvatar}
                                        />
                                        <div className={styles.agentInfo}>
                                            <h3>{property.agent.name}</h3>
                                            <p>{property.agent.title}</p>
                                        </div>
                                    </div>

                                    <div className={styles.agentLanguages}>
                                        {property.agent.languages.join(' • ')}
                                    </div>

                                    <div className={styles.agentContact}>
                                        <a href={`tel:${property.agent.phone}`} className={styles.contactLink}>
                                            <Phone size={16} />
                                            {property.agent.phone}
                                        </a>
                                        <a href={`mailto:${property.agent.email}`} className={styles.contactLink}>
                                            <Mail size={16} />
                                            {property.agent.email}
                                        </a>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <ContactForm
                                    propertyId={property.id}
                                    propertyTitle={property.title}
                                    agentName={property.agent.name}
                                    dict={dict}
                                    lang={lang as 'en' | 'ar'}
                                />
                            </aside>
                        </div>
                    </div>
                </section>

                {/* Similar Properties */}
                {similarPropertiesForCard.length > 0 && (
                    <section className={styles.similarSection}>
                        <div className={styles.container}>
                            <h2 className={styles.similarTitle}>SIMILAR PROPERTIES</h2>
                            <div className={styles.similarGrid}>
                                {similarPropertiesForCard.map((prop) => (
                                    <PropertyCard key={prop.id} property={prop} lang={lang as 'en' | 'ar'} dict={dict} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer lang={lang as 'en' | 'ar'} dict={dict} />
        </>
    );
}
