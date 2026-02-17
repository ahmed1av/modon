/**
 * MODON Platform - Currency Utilities
 * ====================================
 * Multi-currency support for the platform
 */

// ============================================
// TYPES
// ============================================

export type SupportedCurrency = 'EGP' | 'EUR' | 'USD' | 'GBP' | 'AED' | 'SAR';

export interface CurrencyConfig {
    code: SupportedCurrency;
    name: string;
    symbol: string;
    symbolPosition: 'before' | 'after';
    decimals: number;
    thousandsSeparator: string;
    decimalSeparator: string;
    flag: string;
}

// ============================================
// CURRENCY CONFIGURATIONS
// ============================================

export const currencies: Record<SupportedCurrency, CurrencyConfig> = {
    EGP: {
        code: 'EGP',
        name: 'Egyptian Pound',
        symbol: 'EGP',
        symbolPosition: 'before',
        decimals: 0,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        flag: '🇪🇬',
    },
    EUR: {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        symbolPosition: 'before',
        decimals: 2,
        thousandsSeparator: '.',
        decimalSeparator: ',',
        flag: '🇪🇺',
    },
    USD: {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        symbolPosition: 'before',
        decimals: 2,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        flag: '🇺🇸',
    },
    GBP: {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        symbolPosition: 'before',
        decimals: 2,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        flag: '🇬🇧',
    },
    AED: {
        code: 'AED',
        name: 'UAE Dirham',
        symbol: 'AED',
        symbolPosition: 'before',
        decimals: 2,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        flag: '🇦🇪',
    },
    SAR: {
        code: 'SAR',
        name: 'Saudi Riyal',
        symbol: 'SAR',
        symbolPosition: 'before',
        decimals: 2,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        flag: '🇸🇦',
    },
};

export const defaultCurrency: SupportedCurrency = 'EGP';

// ============================================
// EXCHANGE RATES
// (In production, fetch from an API)
// ============================================

// Base: EGP (Egyptian Pound)
const exchangeRates: Record<SupportedCurrency, number> = {
    EGP: 1.0,
    EUR: 0.019,  // 1 EGP ≈ 0.019 EUR
    USD: 0.020,  // 1 EGP ≈ 0.02 USD
    GBP: 0.016,
    AED: 0.074,
    SAR: 0.076,
};

/**
 * Get exchange rate from one currency to another
 */
export function getExchangeRate(
    from: SupportedCurrency,
    to: SupportedCurrency
): number {
    if (from === to) return 1;

    // Convert to EUR first, then to target
    const fromRate = exchangeRates[from];
    const toRate = exchangeRates[to];

    return toRate / fromRate;
}

/**
 * Convert amount between currencies
 */
export function convertCurrency(
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency
): number {
    const rate = getExchangeRate(from, to);
    return amount * rate;
}

// ============================================
// FORMATTING
// ============================================

interface FormatOptions {
    showSymbol?: boolean;
    showCode?: boolean;
    compact?: boolean;
    decimals?: number;
}

/**
 * Format a number as currency
 */
export function formatCurrency(
    amount: number,
    currency: SupportedCurrency = defaultCurrency,
    options: FormatOptions = {}
): string {
    const config = currencies[currency];
    const {
        showSymbol = true,
        showCode = false,
        compact = false,
        decimals = config.decimals,
    } = options;

    let formattedAmount: string;

    if (compact) {
        formattedAmount = formatCompact(amount);
    } else {
        formattedAmount = formatWithSeparators(
            amount,
            decimals,
            config.thousandsSeparator,
            config.decimalSeparator
        );
    }

    let result = formattedAmount;

    if (showSymbol) {
        if (config.symbolPosition === 'before') {
            result = `${config.symbol}${result}`;
        } else {
            result = `${result} ${config.symbol}`;
        }
    }

    if (showCode && !showSymbol) {
        result = `${result} ${config.code}`;
    }

    return result;
}

/**
 * Format number with thousands separators
 */
function formatWithSeparators(
    amount: number,
    decimals: number,
    thousandsSeparator: string,
    decimalSeparator: string
): string {
    const fixed = amount.toFixed(decimals);
    const [integer, decimal] = fixed.split('.');

    const formattedInteger = integer.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        thousandsSeparator
    );

    if (decimals === 0) {
        return formattedInteger;
    }

    return `${formattedInteger}${decimalSeparator}${decimal}`;
}

/**
 * Format as compact number (e.g., 1.5M)
 */
function formatCompact(amount: number): string {
    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
        return `${(amount / 1_000).toFixed(0)}K`;
    }
    return amount.toString();
}

/**
 * Format price for property display
 */
export function formatPropertyPrice(
    amount: number,
    currency: SupportedCurrency = defaultCurrency
): string {
    // For properties, use compact format for millions
    if (amount >= 1_000_000) {
        return formatCurrency(amount, currency, { compact: true });
    }

    // For smaller amounts, show full price without decimals
    return formatCurrency(amount, currency, { decimals: 0 });
}

/**
 * Format price with range
 */
export function formatPriceRange(
    min: number,
    max: number,
    currency: SupportedCurrency = defaultCurrency
): string {
    const formattedMin = formatPropertyPrice(min, currency);
    const formattedMax = formatPropertyPrice(max, currency);

    return `${formattedMin} - ${formattedMax}`;
}

/**
 * Format price per square meter
 */
export function formatPricePerMeter(
    pricePerMeter: number,
    currency: SupportedCurrency = defaultCurrency
): string {
    const formatted = formatCurrency(pricePerMeter, currency, { decimals: 0 });
    return `${formatted}/m²`;
}

// ============================================
// UTILITIES
// ============================================

/**
 * Get currency configuration
 */
export function getCurrencyConfig(currency: SupportedCurrency): CurrencyConfig {
    return currencies[currency] || currencies.EUR;
}

/**
 * Get all supported currencies
 */
export function getSupportedCurrencies(): CurrencyConfig[] {
    return Object.values(currencies);
}

/**
 * Validate currency code
 */
export function isValidCurrency(code: string): code is SupportedCurrency {
    return code in currencies;
}

/**
 * Parse currency from string
 */
export function parseCurrency(code: string | null | undefined): SupportedCurrency {
    if (!code) return defaultCurrency;

    const normalized = code.toUpperCase();
    return isValidCurrency(normalized) ? normalized : defaultCurrency;
}

/**
 * Parse price string to number
 */
export function parsePriceString(
    priceString: string,
    currency: SupportedCurrency = defaultCurrency
): number | null {
    const config = currencies[currency];

    // Remove currency symbol and code
    let cleaned = priceString
        .replace(config.symbol, '')
        .replace(config.code, '')
        .trim();

    // Handle compact notation
    const compactMultipliers: Record<string, number> = {
        K: 1_000,
        M: 1_000_000,
        B: 1_000_000_000,
    };

    for (const [suffix, multiplier] of Object.entries(compactMultipliers)) {
        if (cleaned.toUpperCase().endsWith(suffix)) {
            cleaned = cleaned.slice(0, -1);
            const number = parseFloat(cleaned.replace(/,/g, '.'));
            return isNaN(number) ? null : number * multiplier;
        }
    }

    // Remove thousands separators and normalize decimal
    cleaned = cleaned
        .replace(new RegExp(`\\${config.thousandsSeparator}`, 'g'), '')
        .replace(config.decimalSeparator, '.');

    const number = parseFloat(cleaned);
    return isNaN(number) ? null : number;
}

// ============================================
// REACT HOOK (Optional)
// ============================================

/**
 * Create a currency formatter for a specific locale/currency
 */
export function createCurrencyFormatter(
    currency: SupportedCurrency,
    locale?: string
) {
    return new Intl.NumberFormat(locale || 'en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

// ============================================
// EXPORTS
// ============================================

export type { FormatOptions };
