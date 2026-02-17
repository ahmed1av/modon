import Header from '@/app/components/navigation/Header';
import Footer from '@/app/components/Footer';
import { Dictionary } from '@/types';

/**
 * MODON EVOLUTIO - Shared Page Layout
 * ====================================
 * Wraps all pages with persistent Header/Footer
 * I18N UPDATED
 */

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
    lang?: 'en' | 'ar';
    dict?: Dictionary;
}

export default function PageLayout({ children, className = '', lang = 'en', dict }: PageLayoutProps) {
    return (
        <>
            <Header lang={lang} dict={dict} />
            <main className={className}>
                {children}
            </main>
            <Footer lang={lang} dict={dict} />
        </>
    );
}
