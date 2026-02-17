'use client';

/**
 * Global Error Boundary
 * =====================
 * Elegant error handling with MODON Evolutio-style design
 */

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './error.module.css';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log error to monitoring service in production
        console.error('[ERROR BOUNDARY]', error);
    }, [error]);

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                {/* Elegant Error Icon */}
                <div className={styles.errorIcon}>
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="40" cy="40" r="38" stroke="#C9A14A" strokeWidth="2" />
                        <path
                            d="M40 25V45"
                            stroke="#C9A14A"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <circle cx="40" cy="55" r="3" fill="#C9A14A" />
                    </svg>
                </div>

                {/* Error Message */}
                <h1 className={styles.errorTitle}>Something Went Wrong</h1>
                <p className={styles.errorDescription}>
                    We apologize for the inconvenience. Our team has been notified
                    and is working to resolve this issue.
                </p>

                {/* Error Details (dev only) */}
                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className={styles.errorDetails}>
                        <code>{error.message}</code>
                    </div>
                )}

                {/* Action Buttons */}
                <div className={styles.errorActions}>
                    <button onClick={reset} className={styles.btnPrimary}>
                        Try Again
                    </button>
                    <Link href="/" className={styles.btnSecondary}>
                        Return Home
                    </Link>
                </div>

                {/* Support Contact */}
                <p className={styles.errorSupport}>
                    Need immediate assistance?{' '}
                    <Link href="/contact">Contact our team</Link>
                </p>
            </div>
        </div>
    );
}
