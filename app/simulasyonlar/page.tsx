import { type Metadata } from "next";
import { simulations } from "@/components/simulations/data";
import { SimulationsClient } from "@/components/simulations/simulations-client";
import { getSiteUrl } from "@/lib/seo-utils";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buildSimulationCourseListJsonLd } from "@/lib/educational-schema";

export const metadata: Metadata = {
    title: "Fizik Simülasyonları ve İnteraktif Deneyler",
    description: "İnteraktif fizik simülasyonları ile dalga mekaniği, projektil hareketi, optik, sarkaç ve elektrostatik konularını deneyerek öğrenin.",
    keywords: [
        "fizik simülasyonu",
        "interaktif fizik deneyleri",
        "projektil hareketi simülasyonu",
        "optik simülasyonu",
        "sarkaç simülasyonu",
        "dalga mekaniği simülasyonu",
        "online fizik laboratuvarı",
        "fizik öğrenme rotası",
        "kuantum simülasyonu",
        "eğitsel fizik simülasyonları"
    ],
    openGraph: {
        title: "Fizik Simülasyonları ve İnteraktif Deneyler — Fizikhub",
        description: "Projektil hareketi, optik, dalga mekaniği ve sarkaç gibi fizik konularını interaktif simülasyonlarla deneyerek ve parametreleri değiştirerek keşfedin.",
        type: "website",
        url: "https://www.fizikhub.com/simulasyonlar",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Fizik Simülasyonları — Fizikhub" }],
        locale: "tr_TR",
        siteName: "Fizikhub"
    },
    twitter: {
        card: "summary_large_image",
        title: "İnteraktif Fizik Simülasyonları — Fizikhub",
        description: "Fizik kurallarını görsellerle deneyerek, formüllerin arkasındaki mantığı interaktif simülasyonlarla kavrayın.",
        images: ["/og-image.jpg"],
        creator: "@fizikhub"
    },
    alternates: {
        canonical: "https://www.fizikhub.com/simulasyonlar",
        languages: {
            "tr-TR": "https://www.fizikhub.com/simulasyonlar",
            "x-default": "https://www.fizikhub.com/simulasyonlar"
        }
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
        }
    }
};

export default async function SimulasyonlarPage() {
    const baseUrl = getSiteUrl();
    
    // Generate ItemList schema representing all educational simulation tools
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${baseUrl}/simulasyonlar/#collection`,
                url: `${baseUrl}/simulasyonlar`,
                name: "Fizik Simülasyonları ve İnteraktif Deneyler | Fizikhub",
                description: "Rehberli deney rotaları ve interaktif fizik simülasyonlarıyla fizik kurallarını görsel olarak keşfedin.",
                inLanguage: "tr-TR",
                isPartOf: { "@id": `${baseUrl}/#website` },
                mainEntity: { "@id": `${baseUrl}/simulasyonlar/#item-list` },
                publisher: {
                    "@type": "Organization",
                    name: "Fizikhub",
                    url: baseUrl,
                    address: {
                        "@type": "PostalAddress",
                        addressCountry: "TR",
                        addressLocality: "Istanbul"
                    }
                }
            },
            {
                "@type": "ItemList",
                "@id": `${baseUrl}/simulasyonlar/#item-list`,
                name: "Fizikhub İnteraktif Fizik Simülasyonları Listesi",
                itemListElement: simulations.map((sim, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                        "@type": "LearningResource",
                        "@id": `${baseUrl}/simulasyonlar/${sim.slug}#learning-resource`,
                        url: `${baseUrl}/simulasyonlar/${sim.slug}`,
                        name: sim.title,
                        description: sim.description,
                        learningResourceType: "Simulation",
                        interactivityType: "active",
                        educationalLevel: sim.difficulty,
                        teaches: sim.tags,
                        timeRequired: `PT${sim.learning.estimatedMinutes}M`,
                        inLanguage: "tr-TR",
                        isAccessibleForFree: true
                    }
                }))
            },
            buildSimulationCourseListJsonLd(simulations, baseUrl)
        ]
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <BreadcrumbJsonLd
                items={[
                    { name: "Simülasyonlar", href: "/simulasyonlar" }
                ]}
            />
            <SimulationsClient />
        </>
    );
}
