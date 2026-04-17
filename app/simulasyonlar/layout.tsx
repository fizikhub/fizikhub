import { Metadata } from "next";

export const metadata: Metadata = {
    title: "İnteraktif Fizik Simülasyonları | Fizikhub",
    description: "Kuantum mekaniği, optik, dalgalar ve klasik mekanik için interaktif fizik simülasyonları. Formülleri görselleştirerek öğrenin.",
    keywords: ["fizik simülasyonu", "interaktif eğitim", "kuantum simülasyon", "dalga simülasyonu", "fizik deney seti"],
    openGraph: {
        title: "İnteraktif Fizik Simülasyonları — Fizikhub",
        description: "Kuantum mekaniği, optik ve klasik mekanik için interaktif eğitim simülasyonları.",
        type: "website",
        url: "https://www.fizikhub.com/simulasyonlar",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Fizikhub Simülasyonlar" }]
    },
    twitter: {
        card: "summary_large_image",
        title: "İnteraktif Fizik Simülasyonları — Fizikhub",
        description: "Formülleri görselleştirerek interaktif bir şekilde öğrenin.",
        images: ["/og-image.jpg"]
    },
    alternates: {
        canonical: "https://www.fizikhub.com/simulasyonlar"
    }
};

export default function SimulasyonlarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Fizikhub İnteraktif Fizik Simülasyonları",
        "description": "Kuantum mekaniği, optik, dalgalar ve klasik mekanik için interaktif eğitim simülasyonları",
        "url": "https://www.fizikhub.com/simulasyonlar"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
