import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Paylaşım Merkezi",
    description: "Fizikhub'da blog, soru, deney, kitap incelemesi veya terim paylaşımı başlat.",
    alternates: {
        canonical: "/paylas",
    },
    robots: {
        index: false,
        follow: true,
        googleBot: {
            index: false,
            follow: true,
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
