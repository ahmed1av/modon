'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gavel, Clock, Users, Shield, Check, ArrowRight } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from './auctions.module.css';

/**
 * MODON EVOLUTIO - Auctions Sell Page
 * ====================================
 * Sell your property through auction
 */

const benefits = [
    {
        icon: Clock,
        title: 'Fast Results',
        description: 'Sell your property within 6-8 weeks instead of months.',
    },
    {
        icon: Users,
        title: 'Qualified Buyers',
        description: 'Pre-qualified bidders ensure serious interest only.',
    },
    {
        icon: Shield,
        title: 'Transparent Process',
        description: 'Fair market value determined by competitive bidding.',
    },
    {
        icon: Gavel,
        title: 'Professional Management',
        description: 'End-to-end auction management by our expert team.',
    },
];

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function AuctionsSellPage({ lang, dict }: ClientPageProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        location: '',
        estimatedValue: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you! Your auction inquiry has been submitted.');
    };

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
                        <em>Sell Through Auction</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        A modern approach to selling luxury properties with speed and certainty
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={styles.intro}>
                <div className={styles.introContainer}>
                    <div className={styles.introText}>
                        <h2>Why Auction Your Property?</h2>
                        <p>
                            MODON Evolutio Auctions offers a refined alternative to traditional sales methods.
                            Our curated auction platform connects your exceptional property with
                            qualified buyers, creating competitive conditions that often exceed
                            traditional asking prices.
                        </p>
                        <p>
                            With a streamlined timeline and transparent process, you&apos;ll achieve
                            a sale in weeks rather than months—all while maintaining the discretion
                            and prestige your property deserves.
                        </p>
                    </div>
                    <div className={styles.introImage}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600"
                                alt="Luxury Property Auction"
                                fill
                                sizes="(max-width: 768px) 100vw, 600px"
                                className={styles.img}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className={styles.benefits}>
                <h2><em>The MODON Evolutio Auction Advantage</em></h2>
                <div className={styles.benefitsGrid}>
                    {benefits.map((benefit, index) => (
                        <div key={index} className={styles.benefitCard}>
                            <div className={styles.benefitIcon}>
                                <benefit.icon size={28} />
                            </div>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Form Section */}
            <section className={styles.formSection}>
                <div className={styles.formContainer}>
                    <div className={styles.formInfo}>
                        <h2>Register Your Property</h2>
                        <p>
                            Submit your property for evaluation. Our auction specialists will
                            assess suitability and provide a detailed consultation.
                        </p>
                        <ul className={styles.checkList}>
                            <li><Check size={16} /> Free property evaluation</li>
                            <li><Check size={16} /> Professional marketing package</li>
                            <li><Check size={16} /> Global buyer network access</li>
                            <li><Check size={16} /> Full legal coordination</li>
                        </ul>
                    </div>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="as-name">Full Name *</label>
                                <input
                                    id="as-name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Your full name"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="as-email">Email *</label>
                                <input
                                    id="as-email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="as-phone">Phone</label>
                                <input
                                    id="as-phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+20 xxx xxx xxxx"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="as-propertyType">Property Type *</label>
                                <select
                                    id="as-propertyType"
                                    name="propertyType"
                                    required
                                    value={formData.propertyType}
                                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                                >
                                    <option value="">Select type</option>
                                    <option value="villa">Villa</option>
                                    <option value="penthouse">Penthouse</option>
                                    <option value="estate">Estate</option>
                                    <option value="chateau">Chateau</option>
                                    <option value="apartment">Luxury Apartment</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="as-location">Property Location *</label>
                            <input
                                id="as-location"
                                name="location"
                                type="text"
                                required
                                placeholder="City, Country"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="as-estimatedValue">Estimated Value</label>
                            <input
                                id="as-estimatedValue"
                                name="estimatedValue"
                                type="text"
                                placeholder="e.g., €2,500,000"
                                value={formData.estimatedValue}
                                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="as-message">Additional Information</label>
                            <textarea
                                id="as-message"
                                name="message"
                                rows={4}
                                placeholder="Tell us about your property..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Submit for Evaluation
                            <ArrowRight size={16} />
                        </button>
                    </form>
                </div>
            </section>
        </PageLayout>
    );
}
