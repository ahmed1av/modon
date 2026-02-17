'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from './sell.module.css';

/**
 * MODON EVOLUTIO - Sell Private Page
 * ===============================
 * Lead generation page for private sellers
 * Connected to /api/leads endpoint
 */

const benefits = [
    'Access to qualified international buyers',
    'Professional property photography',
    'Multi-platform marketing strategy',
    'Personal advisor throughout the process',
    'Transparent valuation with market data',
    'Negotiation expertise for optimal pricing',
];

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    propertyType: string;
    location: string;
    askingPrice: string;
    message: string;
    privacyConsent: boolean;
}

interface SubmissionState {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
}

const initialFormState: FormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyType: '',
    location: '',
    askingPrice: '',
    message: '',
    privacyConsent: false,
};

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function SellPrivatePage({ lang, dict }: ClientPageProps) {
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [submission, setSubmission] = useState<SubmissionState>({
        status: 'idle',
        message: '',
    });
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormState, string>>>({});

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear validation error
        if (validationErrors[name as keyof FormState]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof FormState, string>> = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.propertyType) {
            errors.propertyType = 'Property type is required';
        }

        if (!formData.location.trim()) {
            errors.location = 'Location is required';
        }

        if (!formData.privacyConsent) {
            errors.privacyConsent = 'You must agree to the privacy policy';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmission({ status: 'loading', message: '' });

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    subject: 'Property Valuation Request',
                    message: `Property Type: ${formData.propertyType}\nLocation: ${formData.location}\nAsking Price: ${formData.askingPrice || 'Not specified'}\n\n${formData.message || 'No additional information provided.'}`,
                    type: 'sell_private',
                    source: 'sell_private_page',
                    metadata: {
                        propertyType: formData.propertyType,
                        location: formData.location,
                        askingPrice: formData.askingPrice,
                    },
                    // Honeypot field
                    website: (e.target as HTMLFormElement).website_hp?.value,
                    _formStartTime: Date.now(),
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmission({
                    status: 'success',
                    message: result.message || 'Thank you! A property advisor will contact you shortly.',
                });
                setFormData(initialFormState);
            } else {
                throw new Error(result.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmission({
                status: 'error',
                message: error instanceof Error ? error.message : 'Failed to submit. Please try again.',
            });
        }
    };

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <span className={styles.heroLabel}>For Private Sellers</span>
                    <h1 className={styles.heroTitle}>
                        <em>Sell Your Luxury Property</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Partner with MODON Evolutio to access a global network of qualified buyers
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    {/* Left Column - Info */}
                    <div className={styles.infoColumn}>
                        <h2>Why Sell With Us?</h2>
                        <p>
                            At MODON Evolutio, we understand that selling your luxury property
                            requires more than traditional marketing. Our approach combines
                            global reach with local expertise, ensuring your property reaches
                            the right buyers at the right price.
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
                            <Link href="/sell-professional" className={styles.sellerTypeLink}>
                                <span>I am a Real Estate Professional</span>
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
                        {/* Success State */}
                        {submission.status === 'success' && (
                            <div className={styles.successMessage}>
                                <div className={styles.successIcon}>
                                    <Check size={32} />
                                </div>
                                <h3>Thank You!</h3>
                                <p>
                                    Your request has been received. A property advisor will
                                    contact you within 24 hours to discuss your property.
                                </p>
                                <Link href="/" className={styles.backHome}>
                                    Return to Home
                                </Link>
                            </div>
                        )}

                        {/* Error State */}
                        {submission.status === 'error' && (
                            <div className={styles.errorMessage}>
                                <AlertCircle size={48} />
                                <h3>Something Went Wrong</h3>
                                <p>{submission.message}</p>
                                <button
                                    className={styles.retryBtn}
                                    onClick={() => setSubmission({ status: 'idle', message: '' })}
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Form */}
                        {(submission.status === 'idle' || submission.status === 'loading') && (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <h3>Request a Free Valuation</h3>
                                <p>Fill out the form below and a property advisor will contact you shortly.</p>

                                {/* Honeypot - Anti-Spam */}
                                <div className={styles.honeypot}>
                                    <label htmlFor="website_hp">Website</label>
                                    <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="firstName">First Name *</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            placeholder="Your first name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={validationErrors.firstName ? styles.inputError : ''}
                                            disabled={submission.status === 'loading'}
                                        />
                                        {validationErrors.firstName && (
                                            <span className={styles.errorText}>{validationErrors.firstName}</span>
                                        )}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="lastName">Last Name *</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Your last name"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={validationErrors.lastName ? styles.inputError : ''}
                                            disabled={submission.status === 'loading'}
                                        />
                                        {validationErrors.lastName && (
                                            <span className={styles.errorText}>{validationErrors.lastName}</span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={validationErrors.email ? styles.inputError : ''}
                                            disabled={submission.status === 'loading'}
                                        />
                                        {validationErrors.email && (
                                            <span className={styles.errorText}>{validationErrors.email}</span>
                                        )}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            placeholder="+31 6 1234 5678"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={submission.status === 'loading'}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="propertyType">Property Type *</label>
                                        <select
                                            id="propertyType"
                                            name="propertyType"
                                            title="Select property type"
                                            value={formData.propertyType}
                                            onChange={handleInputChange}
                                            className={validationErrors.propertyType ? styles.inputError : ''}
                                            disabled={submission.status === 'loading'}
                                        >
                                            <option value="">Select type</option>
                                            <option value="villa">Villa</option>
                                            <option value="apartment">Apartment</option>
                                            <option value="penthouse">Penthouse</option>
                                            <option value="estate">Estate</option>
                                            <option value="townhouse">Townhouse</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {validationErrors.propertyType && (
                                            <span className={styles.errorText}>{validationErrors.propertyType}</span>
                                        )}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="location">Location *</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            placeholder="City, Country"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className={validationErrors.location ? styles.inputError : ''}
                                            disabled={submission.status === 'loading'}
                                        />
                                        {validationErrors.location && (
                                            <span className={styles.errorText}>{validationErrors.location}</span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="askingPrice">Asking Price (indicative)</label>
                                        <input
                                            type="text"
                                            id="askingPrice"
                                            name="askingPrice"
                                            placeholder="€"
                                            value={formData.askingPrice}
                                            onChange={handleInputChange}
                                            disabled={submission.status === 'loading'}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message">Additional Information</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        placeholder="Tell us about your property..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        disabled={submission.status === 'loading'}
                                    />
                                </div>

                                <div className={styles.formPrivacy}>
                                    <input
                                        type="checkbox"
                                        id="privacyConsent"
                                        name="privacyConsent"
                                        checked={formData.privacyConsent}
                                        onChange={handleInputChange}
                                        disabled={submission.status === 'loading'}
                                    />
                                    <label htmlFor="privacyConsent">
                                        I agree to the <Link href="/privacy">Privacy Policy</Link> and consent to being contacted.
                                    </label>
                                </div>
                                {validationErrors.privacyConsent && (
                                    <span className={styles.errorText}>{validationErrors.privacyConsent}</span>
                                )}

                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={submission.status === 'loading'}
                                >
                                    {submission.status === 'loading' ? (
                                        <>
                                            <Loader2 className={styles.spinner} size={18} />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Request Valuation'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
