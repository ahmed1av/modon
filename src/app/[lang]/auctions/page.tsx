import { getDictionary } from '@/lib/get-dictionary';
import AuctionsClientPage from './ClientPage';

export const metadata = {
    title: 'Property Auctions | MODON Evolutio',
    description: 'Discover exclusive property auctions. Buy or sell luxury real estate through our curated auction platform.',
};

export default async function AuctionsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <AuctionsClientPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
