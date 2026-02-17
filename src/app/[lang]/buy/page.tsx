import { getDictionary } from '@/lib/get-dictionary';
import BuyClient from './BuyClient';

/**
 * MODON EVOLUTIO - Buy Page (i18n Server Component)
 * =================================================
 * Server wrapper for property listings with locale support
 */

export default async function BuyPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <BuyClient lang={lang as 'en' | 'ar'} dict={dict} />;
}
