import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
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
    default: "Fizikhub | Eğlenceli Bilim Platformu",
    template: "%s | Fizikhub"
  },
  description: "Sıkıcı bilim sitelerinden sıkıldın mı? Fizik, uzay ve bilim dünyasına eğlenceli bir yolculuk için doğru yerdesin.",
  keywords: [
    "fizik", "bilim", "uzay", "teknoloji", "eğlenceli bilim", "fizikhub", "forum", "soru cevap",
    "TYT Fizik", "AYT Fizik", "YKS Fizik", "Bilimsel Tartışma", "Popüler Bilim", "Fizik Soru Çözümü"
  ],
  authors: [{ name: "Fizikhub Ekibi" }],
  creator: "Fizikhub",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://fizikhub.com",
    title: "Fizikhub | Eğlenceli Bilim",
    description: "Sıkıcı bilim sitelerinden sıkıldın mı? Fizik, uzay ve bilim dünyasına eğlenceli bir yolculuk için doğru yerdesin.",
    siteName: "Fizikhub",
    images: [
      {
        url: "/og-image.png", // We should create this or use a default
        width: 1200,
        height: 630,
        alt: "Fizikhub - Eğlenceli Bilim Platformu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fizikhub | Eğlenceli Bilim",
    description: "Sıkıcı bilim sitelerinden sıkıldın mı? Fizik, uzay ve bilim dünyasına eğlenceli bir yolculuk için doğru yerdesin.",
    creator: "@fizikhub",
    images: ["/og-image.png"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} font-sans min-h-screen flex flex-col pb-16 md:pb-0`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalAdminNotification />

          <NavigationWrapper>
            {children}
          </NavigationWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
