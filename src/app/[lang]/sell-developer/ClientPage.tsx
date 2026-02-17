'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from '../sell-private/sell.module.css';

/**
 * MODON EVOLUTIO - Sell Developer Page
 * =====================================
 * Lead generation page for developers & projects
 */

const benefits = [
    'Dedicated sales and marketing team',
    'Global investor network access',
    'Premium project positioning',
    'Off-plan sales expertise',
    'Multi-channel digital campaigns',
    'Branded sales centers support',
];

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function SellDeveloperPage({ lang, dict }: ClientPageProps) {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        projectName: '',
        location: '',
        units: '',
        launchDate: '',
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
        if (!formData.name || !formData.email || !formData.phone || !formData.company) {
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
            type: 'sell_developer',
            source: 'website_sell_developer',
            metadata: {
                projectName: formData.projectName,
                location: formData.location,
                units: formData.units,
                launchDate: formData.launchDate,
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
                throw new Error(result.error || 'Failed to submit project');
            }

            setStatus('success');
            setSubmitted(true);
            // Optional: reset form if needed, but we are switching to success view
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        }
    };

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero Section */}
            <section className={`${styles.hero} ${styles.heroDeveloper}`}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <span className={styles.heroLabel}>For Developers</span>
                    <h1 className={styles.heroTitle}>
                        <em>Market Your Development</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Expert sales and marketing for luxury residential projects
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    {/* Left Column - Info */}
                    <div className={styles.infoColumn}>
                        <h2>Development Sales Excellence</h2>
                        <p>
                            MODON Evolutio specializes in marketing and selling new luxury
                            developments to an international audience. Our approach combines
                            strategic positioning, digital excellence, and direct access to
                            qualified buyers worldwide.
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
                            <Link href="/sell-professional" className={styles.sellerTypeLink}>
                                <span>I am a Real Estate Professional</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className={styles.formColumn}>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <h3>Submit Your Project</h3>
                                <p>Tell us about your development and we&apos;ll get in touch.</p>

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
                                        <label htmlFor="dev-name">Contact Name *</label>
                                        <input
                                            id="dev-name"
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
                                        <label htmlFor="dev-company">Developer / Company *</label>
                                        <input
                                            id="dev-company"
                                            name="company"
                                            type="text"
                                            required
                                            placeholder="Company name"
                                            autoComplete="organization"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="dev-email">Email Address *</label>
                                        <input
                                            id="dev-email"
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
                                        <label htmlFor="dev-phone">Phone Number *</label>
                                        <input
                                            id="dev-phone"
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
                                        <label htmlFor="dev-projectName">Project Name *</label>
                                        <input
                                            id="dev-projectName"
                                            name="projectName"
                                            type="text"
                                            required
                                            placeholder="e.g. MODON Residence"
                                            value={formData.projectName}
                                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="dev-location">Location *</label>
                                        <input
                                            id="dev-location"
                                            name="location"
                                            type="text"
                                            required
                                            placeholder="City, Country"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="dev-units">Number of Units</label>
                                        <input
                                            id="dev-units"
                                            name="units"
                                            type="text"
                                            placeholder="e.g. 50"
                                            value={formData.units}
                                            onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="dev-launchDate">Launch / Completion Date</label>
                                        <input
                                            id="dev-launchDate"
                                            name="launchDate"
                                            type="text"
                                            placeholder="Q1 2026"
                                            value={formData.launchDate}
                                            onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="dev-message">Project Description</label>
                                    <textarea
                                        id="dev-message"
                                        name="message"
                                        rows={4}
                                        placeholder="Tell us about your development..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <div className={styles.formPrivacy}>
                                    <input type="checkbox" id="dev-privacy" name="privacy" required />
                                    <label htmlFor="dev-privacy">
                                        I agree to the <Link href="/privacy">Privacy Policy</Link> and consent to being contacted.
                                    </label>
                                </div>

                                <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                                    {status === 'submitting' ? 'Submitting...' : 'Submit Project'}
                                </button>
                            </form>
                        ) : (
                            <div className={styles.successMessage}>
                                <div className={styles.successIcon}>
                                    <Check size={32} />
                                </div>
                                <h3>Project Submitted</h3>
                                <p>
                                    Thank you for submitting your development. Our team will
                                    review the details and contact you to discuss next steps.
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
