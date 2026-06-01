import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Fizikhub Yazar Rehberi",
    description: "Fizikhub'da bilim ve fizik içerikleri yazmak isteyenler için yayın ilkeleri, editör rehberi ve içerik hazırlama akışı.",
    alternates: {
        canonical: "https://www.fizikhub.com/yazar/rehber",
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

export default function WriterGuideLayout({ children }: { children: ReactNode }) {
    return children;
}
