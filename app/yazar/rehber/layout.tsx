import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StaticPageJsonLd, buildStaticPageMetadata } from "@/lib/static-page-seo";

const description = "Fizikhub'da bilim ve fizik içerikleri yazmak isteyenler için yayın ilkeleri, editör rehberi, kaynak kullanımı ve içerik hazırlama akışı.";

export const metadata: Metadata = buildStaticPageMetadata({
    path: "/yazar/rehber",
    title: "Fizikhub Yazar Rehberi",
    description,
    keywords: ["Fizikhub yazar rehberi", "bilim yazarlığı", "fizik makalesi yazma", "yayın ilkeleri", "GEO içerik rehberi"],
});

export default function WriterGuideLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <StaticPageJsonLd
                path="/yazar/rehber"
                name="Fizikhub Yazar Rehberi"
                description={description}
                breadcrumbName="Yazar Rehberi"
                type="WebPage"
                mainEntity={{
                    "@type": "CreativeWork",
                    name: "Fizikhub bilim yazarlığı rehberi",
                    about: ["bilim yazarlığı", "fizik makalesi", "kaynak kullanımı", "yayın ilkeleri"],
                    inLanguage: "tr-TR",
                }}
            />
            {children}
        </>
    );
}
