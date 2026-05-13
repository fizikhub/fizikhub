import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Yazar Başvurusu | Fizikhub",
    description: "Fizikhub yazar başvuru formu.",
    robots: { index: false, follow: true },
    alternates: {
        canonical: "https://www.fizikhub.com/basvuru/yazar",
    },
};

export default function WriterApplicationLayout({ children }: { children: ReactNode }) {
    return children;
}
