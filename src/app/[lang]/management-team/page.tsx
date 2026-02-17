import { getDictionary } from '@/lib/get-dictionary';
import ClientPage from './ClientPage';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: `${dict.management_team.hero_title} | ${lang === 'ar' ? 'مدن إيفولوشيو' : 'MODON Evolutio'}`,
    description: dict.management_team.hero_subtitle,
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <ClientPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
