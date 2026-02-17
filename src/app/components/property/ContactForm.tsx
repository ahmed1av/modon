/**
 * Contact Form Component
 * =======================
 * Property inquiry form
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, Check, Loader2 } from 'lucide-react';
import styles from './contactForm.module.css';
import { Dictionary } from '@/types';

interface ContactFormProps {
    propertyId: string;
    propertyTitle: string;
    agentName: string;
    dict?: Dictionary;
    lang?: 'en' | 'ar';
}

export default function ContactForm({ propertyId, propertyTitle, agentName, dict, lang = 'en' }: ContactFormProps) {
    const t = dict?.property_details?.contact_form;

    // Default fallback text
    const text = {
        title: t?.title || 'Request Information',
        subtitle: t?.subtitle || 'Contact us for more information or a viewing',
        name: t?.name || 'Full Name *',
        email: t?.email || 'Email Address *',
        phone: t?.phone || 'Phone Number',
        message: t?.message || 'Message',
        submit: t?.submit || 'Send Inquiry',
        sending: t?.sending || 'Sending...',
        sent_title: t?.sent_title || 'Inquiry Sent!',
        sent_desc: (t?.sent_desc || 'Thank you for your interest. {agentName} will contact you shortly.').replace('{agentName}', agentName),
        send_another: t?.send_another || 'Send Another Inquiry',
        failed: t?.failed || 'Failed to send inquiry. Please try again.',
        privacy: t?.privacy || 'By submitting, you agree to our ',
        privacy_link: t?.privacy_link || 'Privacy Policy',
        preferred: t?.preferred || 'Preferred Contact Method',
        schedule: t?.schedule || 'I would like to schedule a viewing'
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: `I am interested in this property: ${propertyTitle}`,
        preferredContact: 'email',
        schedule: false,
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // Real API call to leads endpoint
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    message: formData.message,
                    type: 'property_inquiry',
                    propertyId: propertyId,
                    propertyTitle: propertyTitle,
                    preferredContact: formData.preferredContact,
                    metadata: {
                        scheduleViewing: formData.schedule,
                        agentName: agentName
                    }
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to send inquiry');
            }

            setStatus('success');
        } catch (error) {
            console.error('Contact form error:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className={styles.successCard}>
                <div className={styles.successIcon}>
                    <Check size={32} />
                </div>
                <h3>{text.sent_title}</h3>
                <p>{text.sent_desc}</p>
                <button
                    className={styles.resetBtn}
                    onClick={() => {
                        setStatus('idle');
                        setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            message: `I am interested in this property: ${propertyTitle}`,
                            preferredContact: 'email',
                            schedule: false,
                        });
                    }}
                >
                    {text.send_another}
                </button>
            </div>
        );
    }

    return (
        <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{text.title}</h3>
            <p className={styles.formSubtitle}>
                {lang === 'ar' ? `${agentName} تواصل مع` : `Get in touch with ${agentName} about this property`}
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">{text.name}</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={text.name}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">{text.email}</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone">{text.phone}</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="message">{text.message}</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder={text.message}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="preferredContact">{text.preferred}</label>
                    <select
                        id="preferredContact"
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleChange}
                    >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="whatsapp">WhatsApp</option>
                    </select>
                </div>

                <div className={styles.checkboxGroup}>
                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            name="schedule"
                            checked={formData.schedule}
                            onChange={handleChange}
                        />
                        <span>{text.schedule}</span>
                    </label>
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 size={18} className={styles.spinner} />
                            {text.sending}
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            {text.submit}
                        </>
                    )}
                </button>

                {status === 'error' && (
                    <p className={styles.errorMessage}>
                        {text.failed}
                    </p>
                )}

                <p className={styles.privacy}>
                    {text.privacy}
                    <Link href={`/${lang}/privacy`}>{text.privacy_link}</Link>
                </p>
            </form>
        </div>
    );
}
