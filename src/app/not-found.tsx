/**
 * Custom 404 Not Found Page
 * =========================
 * Elegant 404 with MODON Evolutio-style design
 */

import Link from 'next/link';
import Header from './components/navigation/Header';
import Footer from './components/Footer';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <>
            <Header />
            <main className={styles.notFoundContainer}>
                <div className={styles.notFoundContent}>
                    {/* Large 404 Number */}
                    <div className={styles.notFoundNumber}>
                        <span className={styles.digit}>4</span>
                        <span className={styles.digitMiddle}>
                            <svg
                                width="120"
                                height="120"
                                viewBox="0 0 120 120"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="60" cy="60" r="55" stroke="#C9A14A" strokeWidth="2" />
                                <path
                                    d="M45 45L75 75M75 45L45 75"
                                    stroke="#C9A14A"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                        <span className={styles.digit}>4</span>
                    </div>

                    {/* Message */}
                    <h1 className={styles.notFoundTitle}>Page Not Found</h1>
                    <p className={styles.notFoundDescription}>
                        The property you&apos;re looking for may have been sold or the page
                        has moved. Let us help you find what you need.
                    </p>

                    {/* Quick Links */}
                    <div className={styles.notFoundLinks}>
                        <Link href="/" className={styles.btnPrimary}>
                            Return Home
                        </Link>
                        <Link href="/buy" className={styles.btnSecondary}>
                            Browse Properties
                        </Link>
                        <Link href="/contact" className={styles.btnSecondary}>
                            Contact Us
                        </Link>
                    </div>

                    {/* Search Suggestion */}
                    <div className={styles.notFoundSearch}>
                        <p>Or try searching for what you need:</p>
                        <div className={styles.searchBox}>
                            <input
                                type="text"
                                placeholder="Search properties, locations..."
                                aria-label="Search properties"
                            />
                            <button type="button" aria-label="Search">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
                                    <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
