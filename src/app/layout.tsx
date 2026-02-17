import type { Metadata } from 'next';

/**
 * MODON EVOLUTIO - Root Layout
 * =============================
 * This is the REQUIRED root layout for Next.js App Router.
 * It MUST contain <html> and <body> tags.
 * 
 * Design philosophy: Clean luxury minimalism.
 * Particles/glow removed — luxury real estate = calm confidence,
 * not visual fireworks. All motion is purposeful scroll reveals.
 * 
 * NOTE: All language-specific logic (dir, fonts) is handled
 * in the nested [lang]/layout.tsx to avoid duplication.
 */

export const metadata: Metadata = {
    title: 'MODON Evolutio | Personal Property Advisors in Egypt',
    description: 'MODON Evolutio offers a groundbreaking standard of qualified insight and seamless experience in Egyptian luxury real estate.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
