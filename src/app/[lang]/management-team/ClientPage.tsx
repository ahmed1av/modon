'use client';

import Link from 'next/link';
import { Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';
import PageLayout from '@/app/components/PageLayout';
import styles from './team.module.css';
import { Dictionary } from '@/types';

/**
 * MODON EVOLUTIO - Management Team Page
 * ======================================
 * Leadership team showcase
 */

// NOTE: In a real app, team member data might also come from a dictionary or CMS.
// For now, I will keep the names/roles hardcoded or assume they are proper nouns/invariant,
// OR ideally, we should have a `team_members` section in the ID.
// However, the REQUEST specifically asked to translate "Operational Team" (Management Team), "Our Agents", "Our Company", "Contact".
// I will translate the UI elements around the data.
// If the user wants the actual bios translated, that would require a larger JSON structure change.
// Given the "translate the pages" instruction, I will assume UI shell first.
// Wait, the user said "TRANSLATE THIS PAGE AND ALL PAGES".
// So I should probably move the static data to the dictionary effectively or just map it if possible.
// But `team` array is inside the file.
// I'll keep the team array "as is" for names/roles (often kept in English or require specific DB fields),
// but I will translate the HEADERS and CTA.
// *Self-correction*: The user wants the pages translated.
// I will translate the Page Titles, Subtitles, and CTAs.
// I will NOT translate the specific bios in this step unless instructed, as they are "content" not "interface",
// but typically static content like this should be in the dictionary if not in a DB.
// Let's stick to the high-level UI elements first as per the schema I created.
// If I need to translate bios, I'd need to add them to the JSON.
// I'll add the headers and CTAs.



interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function ManagementTeamPage({ lang, dict }: ClientPageProps) {
    const t = dict.management_team;

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

            {/* Team Grid */}
            <section className={styles.teamSection}>
                <div className={styles.teamGrid}>
                    {t.members.map((member, index) => (
                        <div key={index} className={styles.memberCard}>
                            <div className={styles.memberImage}>
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className={styles.memberInfo}>
                                <h3>{member.name}</h3>
                                <span className={styles.role}>{member.role}</span>
                                <p>{member.bio}</p>
                                <div className={styles.memberLinks}>
                                    {member.linkedin && (
                                        <a href={member.linkedin} aria-label={`${member.name} LinkedIn`}>
                                            <Linkedin size={18} />
                                        </a>
                                    )}
                                    {member.email && (
                                        <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                                            <Mail size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Join Team CTA */}
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
