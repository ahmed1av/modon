'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Home } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from '../our-company/about.module.css';
import nlStyles from './netherlands.module.css';

/**
 * MODON EVOLUTIO - Egypt Regional Page
 * =====================================
 * Egyptian market specialization
 */

const regions = [
    {
        name: 'Amsterdam',
        description: 'Historic canal houses, modern penthouses, and exclusive waterfront properties.',
        image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&q=80&w=600',
    },
    {
        name: 'Het Gooi',
        description: 'Prestigious villas in the green heart of the Netherlands.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    },
    {
        name: 'Wassenaar',
        description: 'Distinguished homes in one of the most sought-after residential areas.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
    },
    {
        name: 'Rotterdam',
        description: 'Modern architecture and innovative living spaces.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600',
    },
];

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function NetherlandsPage({ lang, dict }: ClientPageProps) {
    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero */}
            <section className={nlStyles.hero}>
                <div className={nlStyles.heroOverlay} />
                <div className={nlStyles.heroContent}>
                    <h1 className={nlStyles.heroTitle}>
                        <em>MODON Evolutio Egypt</em>
                    </h1>
                    <p className={nlStyles.heroSubtitle}>
                        Your trusted partner in Dutch luxury real estate
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={styles.intro}>
                <div className={styles.introContainer}>
                    <div className={styles.introText}>
                        <h2>
                            Dutch Luxury Real Estate
                            <br />
                            <span>Expertise</span>
                        </h2>
                        <p>
                            MODON Evolutio Egypt is the country&apos;s premier destination for luxury
                            residential properties. From historic Amsterdam canal houses to
                            contemporary villas in Het Gooi, we represent the finest homes
                            the Netherlands has to offer.
                        </p>
                        <p>
                            Our deep understanding of the Dutch market, combined with international
                            reach, ensures exceptional service for both local and global clients.
                        </p>
                    </div>
                    <div className={styles.introImage}>
                        <div className={nlStyles.imageWrapper}>
                            <Image
                                src="https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=600"
                                alt="Amsterdam Canals"
                                fill
                                sizes="(max-width: 768px) 100vw, 600px"
                                className={nlStyles.img}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Regions */}
            <section className={nlStyles.regions}>
                <div className={nlStyles.regionsHeader}>
                    <h2><em>Areas We Serve</em></h2>
                </div>
                <div className={nlStyles.regionsGrid}>
                    {regions.map((region, index) => (
                        <div key={index} className={nlStyles.regionCard}>
                            <div className={nlStyles.regionImage}>
                                <div className={nlStyles.regionImageInner}>
                                    <Image
                                        src={region.image}
                                        alt={region.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                                        className={nlStyles.img}
                                    />
                                </div>
                            </div>
                            <div className={nlStyles.regionInfo}>
                                <h3>{region.name}</h3>
                                <p>{region.description}</p>
                                <Link href="/buy" className={nlStyles.viewLink}>
                                    View Properties
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section className={nlStyles.contact}>
                <div className={nlStyles.contactContainer}>
                    <h2>Netherlands Office</h2>
                    <div className={nlStyles.contactDetails}>
                        <div className={nlStyles.detailItem}>
                            <MapPin size={20} />
                            <span>Keizersgracht 482, 1016 GD Amsterdam</span>
                        </div>
                        <div className={nlStyles.detailItem}>
                            <Phone size={20} />
                            <span>+31 20 123 4567</span>
                        </div>
                        <div className={nlStyles.detailItem}>
                            <Mail size={20} />
                            <span>egypt@modonevolutio.com</span>
                        </div>
                    </div>
                    <Link href="/contact" className={nlStyles.contactBtn}>
                        Contact Us
                    </Link>
                </div>
            </section>
        </PageLayout>
    );
}
