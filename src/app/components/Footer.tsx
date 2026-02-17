'use client';

import Link from 'next/link';
import styles from './footer.module.css';
import { Dictionary } from '@/types';

/**
 * MODON EVOLUTIO - Footer
 * =======================
 * Premium footer with 3-column link layout
 * I18N UPDATED
 */

interface FooterProps {
    dict?: Dictionary;
    lang?: 'en' | 'ar';
}

export default function Footer({ dict, lang = 'en' }: FooterProps) {
    const t = dict?.footer || {
        columns: {
            buy: 'Buy',
            property_finders: 'Property Finders',
            sell: 'Sell with us',
            off_market: 'Off-Market',
            about: 'About Us',
            contact: 'Contact',
        },
        links: {
            all_types: 'All property types',
            residential: 'Residential',
            commercial: 'Commercial',
            industrial: 'Industrial',
            bespoke: 'Bespoke approach',
            how_it_works: 'How it works',
            private_seller: 'Private Seller (owner)',
            professional_seller: 'Professional seller (agent)',
            developers: 'Luxury Property Developers',
            sell_off: 'Sell',
            buy_off: 'Buy',
            company: 'Our Company',
            team: 'Operational Team',
            agents: 'Our Agents',
            investors: 'Investor Relations',
            get_in_touch: 'Get in touch',
            locations: 'Locations',
        },
        contact_info: {
            phone: 'Phone:',
            address: 'Address:',
        },
        legal: {
            privacy: 'Privacy Policy',
            terms: 'Terms of Use',
            copyright: ' MODON Evolutio. All rights reserved.',
        },
    };

    const footerColumns = {
        buy: {
            title: t.columns.buy,
            links: [
                { label: t.links.all_types, href: `/${lang}/buy` },
                { label: t.links.residential, href: `/${lang}/buy?type=residential` },
                { label: t.links.commercial, href: `/${lang}/buy?type=commercial` },
                { label: t.links.industrial, href: `/${lang}/buy?type=industrial` },
            ],
        },
        propertyFinders: {
            title: t.columns.property_finders,
            links: [
                { label: t.links.bespoke, href: `/${lang}/property-finders` },
                { label: t.links.how_it_works, href: `/${lang}/property-finders#how-it-works` },
            ],
        },
        sellWithUs: {
            title: t.columns.sell,
            links: [
                { label: t.links.private_seller, href: `/${lang}/sell-private` },
                { label: t.links.professional_seller, href: `/${lang}/sell-professional` },
                { label: t.links.developers, href: `/${lang}/sell-developer` },
            ],
        },
        offMarket: {
            title: t.columns.off_market,
            links: [
                { label: t.links.sell_off, href: `/${lang}/off-market-sell` },
                { label: t.links.buy_off, href: `/${lang}/off-market-buy` },
            ],
        },
        aboutUs: {
            title: t.columns.about,
            links: [
                { label: t.links.company, href: `/${lang}/our-company` },
                { label: t.links.team, href: `/${lang}/management-team` },
                { label: t.links.agents, href: `/${lang}/real-estate-agents` },
                { label: t.links.investors, href: `/${lang}/investors` },
            ],
        },
        contact: {
            title: t.columns.contact,
            links: [
                { label: t.links.get_in_touch, href: `/${lang}/contact` },
                { label: t.links.locations, href: `/${lang}/contact#locations` },
            ],
        },
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                    <Link href={`/${lang}`} className={styles.logoLink}>
                        <div className={styles.logoContainer}>
                            <div className={styles.logoIcon}>
                                M
                            </div>
                            <span className={styles.logoText}>
                                MODON <span className={styles.logoTextAccent}>Evolutio</span>
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Links Grid - 3 Columns */}
                <div className={styles.linksGrid}>
                    {/* Column 1 */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{footerColumns.buy.title}</h4>
                        <ul className={styles.linkList}>
                            {footerColumns.buy.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                        <h4 className={styles.columnTitle}>{footerColumns.propertyFinders.title}</h4>
                        <ul className={styles.linkList}>
                            {footerColumns.propertyFinders.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{footerColumns.sellWithUs.title}</h4>
                        <ul className={styles.linkList}>
                            {footerColumns.sellWithUs.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                        <h4 className={styles.columnTitle}>{footerColumns.offMarket.title}</h4>
                        <ul className={styles.linkList}>
                            {footerColumns.offMarket.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{footerColumns.aboutUs.title}</h4>
                        <ul className={styles.linkList}>
                            {footerColumns.aboutUs.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                        <h4 className={styles.columnTitle}>{footerColumns.contact.title}</h4>
                        <ul className={styles.linkList}>
                            {footerColumns.contact.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.link}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottom}>
                    <div className={styles.socialLinks}>
                        <a href="https://www.facebook.com/share/1E4fSUhE9W/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/modonevolutio?igsh=cWtudm11d2Q3cHUx" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/modon-evolutio-9255a33aa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/@modon.evolutio" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                        </a>
                    </div>

                    <div className={styles.contactInfo}>
                        <p className={styles.contactItem}>
                            <strong>{t.contact_info.phone}</strong> <a href="tel:+201070058019" className={styles.phoneLink}>+20 107 005 8019</a>
                        </p>
                        <p className={styles.contactItem}>
                            <strong>{t.contact_info.address}</strong> Waterway 2, New Cairo, {lang === 'ar' ? 'مصر' : 'Egypt'}
                        </p>
                    </div>

                    <div className={styles.legalLinks}>
                        <Link href={`/${lang}/privacy`} className={styles.legalLink}>{t.legal.privacy}</Link>
                        <span className={styles.divider}>|</span>
                        <Link href={`/${lang}/terms`} className={styles.legalLink}>{t.legal.terms}</Link>
                    </div>

                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} {t.legal.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}
