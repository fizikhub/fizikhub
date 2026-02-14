import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
    title: "Hakkımızda | Fizikhub",
    description: "Fizikhub, fiziği sevdirmek ve anlaşılır kılmak amacıyla kurulmuş bir bilim platformudur. Güncel bilim haberleri, detaylı fizik makaleleri ve interaktif araçlar.",
    openGraph: {
        title: "Hakkımızda — Fizikhub",
        description: "Fizikhub, fiziği sevdirmek ve anlaşılır kılmak amacıyla kurulmuş bir bilim platformudur.",
        type: "website",
        url: "https://fizikhub.com/hakkimizda",
    },
    alternates: { canonical: "https://fizikhub.com/hakkimizda" },
};

export default function AboutPage() {
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'FizikHub nedir?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'FizikHub, fiziği sevdirmek ve anlaşılır kılmak amacıyla kurulmuş bir bilim platformudur. Güncel bilim haberleri, fizik makaleleri, soru-cevap forumu ve interaktif araçlar sunar.'
                }
            },
            {
                '@type': 'Question',
                name: 'FizikHub\'da neler yapabilirim?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Soru sorabilir, makale yazabilir, testler çözebilir, bilim sözlüğünü inceleyebilir ve topluluk ile fizik tartışmalarına katılabilirsiniz.'
                }
            },
            {
                '@type': 'Question',
                name: 'FizikHub ücretsiz mi?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Evet, FizikHub tamamen ücretsiz bir bilim platformudur. Tüm içeriklere ve araçlara ücretsiz erişebilirsiniz.'
                }
            }
        ]
    };

    return (
        <>
            <BreadcrumbJsonLd items={[{ name: 'Hakkımızda', href: '/hakkimizda' }]} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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
