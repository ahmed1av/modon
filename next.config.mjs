/** @type {import('next').NextConfig} */
const nextConfig = {
    // ============================================
    // PRODUCTION BUILD OPTIMIZATION
    // ============================================

    // Compress output for smaller bundle sizes
    compress: true,

    // Generate source maps in production (for error tracking)
    productionBrowserSourceMaps: false, // Set to true if using Sentry

    // Remove X-Powered-By header for security
    poweredByHeader: false,

    // Strict mode for development
    reactStrictMode: true,

    // SECURITY (VULN-004 FIX): Strip console.log/warn from production builds
    // console.error is preserved for production error monitoring
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error'],
        } : false,
    },

    // ============================================
    // REDIRECTS (REBRANDING)
    // ============================================
    async redirects() {
        return [
            {
                source: '/:lang/baerz-auctions-buy',
                destination: '/:lang/auctions/buy',
                permanent: true,
            },
            {
                source: '/:lang/baerz-auctions-sell',
                destination: '/:lang/auctions/sell',
                permanent: true,
            },
            {
                source: '/:lang/baerz-auctions-how-it-works',
                destination: '/:lang/auctions/how-it-works',
                permanent: true,
            },
            {
                source: '/:lang/baerz-auctions-professionals',
                destination: '/:lang/auctions/professionals',
                permanent: true,
            },
            {
                source: '/baerz-auctions-buy',
                destination: '/en/auctions/buy',
                permanent: true,
            },
            {
                source: '/baerz-auctions-sell',
                destination: '/en/auctions/sell',
                permanent: true,
            },
            {
                source: '/baerz-auctions-how-it-works',
                destination: '/en/auctions/how-it-works',
                permanent: true,
            },
            {
                source: '/baerz-auctions-professionals',
                destination: '/en/auctions/professionals',
                permanent: true,
            },
        ];
    },

    // ============================================
    // IMAGE OPTIMIZATION
    // ============================================

    images: {
        remotePatterns: [
            // MODON platform images
            {
                protocol: 'https',
                hostname: 'www.modonevolutio.com',
            },
            // Unsplash for placeholder images
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            // Supabase storage (all subdomains)
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
            {
                protocol: 'https',
                hostname: '*.supabase.in',
            },
            // Common image CDNs
            {
                protocol: 'https',
                hostname: 'cdn.worldvectorlogo.com',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            // Vimeo for video thumbnails
            {
                protocol: 'https',
                hostname: 'vimeo.com',
            },
            {
                protocol: 'https',
                hostname: 'player.vimeo.com',
            },
            {
                protocol: 'https',
                hostname: 'i.vimeocdn.com',
            },
            // Cloudinary (if you migrate to it later)
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            // Local development (comprehensive localhost support)
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
            },
        ],
        // Enable modern formats (AVIF is 50% smaller than WebP)
        formats: ['image/avif', 'image/webp'],
        // Responsive image sizes for different devices
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Cache optimized images for 60 seconds minimum
        minimumCacheTTL: 60,
        // Disable static imports in production (use next/image)
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // ============================================
    // EXPERIMENTAL FEATURES
    // ============================================

    experimental: {
        // Optimize package imports for smaller bundles
        optimizePackageImports: ['lucide-react', 'jspdf', '@supabase/supabase-js'],

        // Enable modern bundling (Next.js 16+)
        optimizeCss: true,
    },

    // ============================================
    // TURBOPACK CONFIGURATION (Next.js 16+)
    // ============================================

    // Empty config to allow webpack fallback if needed
    // Next.js 16 uses Turbopack by default
    turbopack: {},

    // ============================================
    // ENVIRONMENT & BUILD
    // ============================================

    env: {
        // Expose build time for cache busting
        BUILD_TIME: new Date().toISOString(),
    },
};

export default nextConfig;
