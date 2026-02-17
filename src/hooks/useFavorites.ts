/**
 * useFavorites Hook (HARDENED)
 * ===========================
 * Hardened favorites management with:
 * ✅ Supabase Backend Integration (when authenticated)
 * ✅ LocalStorage Fallback (for guests)
 * ✅ Automatic Sync (Sync guest favorites to DB on login)
 * ✅ Optimistic UI Updates
 * ✅ Duplicate Prevention
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'modon_favorites';

export interface UseFavoritesReturn {
    favorites: string[];
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => Promise<void>;
    addFavorite: (id: string) => Promise<void>;
    removeFavorite: (id: string) => Promise<void>;
    clearFavorites: () => void;
    favoritesCount: number;
    isLoading: boolean;
    isAuthenticated: boolean;
}

/**
 * Hook for managing favorite properties with backend sync and localStorage persistence
 */
export function useFavorites(): UseFavoritesReturn {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const hasSynced = useRef(false);

    // 1. Initial hydration from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setFavorites(parsed);
                }
            }
        } catch (error) {
            console.error('Failed to load favorites from localStorage:', error);
        }
        setIsHydrated(true);
    }, []);

    // 2. Check Auth and Fetch from Backend
    const syncWithBackend = useCallback(async () => {
        try {
            // Check if authenticated via /api/auth/me
            const authRes = await fetch('/api/auth/me');
            if (authRes.ok) {
                setIsAuthenticated(true);

                // Fetch backend favorites
                const favRes = await fetch('/api/favorites');
                if (favRes.ok) {
                    const result = await favRes.json();
                    if (result.success && Array.isArray(result.data)) {
                        const backendFavs = result.data;

                        // Sync: If we have local favorites, merge them to backend
                        const localFavs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                        if (localFavs.length > 0 && !hasSynced.current) {
                            hasSynced.current = true;
                            for (const id of localFavs) {
                                if (!backendFavs.includes(id)) {
                                    await fetch('/api/favorites', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ propertyId: id })
                                    });
                                    backendFavs.push(id);
                                }
                            }
                            // Clear local after sync
                            localStorage.removeItem(STORAGE_KEY);
                        }

                        setFavorites(backendFavs);
                    }
                }
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Favorites sync error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isHydrated) {
            syncWithBackend();
        }
    }, [isHydrated, syncWithBackend]);

    // 3. Persistence to localStorage (only for guests)
    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        }
    }, [favorites, isHydrated, isAuthenticated]);

    const isFavorite = useCallback((id: string): boolean => {
        return favorites.includes(id);
    }, [favorites]);

    const addFavorite = useCallback(async (id: string) => {
        // Optimistic Update
        setFavorites(prev => prev.includes(id) ? prev : [...prev, id]);

        if (isAuthenticated) {
            try {
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ propertyId: id })
                });
                if (!res.ok) throw new Error('Failed to save favorite');
            } catch (error) {
                console.error('Error adding favorite:', error);
                // Rollback on error
                setFavorites(prev => prev.filter(fid => fid !== id));
            }
        }
    }, [isAuthenticated]);

    const removeFavorite = useCallback(async (id: string) => {
        // Optimistic Update
        setFavorites(prev => prev.filter(fid => fid !== id));

        if (isAuthenticated) {
            try {
                const res = await fetch(`/api/favorites?propertyId=${id}`, {
                    method: 'DELETE'
                });
                if (!res.ok) throw new Error('Failed to remove favorite');
            } catch (error) {
                console.error('Error removing favorite:', error);
                // Rollback on error
                setFavorites(prev => [...prev, id]);
            }
        }
    }, [isAuthenticated]);

    const toggleFavorite = useCallback(async (id: string) => {
        if (isFavorite(id)) {
            await removeFavorite(id);
        } else {
            await addFavorite(id);
        }
    }, [isFavorite, addFavorite, removeFavorite]);

    const clearFavorites = useCallback(() => {
        setFavorites([]);
        if (!isAuthenticated) {
            localStorage.removeItem(STORAGE_KEY);
        }
        // Backend clear not implemented to avoid accidental data loss, 
        // but could be added optionally.
    }, [isAuthenticated]);

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
        isLoading,
        isAuthenticated
    };
}

/**
 * Hook for a single property's favorite state
 * Optimized for individual PropertyCard use
 */
export function usePropertyFavorite(propertyId: string): {
    isFavorite: boolean;
    toggleFavorite: () => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
} {
    const { isFavorite: checkFav, toggleFavorite: masterToggle, isLoading, isAuthenticated } = useFavorites();
    const isFav = checkFav(propertyId);

    const toggleFavorite = async () => {
        await masterToggle(propertyId);
        // Dispatch event for other instances
        window.dispatchEvent(new CustomEvent('favorites-updated'));
    };

    return { isFavorite: isFav, toggleFavorite, isLoading, isAuthenticated };
}

export default useFavorites;
