'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './global-error.module.css';

/**
 * Global Error Boundary
 * =====================
 * This component catches any unhandled errors in the application.
 * It's a client component as required by Next.js.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Unhandled Global Error:', error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <div className={styles.errorContainer}>
                    <div className={styles.errorContent}>
                        <div className={styles.errorIcon}>
                            <AlertCircle size={80} strokeWidth={1.5} />
                        </div>

                        <h1 className={styles.errorTitle}>
                            Something went wrong
                        </h1>

                        <p className={styles.errorMessage}>
                            We encountered an unexpected error. Our team has been notified
                            and we are working to resolve the issue.
                        </p>

                        {process.env.NODE_ENV === 'development' && (
                            <div className={styles.errorDetails}>
                                <span className={styles.errorDetailsSummary}>Error Details:</span>
                                <pre className={styles.errorDetailsContent}>
                                    {error.message || 'No message provided'}
                                    {error.stack && `\n\n${error.stack}`}
                                </pre>
                            </div>
                        )}

                        <div className={styles.buttonGroup}>
                            <button
                                onClick={() => reset()}
                                className={styles.resetButton}
                            >
                                Try again
                            </button>

                            <a href="/" className={styles.homeButton}>
                                Back to safety
                            </a>
                        </div>

                        <div className={styles.errorFooter}>
                            <p>© {new Date().getFullYear()} MODON Evolutio. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
