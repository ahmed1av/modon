'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Gavel, Filter, ArrowRight } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from '../sell/auctions.module.css';
import buyStyles from './buy.module.css';

/**
 * MODON EVOLUTIO - Auctions Buy Page
 * ====================================
 * Browse upcoming auction properties
 */

const upcomingAuctions = [
    {
        id: 1,
        title: 'Villa Bella Vista',
        location: 'Marbella, Spain',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
        guidePrice: '€3,500,000',
        auctionDate: 'March 15, 2026',
        bedrooms: 6,
        bathrooms: 5,
    },
    {
        id: 2,
        title: 'Penthouse Azure',
        location: 'Monaco',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
        guidePrice: '€12,000,000',
        auctionDate: 'March 22, 2026',
        bedrooms: 4,
        bathrooms: 4,
    },
    {
        id: 3,
        title: 'Chateau Lumiere',
        location: 'French Riviera',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        guidePrice: '€8,200,000',
        auctionDate: 'April 5, 2026',
        bedrooms: 8,
        bathrooms: 7,
    },
    {
        id: 4,
        title: 'Contemporary Oasis',
        location: 'Ibiza, Spain',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        guidePrice: '€5,750,000',
        auctionDate: 'April 12, 2026',
        bedrooms: 5,
        bathrooms: 5,
    },
];

import { Dictionary } from '@/types';


interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function AuctionsBuyPage({ lang, dict }: ClientPageProps) {
    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <div className={styles.heroTag}>
                        <Gavel size={18} />
                        <span>MODON Evolutio Auctions</span>
                    </div>
                    <h1 className={styles.heroTitle}>
                        <em>Buy at Auction</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Discover exceptional properties available through our curated auction platform
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={buyStyles.intro}>
                <div className={buyStyles.introContent}>
                    <h2>Upcoming Auctions</h2>
                    <p>
                        Browse our selection of luxury properties coming to auction. Each property
                        undergoes rigorous vetting to ensure the exceptional quality our buyers expect.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className={buyStyles.filterBar}>
                <div className={buyStyles.filterContainer}>
                    <div className={buyStyles.filters}>
                        <select id="ab-location" name="location" aria-label="Filter by location" defaultValue="">
                            <option value="" disabled>Location</option>
                            <option value="spain">Spain</option>
                            <option value="france">France</option>
                            <option value="italy">Italy</option>
                            <option value="monaco">Monaco</option>
                        </select>
                        <select id="ab-price" name="priceRange" aria-label="Filter by price range" defaultValue="">
                            <option value="" disabled>Price Range</option>
                            <option value="1-3m">€1M - €3M</option>
                            <option value="3-5m">€3M - €5M</option>
                            <option value="5-10m">€5M - €10M</option>
                            <option value="10m+">€10M+</option>
                        </select>
                        <select id="ab-type" name="propertyType" aria-label="Filter by property type" defaultValue="">
                            <option value="" disabled>Property Type</option>
                            <option value="villa">Villa</option>
                            <option value="penthouse">Penthouse</option>
                            <option value="estate">Estate</option>
                        </select>
                    </div>
                    <button className={buyStyles.filterBtn}>
                        <Filter size={16} />
                        Apply Filters
                    </button>
                </div>
            </section>

            {/* Auction Grid */}
            <section className={buyStyles.auctionGrid}>
                <div className={buyStyles.gridContainer}>
                    {upcomingAuctions.map((auction) => (
                        <div key={auction.id} className={buyStyles.auctionCard}>
                            <div className={buyStyles.cardImage}>
                                <Image
                                    src={auction.image}
                                    alt={auction.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className={buyStyles.img}
                                />
                                <div className={buyStyles.auctionBadge}>
                                    <Gavel size={14} />
                                    Auction
                                </div>
                            </div>
                            <div className={buyStyles.cardContent}>
                                <span className={buyStyles.location}>{auction.location}</span>
                                <h3>{auction.title}</h3>
                                <div className={buyStyles.specs}>
                                    <span>{auction.bedrooms} Beds</span>
                                    <span>•</span>
                                    <span>{auction.bathrooms} Baths</span>
                                </div>
                                <div className={buyStyles.auctionDetails}>
                                    <div className={buyStyles.guidePrice}>
                                        <span className={buyStyles.label}>Guide Price</span>
                                        <span className={buyStyles.price}>{auction.guidePrice}</span>
                                    </div>
                                    <div className={buyStyles.auctionDate}>
                                        <span className={buyStyles.label}>Auction Date</span>
                                        <span className={buyStyles.date}>{auction.auctionDate}</span>
                                    </div>
                                </div>
                                <Link href={`/property/${auction.id}`} className={buyStyles.viewBtn}>
                                    View Details
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className={buyStyles.ctaSection}>
                <div className={buyStyles.ctaContent}>
                    <h2>Can&apos;t Find What You&apos;re Looking For?</h2>
                    <p>Register your requirements and we&apos;ll notify you about suitable properties.</p>
                    <Link href="/property-finders" className={buyStyles.ctaBtn}>
                        Register Interest
                    </Link>
                </div>
            </section>
        </PageLayout>
    );
}
