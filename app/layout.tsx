import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimize font loading
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
  keywords: ["fizik", "bilim", "uzay", "teknoloji", "eğlenceli bilim", "fizikhub", "forum", "soru cevap"],
  authors: [{ name: "Fizikhub Ekibi" }],
  creator: "Fizikhub",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
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
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col pb-16 md:pb-0`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalAdminNotification />
          <NavigationWrapper>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </NavigationWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
