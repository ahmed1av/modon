'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home } from 'lucide-react';
import { SearchService } from '@/discover/services/SearchService';
import { SearchSuggestion } from '@/types';
import styles from './hero.module.css';

/**
 * MODON EVOLUTIO - Hero Section (INTELLIGENT SEARCH)
 * ===================================================
 * - Real Vimeo video background
 * - LIVE search that queries /api/properties
 * - Search redirects to /buy?q=... with results
 */

interface HeroProps {
    dict?: any;
}

export default function Hero({ dict }: HeroProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Default fallbacks if dict is missing
    const t = {
        title1: dict?.title_line1 || 'PERSONAL PROPERTY ADVISORS',
        title2: dict?.title_line2 || 'FOR LUXURY HOMES',
        placeholder: dict?.search_placeholder || 'WHERE WOULD YOU RATHER LIVE?',
        button: dict?.search_button || 'Search'
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Fetch suggestions from API
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length > 1) {
                setIsSearching(true);
                const results = await SearchService.suggest(query);
                setSuggestions(results);
                setShowSuggestions(true);
                setIsSearching(false);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle search submission - redirect to /buy with query
    const handleSearch = useCallback(() => {
        if (query.trim()) {
            router.push(`/buy?q=${encodeURIComponent(query.trim())}`);
        } else {
            router.push('/buy');
        }
    }, [query, router]);

    // Handle Enter key press
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setShowSuggestions(false);
            handleSearch();
        }
    }, [handleSearch]);

    // Handle suggestion click
    const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
        if (suggestion.type === 'location') {
            // For location, search by that location
            router.push(`/buy?q=${encodeURIComponent(suggestion.text)}`);
        } else {
            // For property, go directly to that property or search
            router.push(`/buy?q=${encodeURIComponent(suggestion.text)}`);
        }
        setShowSuggestions(false);
    }, [router]);

    return (
        <section className={styles.hero}>
            {/* Background Video - Vimeo source */}
            <iframe
                src="https://player.vimeo.com/video/372567526?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&quality=1080p"
                className={styles.video}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                title="MODON Evolutio Luxury Real Estate Background"
            ></iframe>

            {/* Gradient Overlay */}
            <div className={styles.overlay} />

            {/* Hero Content */}
            <div className={styles.content}>
                {/* Main Headline */}
                <div className={`${styles.headline} ${isLoaded ? styles.visible : ''}`}>
                    <h1 className={styles.title}>
                        {t.title1}
                        <br />
                        <span className={styles.titleAccent}>{t.title2}</span>
                    </h1>
                </div>

                {/* Search Bar - LIVE SEARCH */}
                <div
                    ref={searchRef}
                    className={`${styles.searchWrapper} ${isLoaded ? styles.visible : ''}`}
                >
                    <form
                        className={styles.searchBar}
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}
                    >
                        <div className={styles.searchInputWrapper}>
                            <Search className={styles.searchIcon} size={18} />
                            <input
                                type="text"
                                placeholder={t.placeholder}
                                className={styles.searchInput}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => query.length > 1 && setShowSuggestions(true)}
                                aria-label="Search for properties"
                            />
                            {isSearching && (
                                <div className={styles.searchSpinner} />
                            )}
                        </div>
                        <button
                            type="submit"
                            className={styles.searchButton}
                            aria-label="Search"
                        >
                            {t.button}
                        </button>
                    </form>

                    {/* Search Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className={styles.suggestionsDropdown}>
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.id}
                                    className={styles.suggestionItem}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    type="button"
                                >
                                    <div className={styles.suggestionIcon}>
                                        {suggestion.type === 'location' ? (
                                            <MapPin size={16} />
                                        ) : (
                                            <Home size={16} />
                                        )}
                                    </div>
                                    <div className={styles.suggestionContent}>
                                        <span className={styles.suggestionType}>
                                            {suggestion.type === 'location' ? 'Location' : 'Property'}
                                        </span>
                                        <span className={styles.suggestionText}>{suggestion.text}</span>
                                        {suggestion.subtext && (
                                            <span className={styles.suggestionSubtext}>{suggestion.subtext}</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className={styles.scrollIndicator}>
                <div className={styles.scrollMouse}>
                    <div className={styles.scrollWheel} />
                </div>
            </div>
        </section>
    );
}
