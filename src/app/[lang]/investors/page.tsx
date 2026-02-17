import { getDictionary } from '@/lib/get-dictionary';
import Header from '@/app/components/navigation/Header';
import Footer from '@/app/components/Footer';
import styles from './investors.module.css';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'ar' ? 'منصة المستثمرين | مدن إيفولوشيو' : 'Investor Relations | MODON Evolutio',
        description: lang === 'ar'
            ? 'رؤية مدن إيفولوشيو لإعادة تعريف سوق العقارات الفاخرة في مصر والشرق الأوسط.'
            : 'The vision of MODON Evolutio to redefine the luxury real estate market in Egypt and the Middle East.',
    };
}

export default async function InvestorsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const currentLang = lang as 'ar' | 'en';
    const dict = await getDictionary(currentLang);
    const inv = dict.investors;

    return (
        <div className={styles.investorContainer}>
            <Header lang={currentLang} dict={dict} />

            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>{inv.hero_title}</h1>
                    <p>{inv.hero_subtitle}</p>
                    <Link href={`/${lang}/contact`} className={styles.cta_button}>
                        {inv.cta}
                    </Link>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3>{inv.problem_title}</h3>
                        <p>{inv.problem_text}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>{inv.solution_title}</h3>
                        <p>{inv.solution_text}</p>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.marketSection}`}>
                <h2>{inv.market_title}</h2>
                <p className={styles.sectionSubtitle}>
                    {inv.market_cap}
                </p>
                <div className={styles.statGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>$15B+</span>
                        <span className={styles.statLabel}>{lang === 'ar' ? 'حجم السوق المستهدف' : 'Addressable Market'}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>15%</span>
                        <span className={styles.statLabel}>{lang === 'ar' ? 'نمو سنوي متوقع' : 'Expected CAGR'}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>500+</span>
                        <span className={styles.statLabel}>{lang === 'ar' ? 'وحدة فاخرة حصرية' : 'Exclusive Ultra-Luxury Units'}</span>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.centeredHeader}>
                    <h2 className={styles.titleLarge}>{inv.business_model_title}</h2>
                </div>
                <div className={styles.grid}>
                    {inv.revenue_streams.map((stream: string, i: number) => (
                        <div key={i} className={styles.card}>
                            <div className={styles.nodeIcon}>{i + 1}</div>
                            <p>{stream}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={`${styles.section} ${styles.architecture}`}>
                <div className={styles.centeredHeader}>
                    <h2 className={styles.titleLarge}>{inv.tech_title}</h2>
                </div>
                <div className={styles.archDiagram}>
                    <div className={styles.connector} />
                    <div className={styles.node}>
                        <div className={styles.nodeIcon}>AI</div>
                        <h3>{lang === 'ar' ? 'محرك الربط الذكي' : 'Matching Engine'}</h3>
                        <p className={styles.nodeDescription}>Vector-based recommendations</p>
                    </div>
                    <div className={styles.node}>
                        <div className={styles.nodeIcon}>RT</div>
                        <h3>{lang === 'ar' ? 'بيانات لحظية' : 'Real-time Sync'}</h3>
                        <p className={styles.nodeDescription}>Supabase Edge Infrastructure</p>
                    </div>
                    <div className={styles.node}>
                        <div className={styles.nodeIcon}>UX</div>
                        <h3>{lang === 'ar' ? 'واجهة متميزة' : 'Luxury UX'}</h3>
                        <p className={styles.nodeDescription}>High-fidelity client portal</p>
                    </div>
                </div>
                <div className={`${styles.grid} ${styles.centeredHeader} ${styles.techStackGrid}`}>
                    {inv.tech_stack.map((tech: string, i: number) => (
                        <div key={i} className={styles.benefit}>
                            <p className={styles.benefitText}>✦ {tech}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={`${styles.section} ${styles.marketSection} ${styles.finalCTASection}`}>
                <div className={styles.demoContent}>
                    <h2 className={styles.titleExtraLarge}>{inv.demo_title}</h2>
                    <p className={styles.demoText}>
                        {lang === 'ar'
                            ? 'لقد قمنا بالفعل ببناء المحرك الأساسي ولوحة التحكم في العقارات. جرب النظام من الداخل.'
                            : 'We have already built the core engine and property management dashboard. Experience the live system.'}
                    </p>
                    <div className={styles.buttonGroup}>
                        <Link href={`/${lang}/admin`} className={styles.cta_button}>
                            {lang === 'ar' ? 'إطلاق العرض العملي' : 'Launch Live Prototype'}
                        </Link>
                        <Link href={`/${lang}/contact`} className={styles.secondaryButton}>
                            {inv.contact_sales}
                        </Link>
                    </div>
                </div>
            </section>

            <Footer lang={currentLang} dict={dict} />
        </div>
    );
}
