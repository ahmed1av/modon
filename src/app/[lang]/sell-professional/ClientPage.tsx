'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Building2, Handshake, Globe } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from '../sell-private/sell.module.css';

/**
 * MODON EVOLUTIO - Sell Professional Page
 * ====================================
 * Lead generation page for real estate professionals
 */

const benefits = [
    'Referral network and co-brokerage',
    'Access to international buyer database',
    'Marketing support and premium listing placement',
    'Shared commission structure',
    'Professional partnership protocols',
    'Dedicated partner liaison',
];

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function SellProfessionalPage({ lang, dict }: ClientPageProps) {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        license: '',
        region: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        const form = e.currentTarget;
        const formValues = new FormData(form);

        // Simple validation check before sending
        if (!formData.name || !formData.email || !formData.phone) {
            setErrorMessage('Please fill in all required fields.');
            setStatus('error');
            return;
        }

        const payload = {
            name: formData.name,
            company: formData.company,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            type: 'sell_professional',
            source: 'website_sell_professional',
            metadata: {
                license: formData.license,
                region: formData.region,
                company: formData.company
            },
            // Honeypot field
            website: formValues.get('website_hp'),
            _formStartTime: Date.now(),
        };

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit partnership request');
            }

            setStatus('success');
            setSubmitted(true);
            setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                license: '',
                region: '',
                message: '',
            });
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        }
    };

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero Section */}
            <section className={`${styles.hero} ${styles.heroProfessional}`}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <span className={styles.heroLabel}>For Professionals</span>
                    <h1 className={styles.heroTitle}>
                        <em>Partner With Us</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Join our network of trusted real estate professionals worldwide
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    {/* Left Column - Info */}
                    <div className={styles.infoColumn}>
                        <h2>Professional Partnership</h2>
                        <p>
                            Whether you&apos;re a broker with an exclusive listing or an agent
                            seeking to collaborate on international transactions, MODON Evolutio
                            offers a structured partnership approach that benefits all parties.
                        </p>

                        <div className={styles.benefitsList}>
                            {benefits.map((benefit, index) => (
                                <div key={index} className={styles.benefitItem}>
                                    <Check size={18} />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.sellerTypes}>
                            <h3>Looking for a different solution?</h3>
                            <Link href="/sell-private" className={styles.sellerTypeLink}>
                                <span>I am a Private Seller</span>
                                <ArrowRight size={16} />
                            </Link>
                            <Link href="/sell-developer" className={styles.sellerTypeLink}>
                                <span>I am a Developer / Project</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className={styles.formColumn}>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <h3>Become a Partner</h3>
                                <p>Register your interest in joining our professional network.</p>

                                {status === 'error' && (
                                    <div className={styles.errorMessage}>
                                        <p>{errorMessage}</p>
                                    </div>
                                )}

                                {/* Honeypot - Anti-Spam */}
                                <div className={styles.honeypot}>
                                    <label htmlFor="website_hp">Website</label>
                                    <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="pro-name">Full Name *</label>
                                        <input
                                            id="pro-name"
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
                                        <label htmlFor="pro-company">Company Name *</label>
                                        <input
                                            id="pro-company"
                                            name="company"
                                            type="text"
                                            required
                                            placeholder="Your company"
                                            autoComplete="organization"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="pro-email">Email Address *</label>
                                        <input
                                            id="pro-email"
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
                                        <label htmlFor="pro-phone">Phone Number *</label>
                                        <input
                                            id="pro-phone"
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

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="pro-license">License Number</label>
                                        <input
                                            id="pro-license"
                                            name="license"
                                            type="text"
                                            placeholder="e.g. BRN-12345"
                                            value={formData.license}
                                            onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="pro-region">Primary Region *</label>
                                        <select
                                            id="pro-region"
                                            name="region"
                                            required
                                            value={formData.region}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        >
                                            <option value="">Select region</option>
                                            <option value="europe">Europe</option>
                                            <option value="middle-east">Middle East</option>
                                            <option value="asia">Asia Pacific</option>
                                            <option value="americas">Americas</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="pro-message">Tell Us About Your Business</label>
                                    <textarea
                                        id="pro-message"
                                        name="message"
                                        rows={4}
                                        placeholder="Specializations, listings, collaboration interests..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <div className={styles.formPrivacy}>
                                    <input type="checkbox" id="pro-privacy" name="privacy" required />
                                    <label htmlFor="pro-privacy">
                                        I agree to the <Link href="/privacy">Privacy Policy</Link> and partnership terms.
                                    </label>
                                </div>

                                <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                                    {status === 'submitting' ? 'Submitting...' : 'Submit Partnership Request'}
                                </button>
                            </form>
                        ) : (
                            <div className={styles.successMessage}>
                                <div className={styles.successIcon}>
                                    <Check size={32} />
                                </div>
                                <h3>Partnership Request Received</h3>
                                <p>
                                    Thank you for your interest. Our partner relations team
                                    will review your application and contact you shortly.
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
