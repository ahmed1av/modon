import { getDictionary } from '@/lib/get-dictionary';
import OffMarketBuyPage from './ClientPage';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;

    return {
        title: `Off-Market Properties | ${lang === 'ar' ? 'مدن إيفولوشيو' : 'MODON Evolutio'}`,
        description: 'Access exclusive off-market properties.',
    };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <OffMarketBuyPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
