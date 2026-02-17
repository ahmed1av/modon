'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from './developments.module.css';

/**
 * MODON EVOLUTIO - New Developments Page
 * ===================================
 * Showcase grid for new luxury developments
 */

const developments = [
    {
        id: 1,
        name: 'The Ritz-Carlton Residences',
        location: 'Dubai, UAE',
        status: 'Under Construction',
        completion: 'Q4 2026',
        priceFrom: 'From AED 15,000,000',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
        description: 'Exclusive waterfront residences with private beach access and world-class amenities.',
        units: '120 Residences',
        slug: 'ritz-carlton-dubai',
    },
    {
        id: 2,
        name: 'One Monte Carlo',
        location: 'Monaco',
        status: 'Ready to Move',
        completion: 'Completed',
        priceFrom: 'From €25,000,000',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        description: 'Ultra-luxury apartments in the heart of Monte Carlo with panoramic Mediterranean views.',
        units: '45 Residences',
        slug: 'one-monte-carlo',
    },
    {
        id: 3,
        name: 'Mandarin Oriental Residences',
        location: 'Barcelona, Spain',
        status: 'Pre-Launch',
        completion: 'Q2 2027',
        priceFrom: 'From €8,500,000',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
        description: 'Sophisticated residences combining Asian hospitality with Mediterranean lifestyle.',
        units: '85 Residences',
        slug: 'mandarin-barcelona',
    },
    {
        id: 4,
        name: 'Six Senses Residences',
        location: 'Ibiza, Spain',
        status: 'Selling Now',
        completion: 'Q1 2026',
        priceFrom: 'From €4,200,000',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
        description: 'Wellness-focused living with organic architecture and sustainable design.',
        units: '60 Villas',
        slug: 'six-senses-ibiza',
    },
    {
        id: 5,
        name: 'Bulgari Lighthouse',
        location: 'Miami, USA',
        status: 'Pre-Launch',
        completion: 'Q3 2027',
        priceFrom: 'From $12,000,000',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
        description: 'Italian craftsmanship meets Miami glamour in these iconic waterfront residences.',
        units: '100 Residences',
        slug: 'bulgari-miami',
    },
    {
        id: 6,
        name: 'Aman Nai Lert',
        location: 'Bangkok, Thailand',
        status: 'Under Construction',
        completion: 'Q4 2025',
        priceFrom: 'From $5,500,000',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        description: 'Serene urban sanctuary offering Aman\'s legendary tranquility in the city center.',
        units: '52 Residences',
        slug: 'aman-bangkok',
    },
];

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function NewDevelopmentsPage({ lang, dict }: ClientPageProps) {
    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Page Hero */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <em>New Developments</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Exclusive access to the world&apos;s most prestigious new residential projects
                    </p>
                </div>
            </section>

            {/* Developments Grid */}
            <section className={styles.developmentsSection}>
                <div className={styles.developmentsGrid}>
                    {developments.map((dev) => (
                        <Link
                            key={dev.id}
                            href={`/new-developments/${dev.slug}`}
                            className={styles.developmentCard}
                        >
                            <div className={styles.cardImage}>
                                <div className={styles.cardImageInner}>
                                    <Image
                                        src={dev.image}
                                        alt={dev.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className={styles.cardOverlay} />
                                <span className={`${styles.status} ${styles[dev.status.replace(/\s+/g, '').toLowerCase()]}`}>
                                    {dev.status}
                                </span>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardLocation}>{dev.location}</div>
                                <h3 className={styles.cardTitle}>{dev.name}</h3>
                                <p className={styles.cardDescription}>{dev.description}</p>
                                <div className={styles.cardMeta}>
                                    <span>{dev.units}</span>
                                    <span>Completion: {dev.completion}</span>
                                </div>
                                <div className={styles.cardPrice}>{dev.priceFrom}</div>
                                <div className={styles.cardCta}>
                                    <span>View Development</span>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2>
                        Interested in off-plan investments?
                    </h2>
                    <p>
                        Speak with our development specialists for exclusive pre-launch opportunities
                    </p>
                    <Link href="/contact" className={styles.ctaBtn}>
                        Contact Our Team
                    </Link>
                </div>
            </section>
        </PageLayout>
    );
}
