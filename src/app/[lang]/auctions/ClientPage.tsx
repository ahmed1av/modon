'use client';

import { Dictionary } from '@/types';
import styles from './auctions.module.css';
import Link from 'next/link';
import { Gavel, TrendingUp, Shield, Clock, ArrowRight } from 'lucide-react';

interface AuctionsClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function AuctionsClientPage({ lang }: AuctionsClientPageProps) {
    const isRtl = lang === 'ar';

    const content = {
        en: {
            heroTitle: 'Property Auctions',
            heroSubtitle: 'Discover exclusive real estate opportunities through our curated auction platform',
            howItWorks: 'How It Works',
            steps: [
                {
                    icon: 'search',
                    title: 'Browse Listings',
                    description: 'Explore our curated selection of auction properties with detailed information and virtual tours.',
                },
                {
                    icon: 'register',
                    title: 'Register to Bid',
                    description: 'Create your account and complete verification to participate in upcoming auctions.',
                },
                {
                    icon: 'bid',
                    title: 'Place Your Bid',
                    description: 'Bid in real-time with transparent pricing. Our system ensures fair and secure transactions.',
                },
                {
                    icon: 'win',
                    title: 'Win & Close',
                    description: 'The highest bidder wins. Our team guides you through the closing process seamlessly.',
                },
            ],
            featuresTitle: 'Why Auction with MODON',
            features: [
                {
                    title: 'Transparent Pricing',
                    description: 'Real-time bidding with full price transparency. No hidden fees or surprises.',
                },
                {
                    title: 'Verified Properties',
                    description: 'Every auction property is thoroughly inspected and legally verified.',
                },
                {
                    title: 'Secure Process',
                    description: 'Bank-level security for all transactions with escrow protection.',
                },
                {
                    title: 'Expert Guidance',
                    description: 'Our specialists guide you through every step of the auction process.',
                },
            ],
            ctaSell: 'Sell at Auction',
            ctaBuy: 'View Upcoming Auctions',
            ctaDescription: 'Ready to get started? Choose your path below.',
            upcomingTitle: 'Upcoming Auctions',
            noAuctions: 'No auctions currently scheduled. Check back soon for new listings.',
        },
        ar: {
            heroTitle: 'مزادات العقارات',
            heroSubtitle: 'اكتشف فرص عقارية حصرية من خلال منصة المزادات المُنسقة لدينا',
            howItWorks: 'كيف يعمل',
            steps: [
                {
                    icon: 'search',
                    title: 'تصفح القوائم',
                    description: 'استكشف مجموعتنا المنسقة من عقارات المزاد مع معلومات مفصلة وجولات افتراضية.',
                },
                {
                    icon: 'register',
                    title: 'سجل للمزايدة',
                    description: 'أنشئ حسابك وأكمل التحقق للمشاركة في المزادات القادمة.',
                },
                {
                    icon: 'bid',
                    title: 'قدم عرضك',
                    description: 'قم بالمزايدة في الوقت الفعلي مع تسعير شفاف. يضمن نظامنا معاملات عادلة وآمنة.',
                },
                {
                    icon: 'win',
                    title: 'اربح وأغلق',
                    description: 'يفوز أعلى مزايد. فريقنا يرشدك خلال عملية الإغلاق بسلاسة.',
                },
            ],
            featuresTitle: 'لماذا المزاد مع مُدن',
            features: [
                {
                    title: 'تسعير شفاف',
                    description: 'مزايدة في الوقت الفعلي مع شفافية كاملة في الأسعار. لا رسوم خفية أو مفاجآت.',
                },
                {
                    title: 'عقارات موثقة',
                    description: 'كل عقار مزاد يتم فحصه بدقة والتحقق منه قانونياً.',
                },
                {
                    title: 'عملية آمنة',
                    description: 'أمان بمستوى البنوك لجميع المعاملات مع حماية الضمان.',
                },
                {
                    title: 'إرشاد خبير',
                    description: 'يرشدك متخصصونا في كل خطوة من عملية المزاد.',
                },
            ],
            ctaSell: 'بيع في المزاد',
            ctaBuy: 'عرض المزادات القادمة',
            ctaDescription: 'مستعد للبدء؟ اختر مسارك أدناه.',
            upcomingTitle: 'المزادات القادمة',
            noAuctions: 'لا توجد مزادات مجدولة حالياً. تحقق مرة أخرى قريباً لقوائم جديدة.',
        },
    };

    const t = content[lang];

    return (
        <main className={styles.auctionsPage} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <Gavel className={styles.heroIcon} size={48} />
                    <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
                    <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t.howItWorks}</h2>
                <div className={styles.stepsGrid}>
                    {t.steps.map((step, index) => (
                        <div key={index} className={styles.stepCard}>
                            <div className={styles.stepNumber}>{index + 1}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDescription}>{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className={`${styles.section} ${styles.featuresSection}`}>
                <h2 className={styles.sectionTitle}>{t.featuresTitle}</h2>
                <div className={styles.featuresGrid}>
                    {t.features.map((feature, index) => {
                        const icons = [TrendingUp, Shield, Clock, ArrowRight];
                        const Icon = icons[index % icons.length];
                        return (
                            <div key={index} className={styles.featureCard}>
                                <Icon className={styles.featureIcon} size={32} />
                                <h3 className={styles.featureTitle}>{feature.title}</h3>
                                <p className={styles.featureDescription}>{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Upcoming Auctions Placeholder */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t.upcomingTitle}</h2>
                <div className={styles.emptyState}>
                    <Clock size={48} />
                    <p>{t.noAuctions}</p>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`${styles.section} ${styles.ctaSection}`}>
                <p className={styles.ctaDescription}>{t.ctaDescription}</p>
                <div className={styles.ctaButtons}>
                    <Link href={`/${lang}/auctions/buy`} className={styles.ctaPrimary}>
                        {t.ctaBuy}
                    </Link>
                    <Link href={`/${lang}/auctions/sell`} className={styles.ctaSecondary}>
                        {t.ctaSell}
                    </Link>
                </div>
            </section>
        </main>
    );
}
