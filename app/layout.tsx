import type { Metadata } from "next";
import { Inter, Space_Grotesk, Archivo_Black, EB_Garamond } from "next/font/google";
import "./globals.css";
import "./mobile-optimizations.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ThemeProvider } from "@/components/theme-provider";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-head",
  display: "swap",
});







































export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  viewportFit: 'cover',
};


export const metadata: Metadata = {
  metadataBase: new URL('https://fizikhub.com'),
  title: {
    default: "Fizikhub",
    template: "%s | Fizikhub"
  },
  alternates: {
    canonical: './',
  },
  description: "BİLİMİ Tİ'YE ALIYORUZ AMA CİDDİLİ ŞEKİLDE. Evrenin sırlarını çözmeye çalışanların buluşma noktası.",
  keywords: [
    "fizik", "bilim", "uzay", "teknoloji", "fizikhub", "forum", "soru cevap",
    "TYT Fizik", "AYT Fizik", "YKS Fizik", "Bilimsel Tartışma", "Popüler Bilim", "Fizik Soru Çözümü",
    "Kuantum Fiziği", "Astrofizik", "Bilim Sözlüğü"
  ],
  authors: [{ name: "Fizikhub Ekibi", url: "https://fizikhub.com" }],
  creator: "Fizikhub",
  publisher: "Fizikhub",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://fizikhub.com",
    title: "Fizikhub",
    description: "BİLİMİ Tİ'YE ALIYORUZ AMA CİDDİLİ ŞEKİLDE. Evrenin sırlarını çözmeye çalışanların buluşma noktası.",
    siteName: "Fizikhub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fizikhub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fizikhub",
    description: "BİLİMİ Tİ'YE ALIYORUZ AMA CİDDİLİ ŞEKİLDE. Evrenin sırlarını çözmeye çalışanların buluşma noktası.",
    creator: "@fizikhub",
    site: "@fizikhub",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'science',
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fizikhub',
  url: 'https://fizikhub.com',
  logo: 'https://fizikhub.com/icon-512.png',
  sameAs: [
    'https://twitter.com/fizikhub',
    'https://instagram.com/fizikhub'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'iletisim@fizikhub.com'
  }
};

import { Toaster } from "sonner";
import { NavigationWrapper } from "@/components/layout/navigation-wrapper";
import { UserActivityTracker } from "@/components/analytics/user-activity-tracker";
import { TimeLimitProvider } from "@/components/time-limit/time-limit-provider";
import { FramerMotionProvider } from "@/components/framer-motion-provider";
import { createClient } from "@/lib/supabase-server";
import { MaintenanceAudioPlayer } from "@/components/maintenance/audio-player";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { OnboardingCheck } from "@/components/auth/onboarding-check";
import { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // MAINTENANCE MODE FLAG - SET TO FALSE TO DISABLE
  const MAINTENANCE_MODE = false;

  if (MAINTENANCE_MODE) {
    return (
      <html lang="tr" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="canonical" href="https://fizikhub.com" />
        </head>
        <body className="bg-[#050505] min-h-screen">
          <div className="fixed inset-0 z-[9999] min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden text-center p-6">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />

            {/* Content */}
            <div className="relative z-10 max-w-2xl flex flex-col items-center gap-8">
              {/* Galileo Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-900 to-amber-600 rounded-lg blur opacity-25"></div>
                <div className="relative rounded-lg border-2 border-amber-900/30 overflow-hidden shadow-2xl">
                  <img
                    src="/images/galileo-error.jpg"
                    alt="Galileo Galilei"
                    className="object-cover grayscale w-auto h-[400px]"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-lg">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-600">
                    Yüksek İhtimalle Sıçtık.
                  </span>
                </h1>

                <div className="space-y-2 text-lg sm:text-xl text-slate-400 font-medium font-mono leading-relaxed max-w-lg mx-auto border-l-2 border-red-900/50 pl-6 text-left">
                  <p>Bu sayfayı görüyorsan belli ki ciddi bir sorun var.</p>
                  <p className="text-slate-500">Bu sorunu ya çözmeye çalışıyoruz ya da hiç farkında bile değiliz.</p>
                </div>
              </div>

              {/* Audio */}
              <MaintenanceAudioPlayer />

              {/* 500 Background Text */}
              <div className="absolute bottom-[-100px] font-black text-[200px] text-white/5 pointer-events-none select-none">
                500
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }


  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* DNS prefetch & preconnect for external resources */}
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {/* KaTeX Support for Mathematical Formulas */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${ebGaramond.variable} ${spaceGrotesk.variable} ${archivoBlack.variable} font-sans min-h-[100dvh] flex flex-col pb-16 md:pb-0 bg-background text-foreground`}>


        <UserActivityTracker />
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FramerMotionProvider>
            <TimeLimitProvider>
              <NavigationWrapper>
                <Suspense fallback={null}>
                  <OnboardingCheck />
                </Suspense>
                <SmoothScrollProvider>
                  {children}
                </SmoothScrollProvider>
              </NavigationWrapper>

            </TimeLimitProvider>
          </FramerMotionProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              className: "font-sans border-none bg-black text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-[40px] px-6 py-3 min-w-[200px] flex items-center justify-center text-center font-bold tracking-tight dynamic-island-toast",
              style: {
                borderRadius: "40px",
                background: "#000000",
                color: "#ffffff",
              },
            }}
          />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
