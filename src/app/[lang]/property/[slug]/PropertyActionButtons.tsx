/**
 * Property Action Buttons Component
 * ==================================
 * Client-side interactive buttons for property detail page
 * - Save to favorites (Hardened with Supabase)
 * - Share property
 * - Download PDF brochure
 */

'use client';

import { useState } from 'react';
import { Heart, Share2, Download, Loader2 } from 'lucide-react';
import { downloadPropertyBrochure } from '@/lib/pdf/brochure-generator';
import { usePropertyFavorite } from '@/hooks/useFavorites';
import styles from './property.module.css';
import { Dictionary } from '@/types';

interface PropertyActionButtonsProps {
    propertyId: string;
    property: {
        title: string;
        price: string;
        location: string;
        city: string;
        country: string;
        bedrooms: number;
        bathrooms: number;
        area: number;
        type: string;
        referenceCode: string;
        description?: string;
        imageUrl?: string;
    };
    dict?: Dictionary;
    lang?: string;
}

export default function PropertyActionButtons({ propertyId, property, dict }: PropertyActionButtonsProps) {
    const { isFavorite, toggleFavorite, isLoading } = usePropertyFavorite(propertyId);
    const [isDownloading, setIsDownloading] = useState(false);

    // Default or translated text
    const t = {
        save: dict?.property_details?.actions?.save || 'Save',
        saved: dict?.property_details?.actions?.saved || 'Saved',
        share: dict?.property_details?.actions?.share || 'Share',
        pdf: dict?.property_details?.actions?.pdf || 'PDF',
        generating: dict?.property_details?.actions?.generating || 'Generating...',
        linkCopied: dict?.property_details?.actions?.link_copied || 'Link copied to clipboard!',
    };

    // Handle share
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.title,
                    text: `Check out this property: ${property.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert(t.linkCopied);
        }
    };

    // Handle PDF download
    const handleDownloadBrochure = () => {
        setIsDownloading(true);

        try {
            downloadPropertyBrochure({
                title: property.title,
                price: property.price,
                location: property.location,
                city: property.city,
                country: property.country,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                area: property.area,
                type: property.type,
                referenceCode: property.referenceCode,
                description: property.description,
                imageUrl: property.imageUrl,
            });

            // Reset downloading state after a delay
            setTimeout(() => setIsDownloading(false), 1000);
        } catch (error) {
            console.error('Failed to generate brochure:', error);
            setIsDownloading(false);
        }
    };

    return (
        <div className={styles.actionButtons}>
            <button
                className={`${styles.actionBtn} ${isFavorite ? styles.actionBtnActive : ''}`}
                onClick={toggleFavorite}
                disabled={isLoading}
                aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                )}
                {isFavorite ? t.saved : t.save}
            </button>

            <button
                className={styles.actionBtn}
                onClick={handleShare}
                aria-label="Share property"
            >
                <Share2 size={18} />
                {t.share}
            </button>

            <button
                className={styles.actionBtn}
                onClick={handleDownloadBrochure}
                disabled={isDownloading}
                aria-label="Download PDF brochure"
            >
                <Download size={18} />
                {isDownloading ? t.generating : t.pdf}
            </button>
        </div>
    );
}
