/**
 * PropertyMap Component
 * ====================
 * Interactive map using React Leaflet with premium dark/gold styling
 * Shows properties as price markers with popup previews
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Image from 'next/image';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import styles from './propertyMap.module.css';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ============================================
// TYPES
// ============================================

export interface MapProperty {
    id: string;
    slug: string;
    title: string;
    price: number;
    currency: string;
    latitude: number;
    longitude: number;
    imageUrl: string;
    city: string;
    country: string;
    bedrooms: number;
    area: number;
}

interface PropertyMapProps {
    properties: MapProperty[];
    center?: [number, number];
    zoom?: number;
    height?: string;
    lang?: string;
}

// ============================================
// CUSTOM MARKER COMPONENT
// ============================================

function CustomPriceMarker({ property, lang }: { property: MapProperty, lang: string }) {
    const formattedPrice = new Intl.NumberFormat('en-EG', {
        style: 'currency',
        currency: property.currency,
        maximumFractionDigits: 0,
        notation: 'compact',
    }).format(property.price);

    // Create custom icon with price label
    const priceIcon = L.divIcon({
        html: `
            <div class="custom-marker">
                <div class="price-tag">${formattedPrice}</div>
                <div class="marker-pin"></div>
            </div>
        `,
        className: 'custom-marker-container',
        iconSize: [80, 50],
        iconAnchor: [40, 50],
    });

    return (
        <Marker position={[property.latitude, property.longitude]} icon={priceIcon}>
            <Popup className="custom-popup" maxWidth={280}>
                <Link href={`/${lang}/property/${property.slug}`} className={styles.popupLink}>
                    <div className={styles.popupContent}>
                        <div className={styles.popupImage}>
                            <Image
                                src={property.imageUrl}
                                alt={property.title}
                                width={280}
                                height={180}
                            />
                        </div>
                        <div className={styles.popupInfo}>
                            <h4>{property.title}</h4>
                            <p className={styles.location}>
                                {property.city}, {property.country}
                            </p>
                            <div className={styles.specs}>
                                <span>{property.bedrooms} beds</span>
                                <span>•</span>
                                <span>{property.area}m²</span>
                            </div>
                            <p className={styles.price}>{formattedPrice}</p>
                        </div>
                    </div>
                </Link>
            </Popup>
        </Marker>
    );
}

// ============================================
// AUTO-FIT BOUNDS COMPONENT
// ============================================

function AutoFitBounds({ properties }: { properties: MapProperty[] }) {
    const map = useMap();

    useEffect(() => {
        if (properties.length > 0) {
            const bounds = L.latLngBounds(
                properties.map((p) => [p.latitude, p.longitude])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [properties, map]);

    return null;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function PropertyMap({
    properties,
    center = [30.0444, 31.2357], // Default: Cairo
    zoom = 12,
    height = '600px',
    lang = 'en',
}: PropertyMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Prevent SSR issues with Leaflet
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.setProperty('--map-height', height);
        }
    }, [height, mounted]);

    if (!mounted) {
        return (
            <div className={styles.mapPlaceholder} ref={containerRef}>
                <p>Loading map...</p>
            </div>
        );
    }

    // Filter properties with valid coordinates
    const validProperties = properties.filter(
        (p) => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
    );

    if (validProperties.length === 0) {
        return (
            <div className={styles.mapPlaceholder} ref={containerRef}>
                <p>No properties with location data available</p>
            </div>
        );
    }

    return (
        <div className={styles.mapWrapper} ref={containerRef}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className={styles.mapContainer}
            >
                {/* PREMIUM DARK TILES with Gold Accents */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Property Markers */}
                {validProperties.map((property) => (
                    <CustomPriceMarker key={property.id} property={property} lang={lang} />
                ))}

                {/* Auto-fit to show all properties */}
                <AutoFitBounds properties={validProperties} />
            </MapContainer>
        </div>
    );
}
