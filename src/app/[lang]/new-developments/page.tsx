import { getDictionary } from '@/lib/get-dictionary';
import NewDevelopmentsClientPage from './ClientPage';

export default async function NewDevelopmentsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <NewDevelopmentsClientPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
