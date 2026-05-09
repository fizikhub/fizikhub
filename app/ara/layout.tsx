import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Arama | Fizikhub",
    description: "Fizikhub içinde makale, forum sorusu, sözlük terimi, test ve simülasyon ara.",
    alternates: {
        canonical: "https://www.fizikhub.com/ara",
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

export default function SearchLayout({ children }: { children: ReactNode }) {
    return children;
}
