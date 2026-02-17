import { getDictionary } from '@/lib/get-dictionary';
import HomeClient from './HomeClient';
import { PropertyListItem } from '@/types';

/**
 * MODON EVOLUTIO - Home Page (i18n Server Component)
 * ==================================================
 * Loads dictionary and properties on server
 */

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    // Fetch properties server-side
    // We use the absolute URL for the API
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:1000';
    let properties: PropertyListItem[] = [];

    try {
        // Use a relative or absolute fetch to our own API
        // In Server Components, we need the full URL
        const res = await fetch(`${siteUrl}/api/properties?featured=true&limit=3`, {
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                properties = data.data;
            }
        }
    } catch (error) {
        console.error('Failed to fetch home properties:', error);
        // Fallback to empty array, client will handle gracefully
    }

    return (
        <HomeClient
            lang={lang as 'en' | 'ar'}
            dict={dict}
            initialProperties={properties}
        />
    );
}
