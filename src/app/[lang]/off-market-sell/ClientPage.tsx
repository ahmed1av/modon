'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Shield, Eye, Check, ArrowRight } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from './offmarket.module.css';

/**
 * MODON EVOLUTIO - Off-Market Sell Page
 * ==================================
 * Private listing gate for discrete sellers
 */

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function OffMarketSellPage({ lang, dict }: ClientPageProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        propertyValue: '',
        reason: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <div className={styles.heroIcon}>
                        <Lock size={32} />
                    </div>
                    <h1 className={styles.heroTitle}>
                        <em>Off-Market Sales</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Discrete, private property sales for ultra-high-net-worth sellers
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    {/* Left - Info */}
                    <div className={styles.infoSide}>
                        <h2>Sell With Discretion</h2>
                        <p>
                            Some properties are best sold away from the public eye. Whether
                            for privacy, exclusivity, or strategic reasons, our off-market
                            service connects you directly with pre-qualified buyers without
                            public listings.
                        </p>

                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <Shield size={24} />
                                <div>
                                    <h3>Complete Privacy</h3>
                                    <p>Your property is never publicly listed or searchable online.</p>
                                </div>
                            </div>
                            <div className={styles.feature}>
                                <Eye size={24} />
                                <div>
                                    <h3>Qualified Buyers Only</h3>
                                    <p>Viewings arranged exclusively with vetted, serious buyers.</p>
                                </div>
                            </div>
                            <div className={styles.feature}>
                                <Lock size={24} />
                                <div>
                                    <h3>NDA Protection</h3>
                                    <p>All parties sign confidentiality agreements before viewing.</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.altOption}>
                            <span>Looking to buy off-market?</span>
                            <Link href="/off-market-buy">
                                Access Off-Market Listings <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Right - Form */}
                    <div className={styles.formSide}>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <h3>Private Consultation Request</h3>
                                <p>Tell us about your property and we&apos;ll discuss an off-market strategy.</p>

                                <div className={styles.formGroup}>
                                    <label htmlFor="oms-name">Full Name *</label>
                                    <input
                                        id="oms-name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Your full name"
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="oms-email">Email *</label>
                                        <input
                                            id="oms-email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="your@email.com"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="oms-phone">Phone *</label>
                                        <input
                                            id="oms-phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            placeholder="+20 xxx xxx xxxx"
                                            autoComplete="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="oms-propertyValue">Estimated Property Value *</label>
                                    <select
                                        id="oms-propertyValue"
                                        name="propertyValue"
                                        required
                                        value={formData.propertyValue}
                                        onChange={(e) => setFormData({ ...formData, propertyValue: e.target.value })}
                                    >
                                        <option value="">Select range</option>
                                        <option value="1-3m">€1M - €3M</option>
                                        <option value="3-5m">€3M - €5M</option>
                                        <option value="5-10m">€5M - €10M</option>
                                        <option value="10m+">€10M+</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="oms-reason">Reason for Off-Market Sale</label>
                                    <select
                                        id="oms-reason"
                                        name="reason"
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    >
                                        <option value="">Select reason</option>
                                        <option value="privacy">Privacy concerns</option>
                                        <option value="profile">High-profile owner</option>
                                        <option value="strategic">Strategic sale</option>
                                        <option value="testing">Testing the market</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="oms-message">Additional Details</label>
                                    <textarea
                                        id="oms-message"
                                        name="message"
                                        rows={4}
                                        placeholder="Property location, type, and any specific requirements..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <div className={styles.formPrivacy}>
                                    <input type="checkbox" id="oms-privacy" name="privacy" required />
                                    <label htmlFor="oms-privacy">
                                        I agree to the <Link href="/privacy">Privacy Policy</Link> and understand
                                        all communication will be treated confidentially.
                                    </label>
                                </div>

                                <button type="submit" className={styles.submitBtn}>
                                    Request Private Consultation
                                </button>
                            </form>
                        ) : (
                            <div className={styles.successMessage}>
                                <div className={styles.successIcon}>
                                    <Check size={32} />
                                </div>
                                <h3>Request Received</h3>
                                <p>
                                    A senior advisor will contact you within 24 hours to discuss
                                    your off-market requirements in complete confidence.
                                </p>
                                <Link href="/" className={styles.backHome}>
                                    Return to Home
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
