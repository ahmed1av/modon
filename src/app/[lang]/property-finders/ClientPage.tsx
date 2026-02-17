'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check, Shield, Users, Target, Clock, Globe } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from './finders.module.css';

/**
 * MODON EVOLUTIO - Property Finders Page
 * ===================================
 * Service info layout with MODON Evolutio luxury aesthetic
 */

const benefits = [
    {
        icon: Shield,
        title: 'Exclusive Representation',
        description: 'Your interests are our only priority. We work exclusively for you, never the seller.',
    },
    {
        icon: Target,
        title: 'Curated Selection',
        description: 'Access properties that match your exact criteria, including off-market opportunities.',
    },
    {
        icon: Globe,
        title: 'Global Network',
        description: 'Connections with trusted advisors across Europe\'s most refined markets.',
    },
    {
        icon: Clock,
        title: 'Time Efficiency',
        description: 'Skip the noise. We present only properties worth your consideration.',
    },
    {
        icon: Users,
        title: 'Personal Advisor',
        description: 'One dedicated contact who understands your needs from start to finish.',
    },
];

const steps = [
    {
        number: '01',
        title: 'Initial Consultation',
        description: 'We discuss your requirements, preferences, and timeline in detail to understand exactly what you\'re looking for.',
    },
    {
        number: '02',
        title: 'Property Search',
        description: 'Our team searches through our extensive network, including exclusive off-market properties not available elsewhere.',
    },
    {
        number: '03',
        title: 'Curated Shortlist',
        description: 'We present a carefully selected list of properties that meet your criteria, complete with detailed analysis.',
    },
    {
        number: '04',
        title: 'Viewings & Guidance',
        description: 'We arrange and accompany you on viewings, providing expert insights on each property.',
    },
    {
        number: '05',
        title: 'Negotiation & Acquisition',
        description: 'We negotiate on your behalf and guide you through the entire acquisition process to closing.',
    },
];

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function PropertyFindersPage({ lang, dict }: ClientPageProps) {
    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <em>Your Personal Property Advisor</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        A bespoke approach to finding your perfect luxury home
                    </p>
                    <Link href="/contact" className={styles.heroBtn}>
                        Start Your Search
                    </Link>
                </div>
            </section>

            {/* Intro Section */}
            <section className={styles.intro}>
                <div className={styles.introContainer}>
                    <div className={styles.introContent}>
                        <h2>
                            The properties you prefer,
                            <br />
                            <span>and nothing more</span>
                        </h2>
                        <p>
                            When searching for a luxury property abroad, the process can quickly become
                            overwhelming. Duplicate listings, outdated information, and conflicting
                            advice from multiple agents make it difficult to navigate the market effectively.
                        </p>
                        <p>
                            Our Property Finder service eliminates these frustrations. As your dedicated
                            representative, we work exclusively in your interest—never the seller&apos;s.
                            This means objective advice, access to exclusive opportunities, and a
                            streamlined path to your new home.
                        </p>
                    </div>
                    <div className={styles.introImage}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
                                alt="Luxury Property"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className={styles.img}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className={styles.benefits}>
                <div className={styles.benefitsHeader}>
                    <h2>Why Choose Our Property Finder Service?</h2>
                </div>
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

            {/* Process Steps */}
            <section className={styles.process}>
                <div className={styles.processHeader}>
                    <h2><em>How It Works</em></h2>
                    <p>A transparent, structured approach to finding your dream property</p>
                </div>
                <div className={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.stepContent}>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Checklist Section */}
            <section className={styles.checklist}>
                <div className={styles.checklistContainer}>
                    <div className={styles.checklistImage}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800"
                                alt="Luxury Home"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className={styles.img}
                            />
                        </div>
                    </div>
                    <div className={styles.checklistContent}>
                        <h2>What You Get</h2>
                        <ul>
                            <li><Check size={18} /> One trusted contact focused solely on your interests</li>
                            <li><Check size={18} /> Direct access to exclusive off-market listings</li>
                            <li><Check size={18} /> Transparent guidance from local experts</li>
                            <li><Check size={18} /> A private search with no unwanted registrations</li>
                            <li><Check size={18} /> A streamlined, safe path to your new home</li>
                            <li><Check size={18} /> Professional negotiation on your behalf</li>
                            <li><Check size={18} /> Support through the entire acquisition process</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className={styles.ctaContent}>
                    <h2>Ready to Find Your Perfect Property?</h2>
                    <p>
                        Schedule a consultation with one of our property advisors to discuss your requirements
                    </p>
                    <div className={styles.ctaButtons}>
                        <Link href="/contact" className={styles.ctaBtnPrimary}>
                            Schedule Consultation
                        </Link>
                        <Link href="/buy" className={styles.ctaBtnSecondary}>
                            Browse Properties
                        </Link>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
