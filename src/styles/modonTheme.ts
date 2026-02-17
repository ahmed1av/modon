/**
 * MODON EVOLUTIO Design System Tokens
 * ====================================
 * Luxury design tokens for MODON Evolutio platform.
 * These define the premium aesthetic for the application.
 */

export const modonTheme = {
    // ===============================
    // COLOR PALETTE
    // ===============================
    colors: {
        // Primary Backgrounds
        white: '#FFFFFF',
        offWhite: '#F2F2F2',
        softGray: '#FAFAFA',
        bodyBg: '#FFFFFF',

        // Text Colors
        charcoal: '#212529',        // Primary body text - rgb(33, 37, 41)
        darkNeutral: '#1A1A1A',     // Footer, high-contrast sections
        textLight: '#6C757D',       // Secondary text

        // Accent Colors
        luxuryGold: '#BE9C7E',      // Primary accent - rgb(190, 156, 126)
        goldHover: '#A8876B',       // Darker gold for hover states

        // Borders & Dividers
        borderLight: '#DDDDE1',     // Light gray borders - rgb(221, 223, 225)
        borderSoft: '#E9ECEF',

        // Overlay Colors
        overlay: 'rgba(0, 0, 0, 0.08)',
        overlayDark: 'rgba(0, 0, 0, 0.4)',
    },

    // ===============================
    // TYPOGRAPHY
    // ===============================
    fonts: {
        // Heading Font - Magazine aesthetic
        heading: "'Playfair Display', serif",
        headingWeight: 400,
        headingTransform: 'uppercase',

        // Body Font - Clean sans-serif
        body: "'Montserrat', sans-serif",
        bodyWeight: 400,

        // Font Sizes (px)
        sizes: {
            heroTitle: '48px',
            h1: '48px',
            h2: '36px',
            h3: '24px',
            body: '15px',
            navLink: '17px',
            topNavLink: '14px',
            small: '13px',
            tiny: '11px',
        },

        // Letter Spacing
        letterSpacing: {
            wide: '0.15em',
            normal: 'normal',
            tight: '-0.01em',
        },

        // Line Heights
        lineHeight: {
            tight: 1.1,
            normal: 1.5,
            relaxed: 1.7,
        },
    },

    // ===============================
    // SPACING - "Luxury Breathing Room"
    // ===============================
    spacing: {
        // Base unit: 8px
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '48px',
        xxl: '64px',

        // Section Padding (the generous MODON whitespace)
        sectionVertical: '120px',    // Massive vertical margins
        sectionHorizontal: '32px',
        heroVertical: '200px',       // Even larger for hero

        // Card/Grid Gaps
        cardGap: '30px',
        gridGap: '32px',

        // Container
        containerMax: '1600px',
        containerPadding: '40px',
    },

    // ===============================
    // HEADER SPECIFIC
    // ===============================
    header: {
        topBarHeight: '40px',
        mainNavHeight: '50px',
        totalHeight: '90px',

        // Transparency states
        transparentBg: 'rgba(0, 0, 0, 0)',
        solidBg: '#FFFFFF',

        // Logo
        logoSize: '24px',
    },

    // ===============================
    // ANIMATIONS & TRANSITIONS
    // ===============================
    transitions: {
        // Primary easing function for MODON
        modonEase: 'cubic-bezier(.2, .7, .2, 1)',

        // Standard timing
        fast: '0.15s linear',
        normal: '0.3s cubic-bezier(.2, .7, .2, 1)',
        slow: '0.5s cubic-bezier(.2, .7, .2, 1)',

        // Image transitions
        imageScale: '0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',

        // Hover overlay
        hoverOverlay: '0.15s linear',
    },

    // ===============================
    // PROPERTY CARD
    // ===============================
    propertyCard: {
        imageAspectRatio: '4/3',
        imageHeight: '300px',
        borderRadius: '0',             // MODON uses sharp edges, no rounded corners
        contentPadding: '24px',

        // Price styling
        priceColor: '#BE9C7E',         // Luxury gold
        priceSize: '16px',
        priceWeight: 500,

        // City/location styling
        cityTransform: 'uppercase' as const,
        citySize: '13px',
        cityWeight: 500,

        // Hover overlay
        hoverOverlay: 'rgba(0, 0, 0, 0.08)',
    },

    // ===============================
    // SEARCH BAR
    // ===============================
    searchBar: {
        height: '60px',
        borderRadius: '4px',
        shadowIntensity: '0 4px 20px rgba(0, 0, 0, 0.15)',
        shadowHover: '0 8px 32px rgba(0, 0, 0, 0.2)',
        inputPadding: '16px 24px',
        buttonBg: '#BE9C7E',
        buttonHoverBg: '#A8876B',
    },

    // ===============================
    // BUTTONS
    // ===============================
    buttons: {
        primary: {
            bg: '#BE9C7E',
            color: '#FFFFFF',
            hoverBg: '#A8876B',
            hoverColor: '#FFFFFF',
        },
        outline: {
            bg: 'transparent',
            color: '#212529',
            border: '1px solid #212529',
            hoverBg: '#212529',
            hoverColor: '#FFFFFF',
        },
        ghost: {
            bg: 'transparent',
            color: '#BE9C7E',
            hoverColor: '#A8876B',
        },
    },

    // ===============================
    // SHADOWS
    // ===============================
    shadows: {
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
        cardHover: '0 8px 24px rgba(0, 0, 0, 0.12)',
        dropdown: '0 10px 30px rgba(0, 0, 0, 0.15)',
        searchBar: '0 4px 20px rgba(0, 0, 0, 0.15)',
    },

    // ===============================
    // ICONS
    // ===============================
    icons: {
        size: {
            sm: '14px',
            md: '18px',
            lg: '24px',
        },
        favoriteColor: '#BE9C7E',
        favoriteActiveColor: '#E74C3C',
    },

    // ===============================
    // BREAKPOINTS
    // ===============================
    breakpoints: {
        mobile: '576px',
        tablet: '768px',
        desktop: '992px',
        wide: '1200px',
        ultraWide: '1600px',
    },
};

// CSS Custom Properties generator
export const generateCSSVariables = () => {
    return `
    :root {
      /* Colors */
      --modon-white: ${modonTheme.colors.white};
      --modon-off-white: ${modonTheme.colors.offWhite};
      --modon-soft-gray: ${modonTheme.colors.softGray};
      --modon-charcoal: ${modonTheme.colors.charcoal};
      --modon-dark: ${modonTheme.colors.darkNeutral};
      --modon-text-light: ${modonTheme.colors.textLight};
      --modon-gold: ${modonTheme.colors.luxuryGold};
      --modon-gold-hover: ${modonTheme.colors.goldHover};
      --modon-border: ${modonTheme.colors.borderLight};
      --modon-border-soft: ${modonTheme.colors.borderSoft};
      
      /* Typography */
      --modon-font-heading: ${modonTheme.fonts.heading};
      --modon-font-body: ${modonTheme.fonts.body};
      
      /* Spacing */
      --modon-container: ${modonTheme.spacing.containerMax};
      --modon-section-padding: ${modonTheme.spacing.sectionVertical};
      --modon-card-gap: ${modonTheme.spacing.cardGap};
      
      /* Transitions */
      --modon-ease: ${modonTheme.transitions.modonEase};
      --modon-transition: ${modonTheme.transitions.normal};
      --modon-transition-fast: ${modonTheme.transitions.fast};
      
      /* Shadows */
      --modon-shadow-card: ${modonTheme.shadows.card};
      --modon-shadow-hover: ${modonTheme.shadows.cardHover};
    }
  `;
};

// Legacy alias for backward compatibility
export default modonTheme;
