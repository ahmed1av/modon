/**
 * Property Not Found Page
 * =======================
 * Styled 404 page for missing properties
 */

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Header from '@/app/components/navigation/Header';
import Footer from '@/app/components/Footer';
import styles from './property.module.css';

export default function PropertyNotFound() {
    return (
        <>
            <Header />

            <main className={styles.main}>
                <div className={styles.notFoundContainer}>
                    <div className={styles.notFoundContent}>
                        <h1 className={styles.notFoundTitle}>Property Not Found</h1>
                        <p className={styles.notFoundText}>
                            The property you&apos;re looking for may have been sold, removed, or the link might be incorrect.
                        </p>

                        <div className={styles.notFoundActions}>
                            <Link href="/buy" className={styles.notFoundButton}>
                                <Search size={18} />
                                Browse Properties
                            </Link>
                            <Link href="/" className={styles.notFoundButtonSecondary}>
                                <Home size={18} />
                                Go Home
                            </Link>
                        </div>

                        <div className={styles.notFoundTip}>
                            <strong>Looking for something specific?</strong>
                            <p>
                                Contact our team at{' '}
                                <a href="mailto:info@modon.com">info@modon.com</a>{' '}
                                or call <a href="tel:+201001234567">+20 100 123 4567</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
