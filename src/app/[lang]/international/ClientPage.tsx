'use client';

import Link from 'next/link';
import { Globe, MapPin, Users, Building2 } from 'lucide-react';
import Image from 'next/image';
import PageLayout from '@/app/components/PageLayout';
import styles from '../our-company/about.module.css';
import intStyles from './international.module.css';

/**
 * MODON EVOLUTIO - International Page
 * ====================================
 * Global presence and offices
 */

const offices = [
    {
        city: 'Amsterdam',
        country: 'Netherlands',
        description: 'Our headquarters and primary European operations center.',
        image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=600',
    },
    {
        city: 'Marbella',
        country: 'Spain',
        description: 'Serving the Costa del Sol luxury market.',
        image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=600',
    },
    {
        city: 'Monaco',
        country: 'Monaco',
        description: 'Exclusive access to Mediterranean ultra-luxury properties.',
        image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=600',
    },
    {
        city: 'Dubai',
        country: 'UAE',
        description: 'Connecting Middle Eastern buyers with European properties.',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600',
    },
    {
        city: 'London',
        country: 'United Kingdom',
        description: 'Serving UK clients and international investors.',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=600',
    },
    {
        city: 'Paris',
        country: 'France',
        description: 'French Riviera and Paris metropolitan expertise.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600',
    },
];

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function MODONInternationalPage({ lang, dict }: ClientPageProps) {
    return (
        <PageLayout>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <em>MODON Evolutio International</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        A global network connecting luxury properties with discerning buyers
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={intStyles.intro}>
                <div className={intStyles.introGrid}>
                    <div className={intStyles.stat}>
                        <Globe size={32} />
                        <span className={intStyles.statNumber}>15+</span>
                        <span className={intStyles.statLabel}>Countries Served</span>
                    </div>
                    <div className={intStyles.stat}>
                        <MapPin size={32} />
                        <span className={intStyles.statNumber}>6</span>
                        <span className={intStyles.statLabel}>Global Offices</span>
                    </div>
                    <div className={intStyles.stat}>
                        <Users size={32} />
                        <span className={intStyles.statNumber}>50+</span>
                        <span className={intStyles.statLabel}>Property Advisors</span>
                    </div>
                    <div className={intStyles.stat}>
                        <Building2 size={32} />
                        <span className={intStyles.statNumber}>€2B+</span>
                        <span className={intStyles.statLabel}>Transactions</span>
                    </div>
                </div>
            </section>

            {/* Offices Grid */}
            <section className={intStyles.officesSection}>
                <div className={intStyles.officesHeader}>
                    <h2><em>Our Global Presence</em></h2>
                    <p>Strategic locations across prime luxury real estate markets</p>
                </div>
                <div className={intStyles.officesGrid}>
                    {offices.map((office, index) => (
                        <div key={index} className={intStyles.officeCard}>
                            <div className={intStyles.officeImage}>
                                <Image
                                    src={office.image}
                                    alt={office.city}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className={intStyles.officeInfo}>
                                <h3>{office.city}</h3>
                                <span className={intStyles.country}>{office.country}</span>
                                <p>{office.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className={styles.teamCta}>
                <div className={styles.teamCtaContent}>
                    <h2>Connect With Us Globally</h2>
                    <p>Wherever you are, our team is ready to assist with your property needs.</p>
                    <Link href="/contact" className={styles.ctaBtn}>
                        Contact Us
                    </Link>
                </div>
            </section>
        </PageLayout>
    );
}
