import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import WhatsAppWidget from '../components/WhatsAppWidget';
import '../globals.css';
import '../luxury-hovers.css';

/**
 * MODON EVOLUTIO - Language Layout
 * =================================
 * Nested layout for [lang] dynamic route ensuring:
 * - Google Analytics 4 (GA4) integration
 * - WhatsApp floating widget (Egyptian market)
 * - Multi-language support (EN/AR)
 * - Premium typography (Playfair Display + Montserrat)
 * - RTL/LTR direction support
 * 
 * FIXED: Removed <html> and <body> tags to prevent hydration error.
 * These tags should ONLY exist in the root layout (app/layout.tsx).
 */

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
});

import { getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return {
        title: lang === 'ar'
            ? 'مدن إيفولوشيو | مستشارون عقاريون شخصيون في مصر'
            : 'MODON Evolutio | Personal Property Advisors in Egypt',
        description: lang === 'ar'
            ? 'تقدم مدن إيفولوشيو مستوى رائداً من الخبرة المؤهلة والتجربة السلسة في العقارات الفاخرة المصرية. اكتشف عقارات استثنائية.'
            : 'MODON Evolutio offers a groundbreaking standard of qualified insight and seamless experience in Egyptian luxury real estate. Discover exceptional properties in New Cairo, North Coast, and beyond.',
        keywords: lang === 'ar'
            ? 'عقارات فاخرة مصر, مستشارون عقاريون القاهرة, منازل راقية مصر, عقارات القاهرة الجديدة, فلل الساحل الشمالي, مدن إيفولوشيو'
            : 'luxury real estate Egypt, property advisors Cairo, high-end homes Egypt, New Cairo properties, North Coast villas, MODON Evolutio',
    };
}

export default async function LanguageLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Get Google Analytics ID from environment variables
    const gaId = process.env.NEXT_PUBLIC_GA_ID;

    return (
        <div
            className={`lang-layout-wrapper ${playfair.variable} ${montserrat.variable}`}
            dir={dir}
        >
            {children}

            {/* WhatsApp Floating Widget - Egyptian Market Direct Communication */}
            <WhatsAppWidget />

            {/* Google Analytics 4 - Only loads if GA ID is configured */}
            {gaId && <GoogleAnalytics gaId={gaId} />}
        </div>
    );
}
