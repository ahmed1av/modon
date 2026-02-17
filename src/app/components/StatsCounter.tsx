'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import styles from './stats-counter.module.css';

/**
 * MODON EVOLUTIO — Animated Statistics Counter v2
 * =================================================
 * Luxury animated counters with real accessibility support.
 * 
 * Improvements over v1:
 * ✅ Respects prefers-reduced-motion (shows final values immediately)
 * ✅ Uses requestAnimationFrame instead of setInterval (smoother, auto-throttled)
 * ✅ Proper cleanup of both observer and animation frame
 * ✅ aria-live region for screen readers
 */

interface Stat {
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    sublabel?: string;
}

interface StatsCounterProps {
    stats: Stat[];
}

export default function StatsCounter({ stats }: StatsCounterProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);
    const rafRef = useRef<number>(0);

    // Check prefers-reduced-motion at JS level
    const prefersReducedMotion = useMemo(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // If reduced motion, show final values immediately
        if (prefersReducedMotion) {
            setCounts(stats.map(stat => stat.value));
            setIsVisible(true);
            hasAnimated.current = true;
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    setIsVisible(true);
                    hasAnimated.current = true;
                    observer.unobserve(el);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [prefersReducedMotion, stats]);

    // Animate using requestAnimationFrame (smoother than setInterval)
    useEffect(() => {
        if (!isVisible || prefersReducedMotion) return;

        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out-quart
            const eased = 1 - Math.pow(1 - progress, 4);

            setCounts(stats.map(stat => Math.round(eased * stat.value)));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setCounts(stats.map(stat => stat.value));
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [isVisible, stats, prefersReducedMotion]);

    return (
        <div ref={ref} className={styles.statsSection} role="region" aria-label="Key Statistics">
            <div className={styles.statsContainer}>
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`${styles.statItem} ${isVisible ? styles.visible : ''}`}
                        style={prefersReducedMotion ? undefined : { transitionDelay: `${index * 150}ms` }}
                    >
                        <div className={styles.statNumber} aria-live="polite">
                            <span className={styles.statPrefix}>{stat.prefix || ''}</span>
                            <span className={styles.statValue}>{counts[index].toLocaleString()}</span>
                            <span className={styles.statSuffix}>{stat.suffix || ''}</span>
                        </div>
                        <div className={styles.statDivider} />
                        <div className={styles.statLabel}>{stat.label}</div>
                        {stat.sublabel && (
                            <div className={styles.statSublabel}>{stat.sublabel}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
