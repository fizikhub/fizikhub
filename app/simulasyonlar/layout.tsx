import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fizik Simülasyonları | Fizikhub",
    description: "İnteraktif fizik simülasyonları ile fiziği deneyerek öğrenin. Projektil hareketi, dalga mekaniği, sarkaç ve daha fazlası.",
    keywords: ["fizik simülasyonu", "interaktif fizik", "projektil hareketi simülasyonu", "fizik deneyleri", "online fizik"],
    openGraph: {
        title: "Fizik Simülasyonları — Fizikhub",
        description: "İnteraktif simülasyonlarla fiziği deneyerek öğrenin. Parametreleri değiştirin, sonuçları gözlemleyin.",
        type: "website",
        url: "https://fizikhub.com/simulasyonlar",
    },
    twitter: {
        card: "summary",
        title: "Fizik Simülasyonları — Fizikhub",
        description: "İnteraktif simülasyonlarla fiziği deneyerek öğrenin.",
    },
    alternates: { canonical: "https://fizikhub.com/simulasyonlar" },
};

export default function SimulasyonlarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
