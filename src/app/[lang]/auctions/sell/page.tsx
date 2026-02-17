import { getDictionary } from '@/lib/get-dictionary';
import AuctionsSellClientPage from './ClientPage';

export default async function AuctionsSellPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <AuctionsSellClientPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
