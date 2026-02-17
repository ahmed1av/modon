import { getDictionary } from '@/lib/get-dictionary';
import ContactClientPage from './ClientPage';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: `${dict.contact_page.title} | ${lang === 'ar' ? 'مدن إيفولوشيو' : 'MODON Evolutio'}`,
    description: lang === 'ar'
      ? 'تواصل مع فريقنا المتخصص للعثور على منزل أحلامك.'
      : 'Get in touch with our expert team to find your dream home.',
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <ContactClientPage lang={lang as 'en' | 'ar'} dict={dict} />;
}
