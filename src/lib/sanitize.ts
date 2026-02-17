/**
 * MODON Platform - Input Sanitization Utility
 * ============================================
 * Protects against XSS, SQL injection, and other input attacks
 */

// ============================================
// HTML/XSS SANITIZATION
// ============================================

/**
 * Remove all HTML tags from a string
 */
export function stripHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        // Remove script tags and their content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove style tags and their content
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        // Remove all HTML tags
        .replace(/<[^>]*>/g, '')
        // Decode common HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        // Re-escape to prevent injection
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';

    const htmlEscapes: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
    };

    return input.replace(/[&<>"'`=/]/g, char => htmlEscapes[char] || char);
}

/**
 * Remove dangerous patterns commonly used in XSS attacks
 */
export function removeXSSPatterns(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Remove vbscript: protocol
        .replace(/vbscript:/gi, '')
        // Remove data: protocol (can contain scripts)
        .replace(/data:/gi, '')
        // Remove event handlers
        .replace(/on\w+\s*=/gi, '')
        // Remove expression() (IE CSS)
        .replace(/expression\s*\(/gi, '')
        // Remove url() with javascript
        .replace(/url\s*\(\s*['"]?\s*javascript/gi, 'url(')
        // Remove eval()
        .replace(/eval\s*\(/gi, '')
        // Remove Function constructor
        .replace(/new\s+Function\s*\(/gi, '')
        // Remove setTimeout/setInterval with strings
        .replace(/(setTimeout|setInterval)\s*\(\s*['"`]/gi, '$1(');
}

// ============================================
// SQL INJECTION PROTECTION
// ============================================

/**
 * Escape characters that could be used in SQL injection
 * Note: Always use parameterized queries - this is a fallback
 */
export function escapeSql(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        .replace(/'/g, "''")
        .replace(/\\/g, '\\\\')
        .replace(/\x00/g, '\\0')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\x1a/g, '\\Z');
}

// ============================================
// COMPREHENSIVE SANITIZATION
// ============================================

/**
 * Comprehensive sanitization for user input
 * Use this for form fields that will be stored in database
 */
export function sanitizeInput(input: string, options: {
    stripHtml?: boolean;
    escapeHtml?: boolean;
    removeXSS?: boolean;
    trim?: boolean;
    maxLength?: number;
} = {}): string {
    const {
        stripHtml: shouldStripHtml = true,
        escapeHtml: shouldEscapeHtml = true,
        removeXSS = true,
        trim = true,
        maxLength,
    } = options;

    if (!input || typeof input !== 'string') return '';

    let result = input;

    // Trim whitespace
    if (trim) {
        result = result.trim();
    }

    // Remove XSS patterns first
    if (removeXSS) {
        result = removeXSSPatterns(result);
    }

    // Strip HTML tags
    if (shouldStripHtml) {
        result = stripHtml(result);
    }

    // Escape HTML if not stripping (for fields that allow some formatting)
    if (shouldEscapeHtml && !shouldStripHtml) {
        result = escapeHtml(result);
    }

    // Enforce max length
    if (maxLength && result.length > maxLength) {
        result = result.substring(0, maxLength);
    }

    return result;
}

/**
 * Sanitize an entire object (recursive)
 */
export function sanitizeObject<T extends Record<string, unknown>>(
    obj: T,
    options: {
        excludeFields?: string[];
        maxStringLength?: number;
    } = {}
): T {
    const { excludeFields = [], maxStringLength = 10000 } = options;

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (excludeFields.includes(key)) {
            sanitized[key] = value;
            continue;
        }

        if (typeof value === 'string') {
            sanitized[key] = sanitizeInput(value, { maxLength: maxStringLength });
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item =>
                typeof item === 'string'
                    ? sanitizeInput(item, { maxLength: maxStringLength })
                    : typeof item === 'object' && item !== null
                        ? sanitizeObject(item as Record<string, unknown>, options)
                        : item
            );
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value as Record<string, unknown>, options);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized as T;
}

// ============================================
// EMAIL VALIDATION & SANITIZATION
// ============================================

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string | null {
    if (!email || typeof email !== 'string') return null;

    const cleaned = email.toLowerCase().trim();

    // Basic email regex
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailRegex.test(cleaned)) return null;

    // Additional security checks
    if (cleaned.includes('..') || cleaned.startsWith('.') || cleaned.includes('.@')) {
        return null;
    }

    return cleaned;
}

// ============================================
// PHONE NUMBER SANITIZATION
// ============================================

/**
 * Sanitize phone number (keep only digits and common separators)
 */
export function sanitizePhone(phone: string): string {
    if (!phone || typeof phone !== 'string') return '';

    // Keep only digits, +, -, (), and spaces
    return phone.replace(/[^\d+\-() ]/g, '').trim();
}

// ============================================
// URL SANITIZATION
// ============================================

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
    if (!url || typeof url !== 'string') return null;

    const trimmed = url.trim();

    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'vbscript:', 'data:', 'file:'];
    const lowerUrl = trimmed.toLowerCase();

    for (const protocol of dangerousProtocols) {
        if (lowerUrl.startsWith(protocol)) return null;
    }

    // Only allow http and https
    if (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://') && !lowerUrl.startsWith('/')) {
        return null;
    }

    try {
        // Validate URL structure
        if (trimmed.startsWith('/')) {
            // Relative URL is okay
            return trimmed;
        }
        new URL(trimmed);
        return trimmed;
    } catch {
        return null;
    }
}

// ============================================
// EXPORT DEFAULT SANITIZER
// ============================================

const Sanitize = {
    stripHtml,
    escapeHtml,
    removeXSSPatterns,
    escapeSql,
    sanitizeInput,
    sanitizeObject,
    sanitizeEmail,
    sanitizePhone,
    sanitizeUrl,
};

export default Sanitize;
