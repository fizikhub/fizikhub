import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./mobile-optimizations.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ThemeProvider } from "@/components/theme-provider";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
  verification: {
    google: "yVbS-q4y0y... (User to provide)", // Placeholder
    yandex: "yandex...",
  },
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
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { CompactDock } from "@/components/mobile/compact-dock";

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

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let showOnboarding = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_seen_onboarding')
      .eq('id', user!.id)
      .single();

    if (profile && !profile?.has_seen_onboarding) {
      showOnboarding = true;
    }
  }

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://fizikhub.com" />
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
      <body className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} font-sans min-h-[100dvh] flex flex-col pb-16 md:pb-0 bg-background text-foreground`}>
        <UserActivityTracker />
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FramerMotionProvider>
            <TimeLimitProvider>
              <NavigationWrapper showOnboarding={showOnboarding}>
                {children}
              </NavigationWrapper>
              <InstallPrompt />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
