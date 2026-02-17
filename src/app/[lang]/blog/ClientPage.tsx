'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import styles from './blog.module.css';
import { Dictionary } from '@/types';

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    titleAr?: string;
    excerpt: string;
    excerptAr?: string;
    content: string;
    contentAr?: string;
    author: string;
    authorAvatar: string;
    category: string;
    tags: string[];
    image: string;
    publishedAt: string;
    readTime: number;
    featured: boolean;
}

interface BlogClientProps {
    lang: 'en' | 'ar';
    dict: Dictionary;
    initialPosts: BlogPost[];
}

export default function BlogClientPage({ lang, dict, initialPosts }: BlogClientProps) {
    const isAr = lang === 'ar';

    return (
        <PageLayout lang={lang} dict={dict}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1><em>{isAr ? 'أخبار ورؤى' : 'News & Insights'}</em></h1>
                    <p>
                        {isAr
                            ? 'اكتشف أحدث الاتجاهات والتحليلات في سوق العقارات الفاخرة.'
                            : 'Discover the latest trends and analysis in the luxury real estate market.'}
                    </p>
                </div>
            </section>

            {/* Posts Grid */}
            <section className={styles.gridSection}>
                <div className={styles.container}>
                    <div className={styles.postGrid} dir={isAr ? 'rtl' : 'ltr'}>
                        {initialPosts.map((post) => (
                            <Link href={`/${lang}/blog/${post.slug}`} key={post.id} className={styles.postCard}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={post.image}
                                        alt={isAr ? (post.titleAr || post.title) : post.title}
                                        fill

                                    />
                                    <span className={styles.categoryTag}>{post.category}</span>
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.meta}>
                                        <span>{new Date(post.publishedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        <span className={styles.separator}>•</span>
                                        <span>{post.readTime} min read</span>
                                    </div>
                                    <h3 className={styles.title}>
                                        {isAr ? (post.titleAr || post.title) : post.title}
                                    </h3>
                                    <p className={styles.excerpt}>
                                        {isAr ? (post.excerptAr || post.excerpt) : post.excerpt}
                                    </p>
                                    <div className={styles.footer}>
                                        <div className={styles.author}>
                                            <Image
                                                src={post.authorAvatar}
                                                alt={post.author}
                                                width={35}
                                                height={35}
                                                className={styles.authorImg}
                                            />
                                            <span className={styles.authorName}>{post.author}</span>
                                        </div>
                                        <span className={styles.readMore}>
                                            {isAr ? 'اقرأ المزيد' : 'Read Article'} <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
