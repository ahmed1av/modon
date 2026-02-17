'use client';

import Link from 'next/link';
import { Award, MapPin, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import PageLayout from '@/app/components/PageLayout';
import styles from '../management-team/team.module.css';
import agentStyles from './agents.module.css';
import { Dictionary } from '@/types';

/**
 * MODON EVOLUTIO - Real Estate Agents Page
 * =========================================
 * Our team of property advisors
 */



interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function RealEstateAgentsPage({ lang, dict }: ClientPageProps) {
    const t = dict.real_estate_agents;

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero */}
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

            {/* Intro */}
            <section className={agentStyles.intro}>
                <div className={agentStyles.introContent}>
                    <h2>{t.intro_title}</h2>
                    <p>
                        {t.intro_text}
                    </p>
                </div>
            </section>

            {/* Agents Grid */}
            <section className={agentStyles.agentsSection}>
                <div className={agentStyles.agentsGrid}>
                    {t.members.map((agent, index) => (
                        <div key={index} className={agentStyles.agentCard}>
                            <div className={agentStyles.agentImage}>
                                <Image
                                    src={agent.image}
                                    alt={agent.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className={agentStyles.agentInfo}>
                                <h3>{agent.name}</h3>
                                <span className={agentStyles.title}>{agent.title}</span>
                                <div className={agentStyles.details}>
                                    <div className={agentStyles.detail}>
                                        <MapPin size={14} />
                                        <span>{agent.region}</span>
                                    </div>
                                    <div className={agentStyles.detail}>
                                        <Award size={14} />
                                        <span>{agent.specialization}</span>
                                    </div>
                                </div>
                                <a href={`mailto:${agent.email}`} className={agentStyles.contactLink}>
                                    <Mail size={14} />
                                    {t.contact_button}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className={styles.joinCta}>
                <div className={styles.joinContent}>
                    <h2>{t.join_team.title}</h2>
                    <p>
                        {t.join_team.text}
                    </p>
                    <Link href={`/${lang}/contact`} className={styles.ctaBtn}>
                        {t.join_team.button}
                    </Link>
                </div>
            </section>
        </PageLayout>
    );
}
