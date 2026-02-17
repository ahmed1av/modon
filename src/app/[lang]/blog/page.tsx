import { getDictionary } from '@/lib/get-dictionary';
import BlogClientPage from './ClientPage';
import { MOCK_BLOG_POSTS } from '@/data/mock-universe';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: `Blog | ${lang === 'ar' ? 'مدن إيفولوشيو' : 'MODON Evolutio'}`,
        description: 'Latest news and insights from the luxury real estate market.',
    };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    // Sort by date desc
    const posts = [...MOCK_BLOG_POSTS].sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return <BlogClientPage lang={lang as 'en' | 'ar'} dict={dict} initialPosts={posts} />;
}
