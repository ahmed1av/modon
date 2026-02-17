import { getDictionary } from '@/lib/get-dictionary';
import BuyClient from '../buy/BuyClient';

/**
 * MODON EVOLUTIO - Rent Page (i18n Server Component)
 * =================================================
 * Server wrapper for rental listings with locale support.
 * Reuses the BuyClient logic but forces listingType='rent'.
 */

export default async function RentPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <BuyClient lang={lang as 'en' | 'ar'} dict={dict} listingType="rent" />;
}
