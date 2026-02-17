'use client';

import Link from 'next/link';
import { Check, Globe, Award, Users, Target } from 'lucide-react';
import Image from 'next/image';
import PageLayout from '@/app/components/PageLayout';
import styles from './about.module.css';
import { Dictionary } from '@/types';

/**
 * MODON EVOLUTIO - Our Company Page
 * ==================================
 * Storytelling layout for brand narrative
 */

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function OurCompanyPage({ lang, dict }: ClientPageProps) {
    const t = dict.our_company;

    const values = [
        {
            icon: Target,
            title: t.values.client_first.title,
            description: t.values.client_first.description,
        },
        {
            icon: Globe,
            title: t.values.global_perspective.title,
            description: t.values.global_perspective.description,
        },
        {
            icon: Award,
            title: t.values.excellence.title,
            description: t.values.excellence.description,
        },
        {
            icon: Users,
            title: t.values.trust_integrity.title,
            description: t.values.trust_integrity.description,
        },
    ];

    const milestones = [
        { year: '2018', title: t.milestones.founded.title, description: t.milestones.founded.description },
        { year: '2014', title: t.milestones.expansion.title, description: t.milestones.expansion.description },
        { year: '2018', title: t.milestones.network.title, description: t.milestones.network.description },
        { year: '2022', title: t.milestones.digital.title, description: t.milestones.digital.description },
    ];

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <em>{t.hero_title}</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        {t.hero_subtitle}
                    </p>
                </div>
            </section>

            {/* Intro Section */}
            <section className={styles.intro}>
                <div className={styles.introContainer}>
                    <div className={styles.introText}>
                        <h2>
                            {t.intro_title_1}
                            <br />
                            <span>{t.intro_title_2}</span>
                        </h2>
                        <p>{t.intro_text_1}</p>
                        <p>{t.intro_text_2}</p>
                    </div>
                    <div className={styles.introImage}>
                        <Image
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600"
                            alt="MODON Evolutio Office"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.values}>
                <div className={styles.valuesHeader}>
                    <h2><em>{t.values_title}</em></h2>
                </div>
                <div className={styles.valuesGrid}>
                    {values.map((value, index) => (
                        <div key={index} className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <value.icon size={28} />
                            </div>
                            <h3>{value.title}</h3>
                            <p>{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Timeline Section */}
            <section className={styles.timeline}>
                <div className={styles.timelineHeader}>
                    <h2>{t.timeline_title}</h2>
                </div>
                <div className={styles.timelineContainer}>
                    {milestones.map((milestone, index) => (
                        <div key={index} className={styles.milestone}>
                            <div className={styles.milestoneYear}>{milestone.year}</div>
                            <div className={styles.milestoneLine} />
                            <div className={styles.milestoneContent}>
                                <h3>{milestone.title}</h3>
                                <p>{milestone.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quote Section */}
            <section className={styles.quote}>
                <blockquote>
                    {t.quote}
                </blockquote>
                <cite>{t.quote_author}</cite>
            </section>

            {/* Team CTA */}
            <section className={styles.teamCta}>
                <div className={styles.teamCtaContent}>
                    <h2>{t.team_cta.title}</h2>
                    <p>
                        {t.team_cta.text}
                    </p>
                    <Link href={`/${lang}/management-team`} className={styles.ctaBtn}>
                        {t.team_cta.button}
                    </Link>
                </div>
            </section>
        </PageLayout>
    );
}
