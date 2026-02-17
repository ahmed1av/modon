/**
 * Global Loading State
 * ====================
 * Elegant loading spinner for MODON Evolutio
 */

import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingContent}>
                {/* Animated Logo/Spinner */}
                <div className={styles.spinner}>
                    <div className={`${styles.spinnerRing} ${styles.outer}`}></div>
                    <div className={`${styles.spinnerRing} ${styles.middle}`}></div>
                    <div className={`${styles.spinnerRing} ${styles.inner}`}></div>
                    <div className={styles.spinnerLogo}>
                        <span>M</span>
                    </div>
                </div>

                {/* Loading Text */}
                <p className={styles.loadingText}>
                    <span>L</span>
                    <span>o</span>
                    <span>a</span>
                    <span>d</span>
                    <span>i</span>
                    <span>n</span>
                    <span>g</span>
                    <span className={styles.dots}>...</span>
                </p>
            </div>
        </div>
    );
}
