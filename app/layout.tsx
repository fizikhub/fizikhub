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
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
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
  description: "Evrenin sınırlarını çözmeye çalışanların buluşma noktası.",
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
    description: "Evrenin sınırlarını çözmeye çalışanların buluşma noktası.",
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
    description: "Evrenin sınırlarını çözmeye çalışanların buluşma noktası.",
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
    google: "google-site-verification-code", // Placeholder, user might need to add this later or I can ask
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

import { GlobalAdminNotification } from "@/components/global-admin-notification";

import { NavigationWrapper } from "@/components/layout/navigation-wrapper";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
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
      <body className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} font-sans min-h-screen flex flex-col pb-16 md:pb-0`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >

          <GlobalAdminNotification />

          <NavigationWrapper>
            {children}
          </NavigationWrapper>
          <Toaster
            toastOptions={{
              className: "font-sans border border-white/10 bg-black/80 backdrop-blur-xl text-white shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] rounded-lg p-5",
              style: {
                borderRadius: "8px", // Slight curve for modern feel
              },
              classNames: {
                toast: "group",
                title: "text-base font-bold uppercase tracking-wide text-white",
                description: "text-sm text-gray-400 font-medium",
                actionButton: "bg-white text-black font-bold uppercase text-xs px-4 py-2 hover:bg-gray-200 transition-colors rounded-md",
                cancelButton: "bg-white/10 text-gray-400 hover:text-white font-bold uppercase text-xs px-4 py-2 rounded-md",
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
