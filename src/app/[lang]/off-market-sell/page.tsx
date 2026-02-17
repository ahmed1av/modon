import { getDictionary } from '@/lib/get-dictionary';
import OffMarketSellPage from './ClientPage';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;

    return {
        title: `Sell Off-Market | ${lang === 'ar' ? 'مدن إيفولوشيو' : 'MODON Evolutio'}`,
        description: 'Discrete, private property sales for ultra-high-net-worth sellers.',
    };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <OffMarketSellPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
