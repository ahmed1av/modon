'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, ArrowRight } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from '../off-market-sell/offmarket.module.css';

/**
 * MODON EVOLUTIO - Off-Market Buy Page
 * =================================
 * Private listing access gate for buyers
 */

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function OffMarketBuyPage({ lang, dict }: ClientPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login
    };

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <div className={styles.heroIcon}>
                        <Eye size={32} />
                    </div>
                    <h1 className={styles.heroTitle}>
                        <em>Off-Market Properties</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Exclusive access to properties not available on the open market
                    </p>
                </div>
            </section>

            {/* Login Gate */}
            <section className={styles.mainSection}>
                <div className={styles.loginGate}>
                    <div className={styles.gateIcon}>
                        <Lock size={32} />
                    </div>
                    <h2>Member Access Only</h2>
                    <p>
                        Our off-market portfolio is exclusively available to registered
                        members. Sign in to view properties or request access below.
                    </p>

                    <form onSubmit={handleSubmit} className={styles.gateForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="buy-email">Email Address</label>
                            <input
                                id="buy-email"
                                name="email"
                                type="email"
                                required
                                placeholder="your@email.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="buy-password">Password</label>
                            <input
                                id="buy-password"
                                name="password"
                                type="password"
                                required
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Sign In
                        </button>
                    </form>

                    <div className={styles.gateNote}>
                        <p>Don&apos;t have an account?</p>
                        <Link href="/property-finders">
                            Request Off-Market Access <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
