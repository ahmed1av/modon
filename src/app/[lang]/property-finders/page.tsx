import { getDictionary } from '@/lib/get-dictionary';
import PropertyFindersPage from './ClientPage';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;

    return {
        title: `Property Finders | ${lang === 'ar' ? 'مدن إيفولوشيو' : 'MODON Evolutio'}`,
        description: 'Exclusive property finding service for luxury real estate.',
    };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <PropertyFindersPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
