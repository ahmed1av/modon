'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Maximize, BedDouble, Bath, MapPin } from 'lucide-react';
import { usePropertyFavorite } from '@/hooks/useFavorites';
import { PropertyListItem, Dictionary } from '@/types';
import styles from './property.module.css';

/**
 * MODON-Style Property Card
 * =========================
 * Sharp-edged card with:
 * - Image with hover overlay darkening effect
 * - Heart/favorite icon overlay (PERSISTENT with localStorage)
 * - Title and location
 * - Price
 * - Specs (Beds, Baths, Area) with Icons
 * - "View Details" arrow link
 * I18N UPDATED
 */

interface PropertyCardProps {
    property: PropertyListItem;
    lang?: 'en' | 'ar';
    dict?: Dictionary;
}

export default function PropertyCard({ property, lang = 'en', dict }: PropertyCardProps) {
    const { isFavorite, toggleFavorite } = usePropertyFavorite(property.id);
    const [isHovered, setIsHovered] = useState(false);

    // Fallback dictionary
    const t = dict?.property_card || {
        sqm: 'm²',
        beds: 'beds',
        baths: 'baths',
        view_details: 'View Details',
        featured: 'FEATURED',
        price_on_request: 'Price on Request',
        add_favorite: 'Add to favorites',
        remove_favorite: 'Remove from favorites'
    };

    // Determine content based on language
    const displayTitle = (lang === 'ar' && property.titleAr) ? property.titleAr : property.title;
    // Handle location structure: could be nested city/country or simple strings in older types (though we updated types)
    // Safe access
    const loc = property.location || {};
    const displayCity = (lang === 'ar' && loc.cityAr) ? loc.cityAr : loc.city;
    const displayCountry = (lang === 'ar' && loc.countryAr) ? loc.countryAr : loc.country;

    // Currency formatting
    const formattedPrice = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
        style: 'currency',
        currency: property.price.currency,
        maximumFractionDigits: 0,
    }).format(property.price.amount);

    return (
        <div
            className={styles.card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.imageContainer}>
                <Link href={`/${lang}/property/${property.slug}`}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={property.images?.[0]?.url || '/placeholder-property.jpg'}
                            alt={property.images?.[0]?.alt || displayTitle}
                            fill
                            className={styles.image}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className={styles.overlay} />
                    </div>
                </Link>

                <button
                    className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite();
                    }}
                    aria-label={isFavorite ? t.remove_favorite : t.add_favorite}
                >
                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} stroke={isFavorite ? "currentColor" : "white"} />
                </button>

                {property.featured && (
                    <div className={styles.statusBadge}>
                        {t.featured}
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.location}>
                    <MapPin size={14} className={styles.locationIcon} />
                    <span>{displayCity}, {displayCountry}</span>
                </div>

                <Link href={`/${lang}/property/${property.slug}`} className={styles.titleLink}>
                    <h3 className={styles.title}>{displayTitle}</h3>
                </Link>

                <div className={styles.price}>
                    {property.price.amount > 0 ? formattedPrice : t.price_on_request}
                </div>

                <div className={styles.specs}>
                    <div className={styles.specItem}>
                        <BedDouble size={16} />
                        <span>{property.specs?.bedrooms || 0} {t.beds}</span>
                    </div>
                    <div className={styles.specItem}>
                        <Bath size={16} />
                        <span>{property.specs?.bathrooms || 0} {t.baths}</span>
                    </div>
                    {property.specs?.livingAreaSqm && (
                        <div className={styles.specItem}>
                            <Maximize size={16} />
                            <span>{property.specs.livingAreaSqm} {t.sqm}</span>
                        </div>
                    )}
                </div>

                <div className={styles.footerLink}>
                    <Link href={`/${lang}/property/${property.slug}`} className={styles.viewDetails}>
                        {t.view_details}
                    </Link>
                </div>
            </div>
        </div>
    );
}
