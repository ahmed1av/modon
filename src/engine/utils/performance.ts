/**
 * Antigravity Performance Utilities
 */

export const blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export function formatPrice(price: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency,
    }).format(price);
}

export function debounce(fn: Function, ms: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
}
