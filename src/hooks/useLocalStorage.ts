/**
 * useLocalStorage Hook
 * ====================
 * Generic localStorage hook with SSR safety and type support
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage after mount (SSR-safe)
    useEffect(() => {
        try {
            const item = localStorage.getItem(key);
            if (item !== null) {
                const timer = setTimeout(() => setStoredValue(JSON.parse(item!)), 0);
                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
        const timerOut = setTimeout(() => setIsHydrated(true), 0);
        return () => clearTimeout(timerOut);
    }, [key]);

    // Persist to localStorage when value changes
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                console.error(`Error writing localStorage key "${key}":`, error);
            }
        }
    }, [key, storedValue, isHydrated]);

    // Setter function
    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        setStoredValue(prev => {
            const nextValue = value instanceof Function ? value(prev) : value;
            return nextValue;
        });
    }, []);

    // Remove from localStorage
    const removeValue = useCallback(() => {
        try {
            localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
