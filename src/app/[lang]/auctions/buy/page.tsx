import { getDictionary } from '@/lib/get-dictionary';
import AuctionsBuyClientPage from './ClientPage';

export default async function AuctionsBuyPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <AuctionsBuyClientPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
