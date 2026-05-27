import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Paylaşım Merkezi | Fizikhub",
    description: "Fizikhub'da blog, popüler bilim makaleleri, forum soruları, bilimsel deneyler, kitap incelemeleri veya terim paylaşımları başlatarak bilim topluluğuna katkıda bulun.",
    keywords: [
        "fizik paylaşım",
        "bilim paylaşım",
        "makale yazma",
        "deney paylaşma",
        "kitap inceleme",
        "bilim sözlüğü terim ekleme",
        "fizikhub",
    ],
    alternates: {
        canonical: "https://www.fizikhub.com/paylas",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

export default function PaylasLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return children;
}
