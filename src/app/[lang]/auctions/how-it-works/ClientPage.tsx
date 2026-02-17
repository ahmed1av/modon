'use client';

import Link from 'next/link';
import { Gavel, FileText, Users, Calendar, Award, ArrowRight } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from '../sell/auctions.module.css';
import howStyles from './how.module.css';

/**
 * MODON EVOLUTIO - How Auctions Work Page
 * ========================================
 * Guide to the auction process
 */

const sellerSteps = [
    {
        number: '01',
        icon: FileText,
        title: 'Property Evaluation',
        description: 'Submit your property for review. Our team assesses suitability and provides a comprehensive valuation.',
    },
    {
        number: '02',
        icon: Calendar,
        title: 'Auction Preparation',
        description: 'We create professional marketing materials, legal packs, and set the auction timeline and guide price.',
    },
    {
        number: '03',
        icon: Users,
        title: 'Marketing & Viewings',
        description: 'Targeted marketing to our qualified buyer network with managed viewings and inquiries.',
    },
    {
        number: '04',
        icon: Gavel,
        title: 'Auction Day',
        description: 'Live or online bidding with real-time competition. Fall of the hammer means immediate exchange.',
    },
    {
        number: '05',
        icon: Award,
        title: 'Completion',
        description: 'Legal completion within 28 days. Fast, certain, and at the best market price.',
    },
];

const buyerSteps = [
    {
        number: '01',
        icon: Users,
        title: 'Register & Qualify',
        description: 'Create an account and complete our buyer verification process to participate in auctions.',
    },
    {
        number: '02',
        icon: FileText,
        title: 'Review Legal Packs',
        description: 'Access comprehensive property information. Review with your legal advisor before bidding.',
    },
    {
        number: '03',
        icon: Calendar,
        title: 'Attend Viewings',
        description: 'Book and attend managed property viewings. Ask questions, assess the property firsthand.',
    },
    {
        number: '04',
        icon: Gavel,
        title: 'Place Your Bid',
        description: 'Bid online or in-person. The highest bidder wins. Winning bid forms a binding contract.',
    },
    {
        number: '05',
        icon: Award,
        title: 'Complete Purchase',
        description: 'Pay deposit immediately. Complete within 28 days. Keys to your new property.',
    },
];

import { Dictionary } from '@/types';

interface ClientPageProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
}

export default function AuctionsHowItWorksPage({ lang, dict }: ClientPageProps) {
    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <div className={styles.heroTag}>
                        <Gavel size={18} />
                        <span>MODON Evolutio Auctions</span>
                    </div>
                    <h1 className={styles.heroTitle}>
                        <em>How It Works</em>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        A transparent, efficient process for buying and selling luxury properties
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={howStyles.intro}>
                <div className={howStyles.introContent}>
                    <h2>The MODON Evolutio Auction Experience</h2>
                    <p>
                        Our auction platform combines the excitement of competitive bidding with the
                        discretion and professionalism expected in luxury real estate. Here&apos;s how
                        the process works for both sellers and buyers.
                    </p>
                </div>
            </section>

            {/* Seller Process */}
            <section className={howStyles.processSection}>
                <div className={howStyles.processContainer}>
                    <div className={howStyles.processHeader}>
                        <span className={howStyles.processTag}>For Sellers</span>
                        <h2>Selling Through Auction</h2>
                    </div>
                    <div className={howStyles.stepsGrid}>
                        {sellerSteps.map((step, index) => (
                            <div key={index} className={howStyles.stepCard}>
                                <div className={howStyles.stepNumber}>{step.number}</div>
                                <div className={howStyles.stepIcon}>
                                    <step.icon size={24} />
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className={howStyles.processAction}>
                        <Link href="/auctions/sell" className={howStyles.actionBtn}>
                            Sell Your Property
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Buyer Process */}
            <section className={`${howStyles.processSection} ${howStyles.buyerProcess}`}>
                <div className={howStyles.processContainer}>
                    <div className={howStyles.processHeader}>
                        <span className={howStyles.processTag}>For Buyers</span>
                        <h2>Buying at Auction</h2>
                    </div>
                    <div className={howStyles.stepsGrid}>
                        {buyerSteps.map((step, index) => (
                            <div key={index} className={howStyles.stepCard}>
                                <div className={howStyles.stepNumber}>{step.number}</div>
                                <div className={howStyles.stepIcon}>
                                    <step.icon size={24} />
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className={howStyles.processAction}>
                        <Link href="/auctions/buy" className={howStyles.actionBtn}>
                            Browse Auctions
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Preview */}
            <section className={howStyles.faqSection}>
                <h2>Common Questions</h2>
                <div className={howStyles.faqGrid}>
                    <div className={howStyles.faqItem}>
                        <h3>What happens if I win the auction?</h3>
                        <p>Winning bidders pay a 10% deposit immediately and exchange contracts. Completion occurs within 28 days.</p>
                    </div>
                    <div className={howStyles.faqItem}>
                        <h3>Is there a reserve price?</h3>
                        <p>Yes, sellers set a confidential reserve price. If bidding doesn&apos;t reach this level, the property may not sell.</p>
                    </div>
                    <div className={howStyles.faqItem}>
                        <h3>What fees are involved?</h3>
                        <p>Buyers pay a buyer&apos;s premium of 2-3%. Sellers negotiate commission with our team during property submission.</p>
                    </div>
                    <div className={howStyles.faqItem}>
                        <h3>Can I arrange financing?</h3>
                        <p>Yes, but financing must be arranged before auction day. We recommend mortgage approval in principle.</p>
                    </div>
                </div>
                <div className={howStyles.faqAction}>
                    <Link href="/contact" className={howStyles.contactBtn}>
                        Have More Questions? Contact Us
                    </Link>
                </div>
            </section>
        </PageLayout>
    );
}
