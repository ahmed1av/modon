'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palette, Sparkles, Check, ArrowRight } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from '../our-company/about.module.css';
import intStyles from './interiors.module.css';

/**
 * MODON EVOLUTIO - Interiors Page
 * ================================
 * Interior design services
 */

const services = [
    {
        title: 'Full Interior Design',
        description: 'Complete design from concept to completion, tailored to your lifestyle.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    },
    {
        title: 'Furniture Sourcing',
        description: 'Curated selection of luxury furniture from prestigious international brands.',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600',
    },
    {
        title: 'Art Advisory',
        description: 'Expert guidance on building and displaying your art collection.',
        image: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&q=80&w=600',
    },
    {
        title: 'Project Management',
        description: 'Seamless coordination of contractors, artisans, and installations.',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600',
    },
];

const portfolio = [
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
];

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function MODONInteriorsPage({ lang, dict }: ClientPageProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you! We will contact you about interior design services.');
    };

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero */}
            <section className={intStyles.hero}>
                <div className={intStyles.heroOverlay} />
                <div className={intStyles.heroContent}>
                    <div className={intStyles.heroTag}>
                        <Palette size={18} />
                        <span>Design Studio</span>
                    </div>
                    <h1 className={intStyles.heroTitle}>
                        <em>MODON Evolutio Interiors</em>
                    </h1>
                    <p className={intStyles.heroSubtitle}>
                        Transforming luxury properties into extraordinary homes
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={styles.intro}>
                <div className={styles.introContainer}>
                    <div className={styles.introText}>
                        <h2>
                            Design That
                            <br />
                            <span>Elevates Living</span>
                        </h2>
                        <p>
                            MODON Evolutio Interiors extends our commitment to luxury beyond the property
                            transaction. Our design studio helps clients transform their newly
                            acquired homes into personalized sanctuaries that reflect their
                            unique taste and lifestyle.
                        </p>
                        <p>
                            From complete renovations to refined finishing touches, our team
                            of designers works closely with you to create spaces that inspire.
                        </p>
                    </div>
                    <div className={styles.introImage}>
                        <div className={intStyles.imageWrapper}>
                            <Image
                                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600"
                                alt="Interior Design"
                                fill
                                sizes="(max-width: 768px) 100vw, 600px"
                                className={intStyles.img}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className={intStyles.services}>
                <div className={intStyles.servicesHeader}>
                    <h2><em>Our Services</em></h2>
                </div>
                <div className={intStyles.servicesGrid}>
                    {services.map((service, index) => (
                        <div key={index} className={intStyles.serviceCard}>
                            <div className={intStyles.serviceImage}>
                                <div className={intStyles.serviceImageInner}>
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                                        className={intStyles.img}
                                    />
                                </div>
                            </div>
                            <div className={intStyles.serviceInfo}>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Portfolio */}
            <section className={intStyles.portfolio}>
                <div className={intStyles.portfolioHeader}>
                    <h2>Recent Projects</h2>
                </div>
                <div className={intStyles.portfolioGrid}>
                    {portfolio.map((img, index) => (
                        <div key={index} className={intStyles.portfolioItem}>
                            <div className={intStyles.portfolioImageInner}>
                                <Image
                                    src={img}
                                    alt={`Interior Project ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                                    className={intStyles.img}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Form */}
            <section className={intStyles.contactSection}>
                <div className={intStyles.contactContainer}>
                    <div className={intStyles.contactInfo}>
                        <h2>Start Your Project</h2>
                        <p>
                            Tell us about your vision and we&apos;ll arrange a consultation
                            with one of our designers.
                        </p>
                        <ul className={intStyles.checkList}>
                            <li><Check size={16} /> Complimentary initial consultation</li>
                            <li><Check size={16} /> 3D visualization included</li>
                            <li><Check size={16} /> Global sourcing network</li>
                        </ul>
                    </div>
                    <form onSubmit={handleSubmit} className={intStyles.form}>
                        <div className={intStyles.formGroup}>
                            <label htmlFor="int-name">Full Name *</label>
                            <input
                                id="int-name"
                                name="name"
                                type="text"
                                required
                                placeholder="Your full name"
                                autoComplete="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className={intStyles.formRow}>
                            <div className={intStyles.formGroup}>
                                <label htmlFor="int-email">Email *</label>
                                <input
                                    id="int-email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className={intStyles.formGroup}>
                                <label htmlFor="int-phone">Phone</label>
                                <input
                                    id="int-phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+20 xxx xxx xxxx"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className={intStyles.formGroup}>
                            <label htmlFor="int-service">Service Interest</label>
                            <select
                                id="int-service"
                                name="service"
                                value={formData.service}
                                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                            >
                                <option value="">Select a service</option>
                                <option value="full">Full Interior Design</option>
                                <option value="furniture">Furniture Sourcing</option>
                                <option value="art">Art Advisory</option>
                                <option value="renovation">Renovation Project</option>
                            </select>
                        </div>
                        <div className={intStyles.formGroup}>
                            <label htmlFor="int-message">Tell Us About Your Project</label>
                            <textarea
                                id="int-message"
                                name="message"
                                rows={4}
                                placeholder="Describe your property and design vision..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                        <button type="submit" className={intStyles.submitBtn}>
                            Request Consultation
                            <ArrowRight size={16} />
                        </button>
                    </form>
                </div>
            </section>
        </PageLayout>
    );
}
