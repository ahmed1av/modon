'use client';

import PageLayout from '@/app/components/PageLayout';
import styles from '../blog.module.css';
import { Dictionary } from '@/types';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { MockBlogPost } from '@/data/mock-universe';

export default function BlogPostClient({ lang, dict, post }: { lang: 'en' | 'ar', dict: Dictionary, post: MockBlogPost }) {
    if (!post) return notFound();

    const isAr = lang === 'ar';
    const title = isAr ? (post.titleAr || post.title) : post.title;
    const content = isAr ? (post.contentAr || post.content) : post.content;

    return (
        <PageLayout lang={lang} dict={dict}>
            <article className={styles.articleContainer}>
                <div className={styles.categoryTagStatic}>
                    {post.category}
                </div>

                <h1 className={styles.articleTitle}>{title}</h1>

                <div className={styles.articleMeta} dir={isAr ? 'rtl' : 'ltr'}>
                    <div className={styles.authorContainer}>
                        <Image
                            src={post.authorAvatar}
                            alt={post.author}
                            width={50}
                            height={50}
                            className={styles.authorAvatar}
                        />
                        <div className={styles.authorInfo}>
                            <span className={styles.authorNameDetail}>{post.author}</span>
                            <span className={styles.authorRole}>{isAr ? 'مؤلف' : 'Author'}</span>
                        </div>
                    </div>

                    <div className={styles.metaGroup}>
                        <Clock size={18} />
                        <span>{post.readTime} {isAr ? 'دقيقة للقراءة' : 'min read'}</span>
                    </div>

                    <div className={styles.metaDate}>
                        {new Date(post.publishedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>

                <div className={styles.heroImageContainer}>
                    <Image
                        src={post.image}
                        alt={title}
                        fill
                        priority
                    />
                </div>

                <div
                    className={styles.articleBody}
                    dangerouslySetInnerHTML={{ __html: content }}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
            </article>
        </PageLayout>
    );
}
