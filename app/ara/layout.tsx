import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ara | Fizikhub",
    description: "Fizikhub'da fizik makaleleri, simülasyonlar, forum başlıkları ve sözlük terimlerinde detaylı arama yapın.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function AraLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://www.fizikhub.com/",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.fizikhub.com/ara?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
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
