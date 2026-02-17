'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Heart, Trash2, Loader2 } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import PropertyCard from '@/app/components/property/PropertyCard';
import { useFavorites } from '@/hooks/useFavorites';
import { PropertyListItem } from '@/types';
import styles from './favorites.module.css';

/**
 * MODON EVOLUTIO - Favorites Page (INTELLIGENT)
 * ==========================================
 * Actually loads saved properties from localStorage
 * Fetches real property data from API based on saved IDs
 */

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function FavoritesPage({ lang, dict }: ClientPageProps) {
    const { favorites, clearFavorites, favoritesCount } = useFavorites();
    const [properties, setProperties] = useState<PropertyListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch property details for each favorite
    const fetchFavoriteProperties = useCallback(async () => {
        if (favorites.length === 0) {
            setProperties([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Fetch all properties and filter by favorites
            // In production, you'd have a batch endpoint like /api/properties?ids=1,2,3
            const response = await fetch('/api/properties?limit=100');

            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }

            const result = await response.json();

            if (result.success && result.data) {
                // Filter only favorited properties and map to PropertyListItem
                const favoriteProperties: PropertyListItem[] = result.data
                    .filter((prop: any) => favorites.includes(prop.id || prop.slug))
                    .map((prop: any) => ({
                        id: prop.id || prop.slug,
                        title: prop.title,
                        slug: prop.slug,
                        location: {
                            city: prop.location?.city || prop.city || 'Unknown',
                            country: prop.location?.country || prop.country || 'Unknown',
                        },
                        price: {
                            amount: prop.price?.amount || prop.price || 0,
                            currency: prop.price?.currency || 'EUR',
                        },
                        images: (prop.images || [{ url: prop.image || '/placeholder-property.jpg', alt: prop.title }]).map((img: any, idx: number) => ({
                            id: `img-${prop.id}-${idx}`,
                            url: img.url,
                            alt: img.alt || prop.title,
                            isPrimary: img.isPrimary || idx === 0,
                            order: idx,
                        })),
                        type: (prop.type || 'apartment') as any,
                        listingType: (prop.listingType || 'sale') as any,
                        specs: {
                            bedrooms: prop.specs?.bedrooms || prop.bedrooms,
                            bathrooms: prop.specs?.bathrooms || prop.bathrooms,
                            livingAreaSqm: prop.specs?.livingAreaSqm || prop.area,
                        },
                    }));

                setProperties(favoriteProperties);
            }
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError('Unable to load your saved properties');
        } finally {
            setIsLoading(false);
        }
    }, [favorites]);

    // Fetch when favorites change
    useEffect(() => {
        fetchFavoriteProperties();
    }, [fetchFavoriteProperties]);

    // Listen for favorites updates from other pages
    useEffect(() => {
        const handleFavoritesUpdate = () => {
            fetchFavoriteProperties();
        };

        window.addEventListener('favorites-updated', handleFavoritesUpdate);
        return () => window.removeEventListener('favorites-updated', handleFavoritesUpdate);
    }, [fetchFavoriteProperties]);

    return (
        <PageLayout>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <Heart className={styles.heroIcon} size={40} />
                    <h1>Your Saved Properties</h1>
                    <p>
                        {isLoading
                            ? 'Loading your favorites...'
                            : favoritesCount > 0
                                ? `You have ${favoritesCount} saved ${favoritesCount === 1 ? 'property' : 'properties'}`
                                : 'You haven\'t saved any properties yet'
                        }
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className={styles.content}>
                {/* Loading State */}
                {isLoading && (
                    <div className={styles.loadingState}>
                        <Loader2 className={styles.spinner} size={40} />
                        <p>Loading your saved properties...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className={styles.errorState}>
                        <p>{error}</p>
                        <button onClick={fetchFavoriteProperties} className={styles.retryBtn}>
                            Try Again
                        </button>
                    </div>
                )}

                {/* Properties Grid */}
                {!isLoading && !error && properties.length > 0 && (
                    <>
                        <div className={styles.toolbar}>
                            <span className={styles.count}>{properties.length} Properties</span>
                            <button className={styles.clearBtn} onClick={clearFavorites}>
                                <Trash2 size={16} />
                                Clear All
                            </button>
                        </div>
                        <div className={styles.grid}>
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} lang={lang} dict={dict} />
                            ))}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!isLoading && !error && properties.length === 0 && (
                    <div className={styles.emptyState}>
                        <Heart className={styles.emptyIcon} size={64} />
                        <h2>No Saved Properties</h2>
                        <p>
                            Click the heart icon on any property to save it here for easy access later.
                        </p>
                        <Link href="/buy" className={styles.browseBtn}>
                            Browse Properties
                        </Link>
                    </div>
                )}
            </section>
        </PageLayout>
    );
}
