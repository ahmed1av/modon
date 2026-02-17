/**
 * Google Analytics 4 (GA4) Event Tracking Utility
 * ================================================
 * Production-ready event tracking for lead generation,
 * PDF downloads, and user interactions.
 * 
 * Usage:
 * ```typescript
 * import { trackEvent } from '@/lib/analytics/gtag';
 * 
 * trackEvent('lead_submitted', {
 *   lead_type: 'property_inquiry',
 *   property_id: 'villa-123'
 * });
 * ```
 */

// Type-safe GA4 event names
export type GAEventName =
    | 'page_view'
    | 'lead_submitted'
    | 'brochure_downloaded'
    | 'property_viewed'
    | 'property_favorited'
    | 'property_shared'
    | 'language_switched'
    | 'search_performed'
    | 'filter_applied'
    | 'contact_form_opened'
    | 'phone_number_clicked'
    | 'email_clicked'
    | 'virtual_tour_started'
    | 'image_gallery_opened';

// Type-safe event parameters
export interface GAEventParams {
    // Common parameters
    event_category?: string;
    event_label?: string;
    value?: number;

    // Lead-specific
    lead_type?: 'property_inquiry' | 'valuation_request' | 'general_contact';
    property_id?: string;
    property_title?: string;
    property_price?: number;
    property_location?: string;

    // User interaction
    interaction_type?: string;
    search_query?: string;
    filter_type?: string;
    filter_value?: string;

    // Language
    from_language?: string;
    to_language?: string;

    // Custom properties (flexible)
    [key: string]: string | number | boolean | undefined;
}

/**
 * Track a custom event in Google Analytics 4
 * 
 * @param eventName - The name of the event (e.g., 'lead_submitted')
 * @param params - Additional parameters for the event
 * 
 * @example
 * ```typescript
 * // Track a lead submission
 * trackEvent('lead_submitted', {
 *   lead_type: 'property_inquiry',
 *   property_id: 'villa-cairo-123',
 *   property_price: 5000000,
 *   event_category: 'engagement',
 *   event_label: 'Contact Form'
 * });
 * ```
 */
export function trackEvent(eventName: GAEventName, params?: GAEventParams): void {
    // Only track in production or when GA is enabled
    if (typeof window === 'undefined') {
        // Server-side rendering, skip tracking
        return;
    }

    // Check if gtag is available
    if (typeof window.gtag === 'undefined') {
        // Development mode or GA not loaded
        console.log('[GA4 Event]', eventName, params);
        return;
    }

    // Send event to Google Analytics
    window.gtag('event', eventName, params);
}

/**
 * Track a page view (automatically tracked by Next.js, but can be manually triggered)
 * 
 * @param url - The page URL
 * @param title - The page title
 */
export function trackPageView(url: string, title?: string): void {
    trackEvent('page_view', {
        page_location: url,
        page_title: title || document.title,
    } as GAEventParams);
}

/**
 * Track a lead submission
 * 
 * @param leadType - Type of lead (property_inquiry, valuation_request, etc.)
 * @param propertyId - Optional property reference
 * @param additionalParams - Additional parameters
 */
export function trackLeadSubmission(
    leadType: 'property_inquiry' | 'valuation_request' | 'general_contact',
    propertyId?: string,
    additionalParams?: GAEventParams
): void {
    trackEvent('lead_submitted', {
        lead_type: leadType,
        property_id: propertyId,
        event_category: 'conversion',
        event_label: 'Lead Form',
        ...additionalParams,
    });
}

/**
 * Track a PDF brochure download
 * 
 * @param propertyId - Property reference code
 * @param propertyTitle - Property title
 * @param propertyPrice - Property price (for value tracking)
 */
export function trackBrochureDownload(
    propertyId: string,
    propertyTitle: string,
    propertyPrice?: number
): void {
    trackEvent('brochure_downloaded', {
        property_id: propertyId,
        property_title: propertyTitle,
        property_price: propertyPrice,
        event_category: 'engagement',
        event_label: 'PDF Download',
        value: 1, // Count each download as value 1
    });
}

/**
 * Track a property view
 * 
 * @param propertyId - Property reference code
 * @param propertyTitle - Property title
 * @param propertyPrice - Property price
 * @param propertyLocation - Property location (city/region)
 */
export function trackPropertyView(
    propertyId: string,
    propertyTitle: string,
    propertyPrice: number,
    propertyLocation: string
): void {
    trackEvent('property_viewed', {
        property_id: propertyId,
        property_title: propertyTitle,
        property_price: propertyPrice,
        property_location: propertyLocation,
        event_category: 'engagement',
        event_label: 'Property Detail',
    });
}

/**
 * Track a property favorite action
 * 
 * @param propertyId - Property reference code
 * @param action - 'add' or 'remove'
 */
export function trackPropertyFavorite(
    propertyId: string,
    action: 'add' | 'remove'
): void {
    trackEvent('property_favorited', {
        property_id: propertyId,
        interaction_type: action,
        event_category: 'engagement',
        event_label: 'Favorites',
    });
}

/**
 * Track a property share action
 * 
 * @param propertyId - Property reference code
 * @param method - Share method (native, clipboard, etc.)
 */
export function trackPropertyShare(
    propertyId: string,
    method: 'native' | 'clipboard' | 'email'
): void {
    trackEvent('property_shared', {
        property_id: propertyId,
        interaction_type: method,
        event_category: 'engagement',
        event_label: 'Share',
    });
}

/**
 * Track a language switch
 * 
 * @param fromLang - Previous language code (e.g., 'en')
 * @param toLang - New language code (e.g., 'ar')
 */
export function trackLanguageSwitch(fromLang: string, toLang: string): void {
    trackEvent('language_switched', {
        from_language: fromLang,
        to_language: toLang,
        event_category: 'navigation',
        event_label: 'Language Toggle',
    });
}

/**
 * Track a search action
 * 
 * @param query - Search query string
 * @param resultsCount - Number of results returned
 */
export function trackSearch(query: string, resultsCount?: number): void {
    trackEvent('search_performed', {
        search_query: query,
        value: resultsCount,
        event_category: 'engagement',
        event_label: 'Property Search',
    });
}

/**
 * Track a filter application
 * 
 * @param filterType - Type of filter (price, location, etc.)
 * @param filterValue - The filter value applied
 */
export function trackFilter(filterType: string, filterValue: string): void {
    trackEvent('filter_applied', {
        filter_type: filterType,
        filter_value: filterValue,
        event_category: 'engagement',
        event_label: 'Property Filter',
    });
}

// Extend the Window interface to include gtag
declare global {
    interface Window {
        gtag?: (
            command: 'config' | 'event' | 'js' | 'set',
            targetId: string | Date | GAEventName,
            config?: GAEventParams | { [key: string]: any }
        ) => void;
        dataLayer?: Object[];
    }
}

export default trackEvent;
