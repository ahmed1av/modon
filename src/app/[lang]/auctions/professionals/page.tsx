import { getDictionary } from '@/lib/get-dictionary';
import AuctionsProfessionalsClientPage from './ClientPage';

export default async function AuctionsProfessionalsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <AuctionsProfessionalsClientPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
