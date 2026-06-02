import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StaticPageJsonLd, buildStaticPageMetadata } from "@/lib/static-page-seo";

const description = "Fizikhub'da blog, popüler bilim makaleleri, forum soruları, bilimsel deneyler, kitap incelemeleri veya terim paylaşımları başlatarak bilim topluluğuna katkıda bulun.";

export const metadata: Metadata = buildStaticPageMetadata({
    path: "/paylas",
    title: "Paylaşım Merkezi",
    description,
    keywords: [
        "fizik paylaşım",
        "bilim paylaşım",
        "makale yazma",
        "deney paylaşma",
        "kitap inceleme",
        "bilim sözlüğü terim ekleme",
        "fizikhub",
    ],
});

export default function PaylasLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <>
            <StaticPageJsonLd
                path="/paylas"
                name="Fizikhub Paylaşım Merkezi"
                description={description}
                breadcrumbName="Paylaşım Merkezi"
                type="CollectionPage"
                mainEntity={{
                    "@type": "ItemList",
                    name: "Fizikhub paylaşım türleri",
                    itemListElement: [
                        "Blog ve makale",
                        "Forum sorusu",
                        "Bilimsel deney",
                        "Kitap incelemesi",
                        "Bilim sözlüğü terimi",
                    ].map((name, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        name,
                    })),
                }}
            />
            {children}
        </>
    );
}
