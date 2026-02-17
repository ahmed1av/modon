'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Menu, X, ChevronDown, Heart, Building2 } from 'lucide-react';
import styles from './header.module.css';
import LanguageSwitcher from './LanguageSwitcher';
import { Dictionary } from '@/types';

/**
 * MODON EVOLUTIO - Header
 * =======================
 * Premium navigation matching luxury real estate aesthetic
 * I18N UPDATED
 */

interface HeaderProps {
    dict?: Dictionary;
    lang?: 'en' | 'ar';
}

export default function Header({ dict, lang = 'en' }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    // Default dictionary strings if not provided (fallback)
    const t = dict?.nav || {
        buy: 'Buy',
        rent: 'Rent',
        new_developments: 'New Developments',
        property_finders: 'Property Finders',
        sell_menu: 'Sell with us',
        sell_private: 'Private Seller (owner)',
        sell_professional: 'Professional seller (agent)',
        sell_developer: 'Luxury Property Developers',
        off_market: 'Off-Market',
        off_market_sell: 'Sell',
        off_market_buy: 'Buy',
        about: 'About Us',
        about_company: 'Our Company',
        about_team: 'Operational Team',
        about_agents: 'Our Agents',
        contact: 'Contact'
    };

    const mainNavLinks = [
        { label: t.buy, href: `/${lang}/buy` },
        { label: t.rent, href: `/${lang}/rent` },
        { label: t.new_developments, href: `/${lang}/new-developments` },
        { label: t.property_finders, href: `/${lang}/property-finders` },
        {
            label: t.sell_menu,
            href: '#',
            submenu: [
                { label: t.sell_private, href: `/${lang}/sell-private` },
                { label: t.sell_professional, href: `/${lang}/sell-professional` },
                { label: t.sell_developer, href: `/${lang}/sell-developer` }
            ]
        },
        {
            label: t.off_market,
            href: '#',
            submenu: [
                { label: t.off_market_sell, href: `/${lang}/off-market-sell` },
                { label: t.off_market_buy, href: `/${lang}/off-market-buy` }
            ]
        },
        {
            label: t.about,
            href: '#',
            submenu: [
                { label: t.about_company, href: `/${lang}/our-company` },
                { label: t.about_team, href: `/${lang}/management-team` },
                { label: t.about_agents, href: `/${lang}/real-estate-agents` },
                { label: t.contact, href: `/${lang}/contact` }
            ]
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = () => {
            setActiveSubmenu(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            {/* ========== TOP BAR - Social + Logo + Utilities ========== */}
            <div className={styles.topBar}>
                <div className={styles.topContainer}>
                    {/* Social Icons - Left */}
                    <div className={styles.socialIcons}>
                        <a href="https://www.facebook.com/share/1E4fSUhE9W/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <span>f</span>
                        </a>
                        <a href="https://www.instagram.com/modon.evolutio?igsh=cWtudm11d2Q3cHUx" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/modon-evolutio-9255a33aa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/@modon.evolutio" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                        </a>
                    </div>

                    {/* Logo - Center - MODON EVOLUTIO */}
                    <Link href={`/${lang}`} className={styles.logo}>
                        <div className={styles.logoContainer}>
                            <Building2 size={32} strokeWidth={1.5} />
                            <span className={styles.logoText}>
                                MODON EVOLUTIO
                            </span>
                        </div>
                    </Link>

                    {/* Utility Links - Right */}
                    <div className={styles.utilityLinks}>
                        <Link href={`/${lang}/favorites`} className={styles.topLink}>
                            <Heart size={14} />
                        </Link>
                        <Link href={`/${lang}/contact`} className={styles.topLink}>
                            {t.contact}
                        </Link>
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>

            {/* ========== MAIN NAVIGATION ========== */}
            <nav className={styles.mainNav}>
                <div className={styles.navContainer}>
                    <ul className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
                        {mainNavLinks.map((item) => (
                            <li
                                key={item.label}
                                className={`${styles.navItem} ${item.submenu ? styles.hasSubmenu : ''}`}
                                onMouseEnter={() => setActiveSubmenu(item.label)}
                                onMouseLeave={() => setActiveSubmenu(null)}
                            >
                                <Link href={item.href} className={styles.navLink}>
                                    {item.label}
                                    {item.submenu && (
                                        <ChevronDown
                                            size={12}
                                            className={`${styles.chevron} ${activeSubmenu === item.label ? styles.open : ''}`}
                                        />
                                    )}
                                </Link>

                                {item.submenu && activeSubmenu === item.label && (
                                    <div className={styles.submenu}>
                                        {item.submenu.map((sub) => (
                                            <Link key={sub.label} href={sub.href} className={styles.submenuLink}>
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={styles.menuToggle}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>
        </header>
    );
}

