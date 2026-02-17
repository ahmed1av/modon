import { MetadataRoute } from 'next';

/**
 * ROBOTS.TXT CONFIGURATION
 * =========================
 * Directs search engine crawlers to sitemap
 * and defines crawling rules
 * 
 * SEO Benefits:
 * - Allows all major search engines
 * - Points to dynamic sitemap
 * - Full site crawling enabled
 */

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modonevolutio.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Disallow admin and API routes from search results
                disallow: [
                    '/admin',
                    '/admin/*',
                    '/api/*',
                ],
            },
            {
                // Google-specific rules
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
            {
                // Bing-specific rules
                userAgent: 'Bingbot',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
