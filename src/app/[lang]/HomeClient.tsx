'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/navigation/Header';
import Hero from '@/app/components/Hero';
import PropertyCard from '@/app/components/property/PropertyCard';
import Footer from '@/app/components/Footer';
import StatsCounter from '@/app/components/StatsCounter';
import ScrollReveal from '@/app/components/ScrollReveal';
import styles from './page.module.css';
import { PropertyListItem, Dictionary } from '@/types';

/**
 * MODON EVOLUTIO - Homepage
 * ==========================
 * Premium luxury real estate homepage inspired by Baerz.com
 * 
 * UPDATED: Added StatsCounter, ScrollReveal, cinematic animations,
 * gold gradient dividers, and premium visual enhancements
 */

interface HomeClientProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
    initialProperties: PropertyListItem[];
}

// Key metrics for the stats counter
const MODON_STATS = [
    { value: 2500, suffix: '+', label: 'Premium Properties', sublabel: 'Across Egypt' },
    { value: 15, suffix: 'B+', prefix: 'EGP ', label: 'Portfolio Value', sublabel: 'Under Management' },
    { value: 98, suffix: '%', label: 'Client Satisfaction', sublabel: 'Independent Reviews' },
    { value: 12, suffix: '+', label: 'Years Experience', sublabel: 'Market Leadership' },
];

export default function Home({ lang, dict, initialProperties = [] }: HomeClientProps) {
    const [properties] = useState<PropertyListItem[]>(initialProperties);
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
    const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => new Set(prev).add(entry.target.id));
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        sectionRefs.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const registerRef = (id: string) => (el: HTMLElement | null) => {
        if (el) sectionRefs.current.set(id, el);
    };

    const isVisible = (id: string) => visibleSections.has(id);

    // Fallback for home dictionary if undefined
    const t = dict?.home || {
        about: {
            title_line1: "Trusted by sellers. Preferred by",
            title_line2: "buyers.",
            title_highlight: "Driven by expertise.",
            text1: "In a landscape defined by excess and duplicates, we provide a refined alternative. Each property in our portfolio is independently verified, architecturally significant, and positioned within the top tier of its market.",
            text2: "Through a peer-to-peer network of established professionals, we connect discerning buyers with exclusive off-market opportunities and impeccably curated residences."
        },
        bespoke: {
            title_line1: "A curated approach defined",
            title_line2: "by your priorities",
            text: "Your representation is defined by expertise, discretion, and unwavering commitment to your vision. From initial consultation to final acquisition, every step is orchestrated with precision.",
            cta: "Discover our Bespoke Approach"
        },
        featured: {
            title: "Featured luxury homes for sale",
            view_all: "View All Properties",
            loading: "Loading premium properties..."
        },
        prefer: {
            title_line1: "The properties you prefer,",
            title_line2: "and nothing more",
            list: [
                "One trusted contact for every aspect of your transaction",
                "Direct access to off-market and pre-market opportunities",
                "Transparent guidance on pricing, legal, and market dynamics",
                "A private search tailored to your exact specifications",
                "A streamlined, and safe path to property ownership"
            ]
        },
        equestrian: {
            title: "Exquisite equestrian properties",
            cta: "Explore Equestrian Properties"
        },
        guide: {
            title: "Buying abroad? Avoid common pitfalls.",
            subtitle: "Before you continue your property search, learn from the mistakes of international buyers.",
            text1: "Every year, we see international buyers lose significant sums through avoidable mistakes — from due diligence oversights to structural defects discovered too late.",
            text2: "These are avoidable mistakes. Our comprehensive guide helps you navigate the process with confidence and make informed decisions."
        },
        access_form: {
            title: "Access your free guide for safe international property buying",
            first_name: "First name *",
            last_name: "Last name *",
            email: "Email *",
            phone: "Phone number",
            message: "Your message *",
            marketing_consent_start: "I agree to receive marketing communications and accept the ",
            privacy_policy: "privacy policy",
            marketing_consent_end: ". I can unsubscribe at any time.",
            submit: "Send"
        }
    };

    return (
        <main className={styles.main}>
            <Header dict={dict} lang={lang} />
            <Hero dict={dict?.hero} />

            {/* =============================================
                STATS COUNTER — Animated metrics
                ============================================= */}
            <StatsCounter stats={MODON_STATS} />

            {/* Gold Divider */}
            <hr className="section-divider" />

            {/* =============================================
                ABOUT SECTION — Light bg, text left, image right
                Inspired by Baerz.com's about section
                ============================================= */}
            <section
                id="about"
                ref={registerRef('about')}
                className={`${styles.about} ${isVisible('about') ? styles.visible : ''}`}
            >
                <div className={styles.aboutContainer}>
                    <ScrollReveal animation="slideLeft" delay={100}>
                        <div className={styles.aboutContent}>
                            <div className={styles.sectionLabel}>About Us</div>
                            <h2 className={styles.aboutTitle}>
                                {t.about.title_line1}
                                <br />
                                {t.about.title_line2} <span className={styles.titleHighlight}>{t.about.title_highlight}</span>
                            </h2>
                            <p className={styles.aboutText}>{t.about.text1}</p>
                            <p className={styles.aboutText}>{t.about.text2}</p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal animation="slideRight" delay={300}>
                        <div className={styles.aboutImageWrapper}>
                            <div className={styles.aboutImageAccent} />
                            <div className={styles.aboutImage}>
                                <Image
                                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
                                    alt="Luxury Property"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Gold Divider */}
            <hr className="section-divider" />

            {/* =============================================
                BESPOKE APPROACH — Dark navy background
                Image left, text right
                ============================================= */}
            <section
                id="bespoke"
                ref={registerRef('bespoke')}
                className={`${styles.bespoke} ${isVisible('bespoke') ? styles.visible : ''}`}
            >
                <div className={styles.bespokeContainer}>
                    <ScrollReveal animation="slideLeft" delay={100}>
                        <div className={styles.bespokeImage}>
                            <Image
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800"
                                alt="Property Advisor"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </ScrollReveal>
                    <ScrollReveal animation="slideRight" delay={300}>
                        <div className={styles.bespokeContent}>
                            <div className={styles.sectionLabelLight}>Our Approach</div>
                            <h2 className={styles.bespokeTitle}>
                                {t.bespoke.title_line1}
                                <br />
                                <span>{t.bespoke.title_line2}</span>
                            </h2>
                            <p className={styles.bespokeText}>{t.bespoke.text}</p>
                            <Link href={`/${lang}/property-finders`} className={styles.bespokeBtn}>
                                {t.bespoke.cta}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Gold Divider */}
            <hr className="section-divider" />

            {/* =============================================
                FEATURED PROPERTIES — 3 column grid
                ============================================= */}
            <section
                id="featured"
                ref={registerRef('featured')}
                className={`${styles.properties} ${isVisible('featured') ? styles.visible : ''}`}
            >
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionLabel}>Our Portfolio</div>
                    <h2 className={styles.sectionTitle}>
                        <em>{t.featured.title}</em>
                    </h2>
                </div>

                <div className={styles.propertiesGrid}>
                    {(Array.isArray(properties) ? properties : []).slice(0, 3).map((prop, index) => (
                        <ScrollReveal key={prop.id} animation="fadeUp" delay={index * 200}>
                            <PropertyCard property={prop} lang={lang} dict={dict} />
                        </ScrollReveal>
                    ))}
                    {properties.length === 0 && (
                        <div className={styles.propertiesEmpty}>
                            {t.featured.loading}
                        </div>
                    )}
                </div>

                <div className={styles.sectionCta}>
                    <Link href={`/${lang}/buy`} className={styles.viewAllBtn}>
                        {t.featured.view_all}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* =============================================
                PREFER SECTION — Light bg, text left, image right
                ============================================= */}
            <section
                id="prefer"
                ref={registerRef('prefer')}
                className={`${styles.prefer} ${isVisible('prefer') ? styles.visible : ''}`}
            >
                <div className={styles.preferContainer}>
                    <ScrollReveal animation="slideLeft" delay={100}>
                        <div className={styles.preferContent}>
                            <h2 className={styles.preferTitle}>
                                {t.prefer.title_line1}
                                <br />
                                <span>{t.prefer.title_line2}</span>
                            </h2>
                            <ul className={styles.preferList}>
                                {t.prefer.list.map((item, idx) => (
                                    <li key={idx}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BE9C7E" strokeWidth="2.5">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal animation="slideRight" delay={300}>
                        <div className={styles.preferImage}>
                            <Image
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
                                alt="Luxury Home"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* =============================================
                EQUESTRIAN — Full-width parallax section
                ============================================= */}
            <section
                id="equestrian"
                ref={registerRef('equestrian')}
                className={`${styles.equestrian} ${isVisible('equestrian') ? styles.visible : ''}`}
            >
                <div className={styles.equestrianBg}>
                    <Image
                        src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80"
                        alt="Equestrian Estate"
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
                <div className={styles.equestrianOverlay} />
                <div className={styles.equestrianContent}>
                    <h2 className={styles.equestrianTitle}>
                        <em>{t.equestrian.title}</em>
                    </h2>
                    <Link href={`/${lang}/equestrian-estates`} className={styles.equestrianBtn}>
                        {t.equestrian.cta}
                    </Link>
                </div>
            </section>

            {/* Gold Divider */}
            <hr className="section-divider" />

            {/* =============================================
                GUIDE SECTION
                ============================================= */}
            <section
                id="guide"
                ref={registerRef('guide')}
                className={`${styles.guide} ${isVisible('guide') ? styles.visible : ''}`}
            >
                <div className={styles.guideContainer}>
                    <ScrollReveal animation="slideLeft" delay={100}>
                        <div className={styles.guideContent}>
                            <div className={styles.sectionLabel}>Buyer&apos;s Guide</div>
                            <h2 className={styles.guideTitle}>
                                {t.guide.title}
                            </h2>
                            <p className={styles.guideSubtitle}>
                                {t.guide.subtitle}
                            </p>
                            <p className={styles.guideText}>
                                {t.guide.text1}
                            </p>
                            <p className={styles.guideText}>
                                {t.guide.text2}
                            </p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal animation="scaleIn" delay={300}>
                        <div className={styles.guideVideo}>
                            <div className={styles.videoPlaceholder}>
                                <div className={styles.playButton}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* =============================================
                ACCESS GUIDE FORM
                ============================================= */}
            <section className={styles.accessGuide}>
                <ScrollReveal animation="fadeUp">
                    <h2 className={styles.accessGuideTitle}>
                        {t.access_form.title}
                    </h2>
                </ScrollReveal>
                <ScrollReveal animation="fadeUp" delay={200}>
                    <form className={styles.accessForm}>
                        <div className={styles.formRow}>
                            <input type="text" id="guide-firstName" name="firstName" placeholder={t.access_form.first_name} autoComplete="given-name" />
                            <input type="text" id="guide-lastName" name="lastName" placeholder={t.access_form.last_name} autoComplete="family-name" />
                        </div>
                        <div className={styles.formRow}>
                            <input type="email" id="guide-email" name="email" placeholder={t.access_form.email} autoComplete="email" />
                            <input type="tel" id="guide-phone" name="phone" placeholder={t.access_form.phone} autoComplete="tel" />
                        </div>
                        <div className={styles.formRow}>
                            <textarea id="guide-message" name="message" placeholder={t.access_form.message} rows={4} />
                        </div>
                        <div className={styles.formCheckbox}>
                            <input type="checkbox" id="guide-marketing" name="marketing" />
                            <label htmlFor="guide-marketing">
                                {t.access_form.marketing_consent_start}
                                <Link href={`/${lang}/privacy-policy`}>{t.access_form.privacy_policy}</Link>
                                {t.access_form.marketing_consent_end}
                            </label>
                        </div>
                        <button type="submit" className={styles.submitBtn}>{t.access_form.submit}</button>
                    </form>
                </ScrollReveal>
            </section>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
