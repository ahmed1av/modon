import { getDictionary } from '@/lib/get-dictionary';
import ClientPage from './ClientPage';

export default async function SellProfessionalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <ClientPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
