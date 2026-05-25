import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const noindexHeader = [
  {
    key: 'X-Robots-Tag',
    value: 'noindex, nofollow',
  },
];

const aiDiscoveryLinkHeader = [
  '<https://www.fizikhub.com/llms.txt>; rel="alternate"; type="text/plain"; title="Fizikhub LLM manifest"',
  '<https://www.fizikhub.com/ai-index.json>; rel="alternate"; type="application/json"; title="Fizikhub AI index"',
  '<https://www.fizikhub.com/ai-sitemap.xml>; rel="sitemap"; type="application/xml"; title="Fizikhub AI sitemap"',
  '<https://www.fizikhub.com/author-sitemap.xml>; rel="sitemap"; type="application/xml"; title="Fizikhub author sitemap"',
].join(', ');

const privateNoindexRoutes = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/profil/:path*',
  '/admin/:path*',
  '/yazar/:path*',
  '/yazar-paneli/:path*',
  '/makale/yeni',
  '/makale/duzenle/:path*',
  '/mesajlar/:path*',
  '/notifications/:path*',
  '/kurulum',
  '/time-limit/:path*',
  '/yonetim/:path*',
  '/basvuru/yazar',
  '/kitap-inceleme/yeni',
  '/paylas',
];

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isProduction ? [] : ["'unsafe-eval'"]),
  "https://challenges.cloudflare.com",
  "https://cdn.jsdelivr.net",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://va.vercel-scripts.com",
];

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrc.join(' ')}`,
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com https://*.vercel-analytics.com https://*.vercel-insights.com https://www.google-analytics.com https://generativelanguage.googleapis.com https://lh3.googleusercontent.com https://cdn-icons-png.flaticon.com https://www.transparenttextures.com",
  "frame-src 'self' https://challenges.cloudflare.com https://www.youtube.com https://youtube.com https://phet.colorado.edu",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self' https://*.instagram.com https://*.facebook.com",
  "upgrade-insecure-requests",
];

const reportOnlyContentSecurityPolicy = [
  ...contentSecurityPolicy.filter((directive) => directive !== "upgrade-insecure-requests"),
  "report-to csp-endpoint",
  "report-uri /api/security/csp-report",
];

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [400, 500, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [45, 50, 60, 70, 75, 85],
    minimumCacheTTL: 31536000, // 1 year cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'web.archive.org',
      },
      {
        protocol: 'https',
        hostname: 'i.gifer.com',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,

  // Performance optimizations
  experimental: {
    staleTimes: {
      dynamic: 30, // Client-side cache for dynamic pages (seconds)
      static: 300, // Client-side cache for static pages (seconds)
    },
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'framer-motion',
      'three',
      '@phosphor-icons/react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      '@radix-ui/react-select',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'canvas-confetti',

      'html2canvas',
      'sonner',
      'react-hook-form',
      '@supabase/supabase-js',
      'react-markdown',
      'rehype-katex',
      'rehype-raw',
      'rehype-highlight',
      'remark-math',
      'react-katex',
      'zod',
      'cmdk',
      'react-easy-crop',
    ],
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ['error', 'warn'] } : false,
  },

  // SEO/canonical redirects live in proxy.ts so query cleanup can happen in a
  // single hop without Next.js preserving legacy query parameters.
  async redirects() {
    return [];
  },

  // Security & Caching Headers
  async headers() {
    return [
      ...privateNoindexRoutes.map((source) => ({
        source,
        headers: noindexHeader,
      })),
      // Prevent indexing of font/media assets to clean up GSC "Crawled - not indexed" warnings
      {
        source: '/_next/static/media/:all*',
        headers: noindexHeader,
      },
      {
        source: '/:all*(woff|woff2)',
        headers: noindexHeader,
      },
      // Immutable static assets (fonts, images, etc.)
      {
        source: '/:all*(svg|jpg|png|gif|ico|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year cache
          },
        ],
      },
      // PWA Files (Service Worker & Manifest)
      {
        source: '/(sw.js|manifest.json|workbox-*.js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          ...noindexHeader,
        ]
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          ...noindexHeader,
        ],
      },
      // Global security headers for all routes
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Link',
            value: aiDiscoveryLinkHeader,
          },
          // Clickjacking protection — handled by CSP frame-ancestors below
          // X-Frame-Options removed to allow Instagram WebView to load pages
          // Legacy browser XSS filters are deprecated; CSP is the active defense.
          {
            key: 'X-XSS-Protection',
            value: '0',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // HSTS - Force HTTPS for 1 year
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // CSP - Content Security Policy (Google bots, analytics, and Supabase allowed)
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy.join('; '),
          },
          // Mirror enforced CSP for report collection without flooding logs with
          // known Next.js inline script/style allowances.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: reportOnlyContentSecurityPolicy.join('; '),
          },
          {
            key: 'Reporting-Endpoints',
            value: 'csp-endpoint="/api/security/csp-report"',
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Origin-Agent-Cluster',
            value: '?1',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          // X-DNS-Prefetch-Control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },

};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: false,
  skipWaiting: true,
  cacheOnFrontEndNav: false,
  cacheStartUrl: false,
  reloadOnOnline: false,
  publicExcludes: [
    "!assets/**/*",
    "!audio/**/*",
    "!badges/**/*",
    "!cats/**/*",
    "!email/**/*",
    "!img/**/*",
    "!retro/**/*",
    "!rive/**/*",
    "!stories/**/*",
    "!fonts/**/*",
    "!images/**/*",
    "!404-rick-scientist-transparent.png",
    "!hubgpt-logo.png",
    "!noise.png",
    "!og-image.jpg",
  ],
  fallbacks: {
    document: "/~offline",
  },
  workboxOptions: {
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,
    exclude: [
      // Workbox receives webpack asset names like `static/chunks/...`,
      // not the public `/_next/static/...` URLs. Keep those bundles out of
      // precache; caching every route chunk on SW install can flood slower
      // clients with background downloads.
      /static\/chunks\/.*\.js$/,
      /static\/media\/.*\.(?:woff|woff2|ttf)$/,
      /\.map$/,
      /^manifest.*\.js$/,
    ],
    // Exclude external URLs from being cached by the SW
    navigateFallbackDenylist: [/^\/api\//],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/lh3\.googleusercontent\.com\/.*/i,
        handler: 'NetworkOnly',
      },
      {
        urlPattern: /^https:\/\/cdn-icons-png\.flaticon\.com\/.*/i,
        handler: 'NetworkOnly',
      },
    ],
  },
});

export default withPWA(withBundleAnalyzer(nextConfig));
