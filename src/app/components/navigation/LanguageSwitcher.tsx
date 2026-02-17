'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';
import styles from './language-switcher.module.css';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' }, // Arabic
];

const setLanguageCookie = (langCode: string) => {
    document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000; SameSite=Lax`;
};

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Detect current language from URL
    const currentLangCode = pathname.split('/')[1];
    const currentLang = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwitch = (langCode: string) => {
        if (langCode === currentLangCode) {
            setIsOpen(false);
            return;
        }

        // Set cookie for middleware persistence using the helper
        setLanguageCookie(langCode);

        // Replace the language segment in the URL
        const segments = pathname.split('/');
        segments[1] = langCode;
        const newPath = segments.join('/');

        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className={styles.switcher} ref={containerRef} onClick={() => setIsOpen(!isOpen)}>
            <span className={styles.current}>{currentLang.code.toUpperCase()}</span>
            <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />

            {isOpen && (
                <div className={styles.dropdown}>
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            className={`${styles.option} ${lang.code === currentLangCode ? styles.active : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSwitch(lang.code);
                            }}
                        >
                            {lang.label}
                            {lang.code === currentLangCode && <Check size={12} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
