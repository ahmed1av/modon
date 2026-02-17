import { getDictionary } from '@/lib/get-dictionary';
import HowItWorksClientPage from './ClientPage';

export default async function HowItWorksPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <HowItWorksClientPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
