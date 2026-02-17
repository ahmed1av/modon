import { Metadata } from 'next';
import LoginClient from './LoginClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'ar' ? 'تسجيل الدخول | مدن إيفولوشيو' : 'Sign In | MODON Evolutio',
        description: lang === 'ar' ? 'بوابة إدارة العقارات' : 'Property Management Portal',
    };
}

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <LoginClient lang={lang as 'en' | 'ar'} />;
}
