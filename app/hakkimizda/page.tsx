import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";

const ABOUT_DESCRIPTION = "Fizikhub, fiziği sevdirmek ve anlaşılır kılmak amacıyla kurulmuş bir bilim platformudur. Güncel bilim haberleri, detaylı fizik makaleleri ve interaktif araçlar.";

export const metadata: Metadata = {
    title: "Hakkımızda | Fizikhub",
    description: ABOUT_DESCRIPTION,
    openGraph: {
        title: "Hakkımızda — Fizikhub",
        description: "Fizikhub, fiziği sevdirmek ve anlaşılır kılmak amacıyla kurulmuş bir bilim platformudur.",
        type: "website",
        url: "https://www.fizikhub.com/hakkimizda",
    },
    alternates: { canonical: "https://www.fizikhub.com/hakkimizda" },
};

export default function AboutPage() {
    const aboutJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': 'https://www.fizikhub.com/hakkimizda#webpage',
        url: 'https://www.fizikhub.com/hakkimizda',
        name: 'Hakkımızda | Fizikhub',
        description: ABOUT_DESCRIPTION,
        isPartOf: { '@id': 'https://www.fizikhub.com/#website' },
        about: { '@id': 'https://www.fizikhub.com/#organization' },
        inLanguage: 'tr-TR',
    };

    return (
        <>
            <BreadcrumbJsonLd items={[{ name: 'Hakkımızda', href: '/hakkimizda' }]} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
            <div className="container max-w-4xl py-10">
                <h1 className="mb-6 text-3xl font-bold">Hakkımızda</h1>
                <div className="prose dark:prose-invert">
                    <p>
                        Fizikhub, fiziği sevdirmek ve anlaşılır kılmak amacıyla kurulmuş bir platformdur.
                        "Bilimi makaraya sarmak" mottosuyla yola çıktık ve karmaşık fizik konularını
                        herkesin anlayabileceği eğlenceli bir dille anlatmayı hedefliyoruz.
                    </p>
                    <p>
                        Sitemizde güncel bilim haberleri, detaylı fizik makaleleri, soru-cevap forumu
                        ve interaktif araçlar bulabilirsiniz. Amacımız, Türkiye'de fizik okuryazarlığını
                        artırmak ve bilim meraklılarını bir araya getirmektir.
                    </p>
                </div>
            </div>
        </>
    );
}
