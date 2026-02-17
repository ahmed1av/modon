'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gavel, Check, Building2, Handshake, Globe, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import PageLayout from '@/app/components/PageLayout';
import styles from '../sell/auctions.module.css';

/**
 * MODON EVOLUTIO - Auctions for Professionals Page
 * =================================================
 * Partner program for real estate agents
 */

const benefits = [
    {
        icon: Building2,
        title: 'Expanded Inventory',
        description: 'Access exclusive auction properties for your clients. Expand your listing portfolio.',
    },
    {
        icon: Handshake,
        title: 'Revenue Sharing',
        description: 'Earn competitive referral commissions on successful transactions.',
    },
    {
        icon: Globe,
        title: 'Global Network',
        description: 'Connect with international buyers through our established network.',
    },
    {
        icon: Gavel,
        title: 'Auction Expertise',
        description: 'We manage the auction process. You maintain your client relationship.',
    },
];

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function AuctionsProfessionalsPage({ lang, dict }: ClientPageProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        license: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you! Your partner application has been submitted.');
    };

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <div className={styles.heroTag}>
                        <Gavel size={18} />
                        <span>Partner Program</span>
                    </div>
                    <h1 className={styles.heroTitle}>
                        <em>For Professionals</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Join our network of trusted real estate professionals
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={styles.intro}>
                <div className={styles.introContainer}>
                    <div className={styles.introText}>
                        <h2>Partner With MODON Evolutio Auctions</h2>
                        <p>
                            As a real estate professional, you understand that some properties benefit
                            from the competitive dynamics of an auction. Partner with us to offer your
                            clients an alternative sales method while earning competitive commissions.
                        </p>
                        <p>
                            Our professional partner program gives you access to our auction platform,
                            marketing resources, and international buyer network—all while maintaining
                            your primary client relationship.
                        </p>
                    </div>
                    <div className={styles.introImage}>
                        <Image
                            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600"
                            alt="Professional Partnership"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className={styles.benefits}>
                <h2><em>Partnership Benefits</em></h2>
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
                        <h2>Become a Partner</h2>
                        <p>
                            Apply to join our professional partner network. We review all applications
                            and respond within 48 hours.
                        </p>
                        <ul className={styles.checkList}>
                            <li><Check size={16} /> Competitive referral commissions</li>
                            <li><Check size={16} /> Co-branded marketing materials</li>
                            <li><Check size={16} /> Dedicated partner support</li>
                            <li><Check size={16} /> Training and certification</li>
                            <li><Check size={16} /> Access to exclusive listings</li>
                        </ul>
                    </div>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="ap-name">Full Name *</label>
                                <input
                                    id="ap-name"
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
                                <label htmlFor="ap-email">Email *</label>
                                <input
                                    id="ap-email"
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
                                <label htmlFor="ap-phone">Phone</label>
                                <input
                                    id="ap-phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+20 xxx xxx xxxx"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="ap-company">Company/Agency *</label>
                                <input
                                    id="ap-company"
                                    name="company"
                                    type="text"
                                    required
                                    placeholder="Your company or agency"
                                    autoComplete="organization"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="ap-license">Real Estate License Number</label>
                            <input
                                id="ap-license"
                                name="license"
                                type="text"
                                placeholder="e.g. BRN-12345"
                                value={formData.license}
                                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="ap-message">Tell Us About Your Practice</label>
                            <textarea
                                id="ap-message"
                                name="message"
                                rows={4}
                                placeholder="Describe your experience, specializations, and why you want to partner..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Submit Application
                            <ArrowRight size={16} />
                        </button>
                    </form>
                </div>
            </section>
        </PageLayout>
    );
}
