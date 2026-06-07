import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";

const SITE_URL = "https://www.fizikhub.com";
const DEFAULT_IMAGE = "/og-image.jpg";
const DEFAULT_MODIFIED = "2026-06-02T00:00:00.000+03:00";

type StaticMetadataOptions = {
    path: string;
    title: string;
    description: string;
    keywords?: string[];
    index?: boolean;
    image?: string;
};

type StaticJsonLdOptions = {
    path: string;
    name: string;
    description: string;
    breadcrumbName?: string;
    type?: "AboutPage" | "CollectionPage" | "ContactPage" | "ProfilePage" | "WebPage";
    dateModified?: string;
    mainEntity?: Record<string, unknown>;
};

export function buildStaticPageMetadata({
    path,
    title,
    description,
    keywords = [],
    index = true,
    image = DEFAULT_IMAGE,
}: StaticMetadataOptions): Metadata {
    const canonical = `${SITE_URL}${path}`;

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical,
            languages: {
                "tr-TR": canonical,
                "x-default": canonical,
            },
        },
        openGraph: {
            type: "website",
            locale: "tr_TR",
            url: canonical,
            title: `${title} - Fizikhub`,
            description,
            siteName: "Fizikhub",
            images: [{ url: image, width: 1200, height: 630, alt: `${title} - Fizikhub` }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} - Fizikhub`,
            description,
            images: [image],
        },
        robots: {
            index,
            follow: true,
            googleBot: {
                index,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        },
    };
}

export function StaticPageJsonLd({
    path,
    name,
    description,
    breadcrumbName = name,
    type = "WebPage",
    dateModified = DEFAULT_MODIFIED,
    mainEntity,
}: StaticJsonLdOptions) {
    const url = `${SITE_URL}${path}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": type,
                "@id": `${url}#webpage`,
                url,
                name,
                description,
                inLanguage: "tr-TR",
                isPartOf: { "@id": `${SITE_URL}/#website` },
                publisher: { "@id": `${SITE_URL}/#organization` },
                dateModified,
                ...(mainEntity ? { mainEntity } : {}),
            },
        ],
    };

    return (
        <>
            <BreadcrumbJsonLd items={[{ name: breadcrumbName, href: path }]} />
            <JsonLd data={jsonLd} />
        </>
    );
}
