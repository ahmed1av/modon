/**
 * MODON Platform - Internationalization (i18n)
 * =============================================
 * Multi-language support for the platform
 */

// ============================================
// TYPES
// ============================================

export type SupportedLocale = 'en' | 'ar' | 'nl' | 'es' | 'de';

export interface LocaleConfig {
    code: SupportedLocale;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
    flag: string;
    dateFormat: string;
    numberFormat: {
        decimal: string;
        thousands: string;
    };
}

// ============================================
// LOCALE CONFIGURATIONS
// ============================================

export const locales: Record<SupportedLocale, LocaleConfig> = {
    en: {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
        flag: '🇬🇧',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: { decimal: '.', thousands: ',' },
    },
    ar: {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        direction: 'rtl',
        flag: '🇸🇦',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: { decimal: '٫', thousands: '٬' },
    },
    nl: {
        code: 'nl',
        name: 'Dutch',
        nativeName: 'Nederlands',
        direction: 'ltr',
        flag: '🇳🇱',
        dateFormat: 'DD-MM-YYYY',
        numberFormat: { decimal: ',', thousands: '.' },
    },
    es: {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        direction: 'ltr',
        flag: '🇪🇸',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: { decimal: ',', thousands: '.' },
    },
    de: {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        direction: 'ltr',
        flag: '🇩🇪',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: { decimal: ',', thousands: '.' },
    },
};

export const defaultLocale: SupportedLocale = 'en';

// ============================================
// TRANSLATIONS
// ============================================

type TranslationKeys = {
    // Navigation
    'nav.home': string;
    'nav.properties': string;
    'nav.sale': string;
    'nav.rent': string;
    'nav.about': string;
    'nav.contact': string;
    'nav.agents': string;
    'nav.services': string;

    // Hero
    'hero.title': string;
    'hero.subtitle': string;
    'hero.search.placeholder': string;
    'hero.search.button': string;

    // Properties
    'property.bedrooms': string;
    'property.bathrooms': string;
    'property.area': string;
    'property.plot': string;
    'property.price': string;
    'property.viewDetails': string;
    'property.featured': string;
    'property.exclusive': string;
    'property.offMarket': string;
    'property.sold': string;
    'property.rented': string;

    // Property Types
    'propertyType.villa': string;
    'propertyType.house': string;
    'propertyType.apartment': string;
    'propertyType.penthouse': string;
    'propertyType.land': string;
    'propertyType.commercial': string;

    // Filters
    'filter.type': string;
    'filter.location': string;
    'filter.priceRange': string;
    'filter.bedrooms': string;
    'filter.bathrooms': string;
    'filter.area': string;
    'filter.features': string;
    'filter.moreFilters': string;
    'filter.apply': string;
    'filter.reset': string;
    'filter.results': string;

    // Actions
    'action.save': string;
    'action.cancel': string;
    'action.delete': string;
    'action.edit': string;
    'action.submit': string;
    'action.send': string;
    'action.loading': string;
    'action.close': string;

    // Auth
    'auth.login': string;
    'auth.register': string;
    'auth.logout': string;
    'auth.email': string;
    'auth.password': string;
    'auth.forgotPassword': string;
    'auth.rememberMe': string;

    // Contact
    'contact.title': string;
    'contact.name': string;
    'contact.email': string;
    'contact.phone': string;
    'contact.message': string;
    'contact.send': string;
    'contact.success': string;

    // Footer
    'footer.aboutUs': string;
    'footer.services': string;
    'footer.properties': string;
    'footer.contact': string;
    'footer.legal': string;
    'footer.privacy': string;
    'footer.terms': string;
    'footer.cookies': string;
    'footer.rights': string;

    // Common
    'common.or': string;
    'common.and': string;
    'common.search': string;
    'common.noResults': string;
    'common.loading': string;
    'common.error': string;
    'common.success': string;
};

const translations: Record<SupportedLocale, TranslationKeys> = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.properties': 'Properties',
        'nav.sale': 'For Sale',
        'nav.rent': 'For Rent',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'nav.agents': 'Agents',
        'nav.services': 'Services',

        // Hero
        'hero.title': 'Find Your Dream Home',
        'hero.subtitle': 'Discover extraordinary properties in prime locations',
        'hero.search.placeholder': 'Search by location, property type...',
        'hero.search.button': 'Search',

        // Properties
        'property.bedrooms': 'Bedrooms',
        'property.bathrooms': 'Bathrooms',
        'property.area': 'Living Area',
        'property.plot': 'Plot Size',
        'property.price': 'Price',
        'property.viewDetails': 'View Details',
        'property.featured': 'Featured',
        'property.exclusive': 'Exclusive',
        'property.offMarket': 'Off Market',
        'property.sold': 'Sold',
        'property.rented': 'Rented',

        // Property Types
        'propertyType.villa': 'Villa',
        'propertyType.house': 'House',
        'propertyType.apartment': 'Apartment',
        'propertyType.penthouse': 'Penthouse',
        'propertyType.land': 'Land',
        'propertyType.commercial': 'Commercial',

        // Filters
        'filter.type': 'Property Type',
        'filter.location': 'Location',
        'filter.priceRange': 'Price Range',
        'filter.bedrooms': 'Bedrooms',
        'filter.bathrooms': 'Bathrooms',
        'filter.area': 'Living Area',
        'filter.features': 'Features',
        'filter.moreFilters': 'More Filters',
        'filter.apply': 'Apply Filters',
        'filter.reset': 'Reset',
        'filter.results': 'Properties found',

        // Actions
        'action.save': 'Save',
        'action.cancel': 'Cancel',
        'action.delete': 'Delete',
        'action.edit': 'Edit',
        'action.submit': 'Submit',
        'action.send': 'Send',
        'action.loading': 'Loading...',
        'action.close': 'Close',

        // Auth
        'auth.login': 'Log In',
        'auth.register': 'Register',
        'auth.logout': 'Log Out',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.forgotPassword': 'Forgot Password?',
        'auth.rememberMe': 'Remember Me',

        // Contact
        'contact.title': 'Contact Us',
        'contact.name': 'Your Name',
        'contact.email': 'Email Address',
        'contact.phone': 'Phone Number',
        'contact.message': 'Message',
        'contact.send': 'Send Message',
        'contact.success': 'Message sent successfully!',

        // Footer
        'footer.aboutUs': 'About Us',
        'footer.services': 'Our Services',
        'footer.properties': 'Properties',
        'footer.contact': 'Contact',
        'footer.legal': 'Legal',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms of Service',
        'footer.cookies': 'Cookie Policy',
        'footer.rights': 'All rights reserved',

        // Common
        'common.or': 'or',
        'common.and': 'and',
        'common.search': 'Search',
        'common.noResults': 'No results found',
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        'common.success': 'Success!',
    },

    ar: {
        // Navigation
        'nav.home': 'الرئيسية',
        'nav.properties': 'العقارات',
        'nav.sale': 'للبيع',
        'nav.rent': 'للإيجار',
        'nav.about': 'من نحن',
        'nav.contact': 'اتصل بنا',
        'nav.agents': 'الوكلاء',
        'nav.services': 'الخدمات',

        // Hero
        'hero.title': 'اعثر على منزل أحلامك',
        'hero.subtitle': 'اكتشف عقارات استثنائية في مواقع متميزة',
        'hero.search.placeholder': 'ابحث حسب الموقع، نوع العقار...',
        'hero.search.button': 'بحث',

        // Properties
        'property.bedrooms': 'غرف نوم',
        'property.bathrooms': 'حمامات',
        'property.area': 'المساحة',
        'property.plot': 'مساحة الأرض',
        'property.price': 'السعر',
        'property.viewDetails': 'عرض التفاصيل',
        'property.featured': 'مميز',
        'property.exclusive': 'حصري',
        'property.offMarket': 'غير معروض',
        'property.sold': 'تم البيع',
        'property.rented': 'تم التأجير',

        // Property Types
        'propertyType.villa': 'فيلا',
        'propertyType.house': 'منزل',
        'propertyType.apartment': 'شقة',
        'propertyType.penthouse': 'بنتهاوس',
        'propertyType.land': 'أرض',
        'propertyType.commercial': 'تجاري',

        // Filters
        'filter.type': 'نوع العقار',
        'filter.location': 'الموقع',
        'filter.priceRange': 'نطاق السعر',
        'filter.bedrooms': 'غرف النوم',
        'filter.bathrooms': 'الحمامات',
        'filter.area': 'المساحة',
        'filter.features': 'الميزات',
        'filter.moreFilters': 'فلاتر إضافية',
        'filter.apply': 'تطبيق الفلاتر',
        'filter.reset': 'إعادة تعيين',
        'filter.results': 'عقار تم العثور عليه',

        // Actions
        'action.save': 'حفظ',
        'action.cancel': 'إلغاء',
        'action.delete': 'حذف',
        'action.edit': 'تعديل',
        'action.submit': 'إرسال',
        'action.send': 'إرسال',
        'action.loading': 'جاري التحميل...',
        'action.close': 'إغلاق',

        // Auth
        'auth.login': 'تسجيل الدخول',
        'auth.register': 'إنشاء حساب',
        'auth.logout': 'تسجيل الخروج',
        'auth.email': 'البريد الإلكتروني',
        'auth.password': 'كلمة المرور',
        'auth.forgotPassword': 'نسيت كلمة المرور؟',
        'auth.rememberMe': 'تذكرني',

        // Contact
        'contact.title': 'اتصل بنا',
        'contact.name': 'الاسم',
        'contact.email': 'البريد الإلكتروني',
        'contact.phone': 'رقم الهاتف',
        'contact.message': 'الرسالة',
        'contact.send': 'إرسال الرسالة',
        'contact.success': 'تم إرسال الرسالة بنجاح!',

        // Footer
        'footer.aboutUs': 'من نحن',
        'footer.services': 'خدماتنا',
        'footer.properties': 'العقارات',
        'footer.contact': 'اتصل بنا',
        'footer.legal': 'قانوني',
        'footer.privacy': 'سياسة الخصوصية',
        'footer.terms': 'شروط الخدمة',
        'footer.cookies': 'سياسة ملفات تعريف الارتباط',
        'footer.rights': 'جميع الحقوق محفوظة',

        // Common
        'common.or': 'أو',
        'common.and': 'و',
        'common.search': 'بحث',
        'common.noResults': 'لم يتم العثور على نتائج',
        'common.loading': 'جاري التحميل...',
        'common.error': 'حدث خطأ',
        'common.success': 'نجاح!',
    },

    // Placeholder translations for other languages
    nl: {} as TranslationKeys,
    es: {} as TranslationKeys,
    de: {} as TranslationKeys,
};

// Fill in placeholders with English as fallback
for (const locale of ['nl', 'es', 'de'] as SupportedLocale[]) {
    translations[locale] = { ...translations.en };
}

// ============================================
// i18n UTILITIES
// ============================================

/**
 * Get translation for a key
 */
export function t(
    key: keyof TranslationKeys,
    locale: SupportedLocale = defaultLocale
): string {
    return translations[locale]?.[key] || translations.en[key] || key;
}

/**
 * Get all translations for a locale
 */
export function getTranslations(locale: SupportedLocale): TranslationKeys {
    return translations[locale] || translations.en;
}

/**
 * Get locale configuration
 */
export function getLocaleConfig(locale: SupportedLocale): LocaleConfig {
    return locales[locale] || locales.en;
}

/**
 * Get text direction for a locale
 */
export function getDirection(locale: SupportedLocale): 'ltr' | 'rtl' {
    return locales[locale]?.direction || 'ltr';
}

/**
 * Check if locale is RTL
 */
export function isRTL(locale: SupportedLocale): boolean {
    return getDirection(locale) === 'rtl';
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): LocaleConfig[] {
    return Object.values(locales);
}

/**
 * Validate locale
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
    return locale in locales;
}

/**
 * Parse locale from browser or URL
 */
export function parseLocale(
    localeString: string | null | undefined
): SupportedLocale {
    if (!localeString) return defaultLocale;

    const normalized = localeString.toLowerCase().split('-')[0];
    return isValidLocale(normalized) ? normalized : defaultLocale;
}

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Format date for locale
 */
export function formatDate(
    date: Date | string,
    locale: SupportedLocale = defaultLocale,
    options?: Intl.DateTimeFormatOptions
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return dateObj.toLocaleDateString(locale, options || defaultOptions);
}

/**
 * Format relative time
 */
export function formatRelativeTime(
    date: Date | string,
    locale: SupportedLocale = defaultLocale
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return rtf.format(-diffMinutes, 'minute');
        }
        return rtf.format(-diffHours, 'hour');
    }

    if (diffDays < 30) {
        return rtf.format(-diffDays, 'day');
    }

    if (diffDays < 365) {
        return rtf.format(-Math.floor(diffDays / 30), 'month');
    }

    return rtf.format(-Math.floor(diffDays / 365), 'year');
}

// ============================================
// EXPORTS
// ============================================

export {
    translations,
    type TranslationKeys,
};
