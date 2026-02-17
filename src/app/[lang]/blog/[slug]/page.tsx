import { getDictionary } from '@/lib/get-dictionary';
import BlogPostClient from './ClientPage';
import { MOCK_BLOG_POSTS } from '@/data/mock-universe';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
    const { lang, slug } = await params;
    const post = MOCK_BLOG_POSTS.find(p => p.slug === slug);

    if (!post) return { title: 'Not Found' };

    return {
        title: `${lang === 'ar' ? (post.titleAr || post.title) : post.title} | MODON`,
        description: lang === 'ar' ? (post.excerptAr || post.excerpt) : post.excerpt,
        openGraph: {
            images: [post.image],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang);

    // Find post
    const post = MOCK_BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        return notFound();
    }

    return <BlogPostClient lang={lang as 'en' | 'ar'} dict={dict} post={post} />;
}
