'use client';

import { useState } from 'react';
import PageLayout from '@/app/components/PageLayout';
import styles from './contact.module.css';
import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function ContactClientPage({ lang, dict }: ClientPageProps) {
    const t = dict.contact_page;
    const common = dict.common;
    const [submitting, setSubmitting] = useState(false);

    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus('idle');
        setErrorMessage('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            type: 'contact',
            source: 'website_contact_page',
            // Honeypot field (should be empty)
            website: formData.get('website_hp'),
            _formStartTime: Date.now(),
        };

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit form');
            }

            setStatus('success');
            // Reset form
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageLayout lang={lang} dict={dict}>
            <div className={styles.container}>
                <div className={styles.titleSection}>
                    <h1>
                        <em>{t.title}</em>
                    </h1>
                    <p>{t.subtitle}</p>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.contactInfo}>
                        <div className={styles.infoBlock}>
                            <h3>{t.contact_info.address || 'Address'}</h3>
                            <p>Cairo, Egypt</p>
                            <p>New Cairo, 5th Settlement</p>
                            <p>Street 90</p>
                        </div>
                        <div className={styles.infoBlock}>
                            <h3>{t.contact_info.email || 'Email'}</h3>
                            <a href="mailto:info@modonevolutio.com">info@modonevolutio.com</a>
                        </div>
                        <div className={styles.infoBlock}>
                            <h3>{t.contact_info.phone || 'Phone'}</h3>
                            <a href="tel:+201017336118">+20 101 733 6118</a>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        {status === 'success' ? (
                            <div className={styles.successMessage}>
                                <h3>Thank you!</h3>
                                <p>Your message has been sent successfully. We will contact you soon.</p>
                                <button onClick={() => setStatus('idle')} className={styles.resetBtn}>Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {status === 'error' && (
                                    <div className={styles.errorMessage}>
                                        <p>{errorMessage}</p>
                                    </div>
                                )}
                                {/* Honeypot Field - Hidden from real users */}
                                <div className={styles.honeypot}>
                                    <label htmlFor="website_hp">Website</label>
                                    <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
                                </div>
                                <div className={styles.inputsRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name">{t.form.name}</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">{t.form.phone}</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            className={styles.input}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email">{t.form.email}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="message">{t.form.message}</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={4}
                                        className={styles.textArea}
                                    ></textarea>
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                                    {submitting ? common.loading : t.form.submit}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
