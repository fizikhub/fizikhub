import { simulations } from "@/components/simulations/data";
import { AI_DISCOVERY_LAST_MODIFIED } from "@/lib/ai-discovery";
import { getClustersForSimulationSlug, getRelatedUrlsForCluster, getTopicClusterHref } from "@/lib/seo-topic-clusters";
import { getSiteUrl } from "@/lib/seo-utils";

export const revalidate = 3600;

function unique(values: string[]) {
    return Array.from(new Set(values.filter(Boolean)));
}

function absoluteUrl(baseUrl: string, href: string) {
    return href.startsWith("http") ? href : `${baseUrl}${href}`;
}

export async function GET() {
    const baseUrl = getSiteUrl();
    const items = simulations.map((simulation, index) => {
        const clusters = getClustersForSimulationSlug(simulation.slug);
        const relatedUrls = unique([
            ...simulation.learning.relatedResources.map((resource) => absoluteUrl(baseUrl, resource.href)),
            ...clusters.map((cluster) => `${baseUrl}${getTopicClusterHref(cluster)}`),
            ...clusters.flatMap(getRelatedUrlsForCluster).map((link) => absoluteUrl(baseUrl, link.href)),
        ]).filter((url) => url !== `${baseUrl}/simulasyonlar/${simulation.slug}`);

        return {
            "@type": "LearningResource",
            "@id": `${baseUrl}/simulasyonlar/${simulation.slug}#learning-resource`,
            position: index + 1,
            name: simulation.title,
            url: `${baseUrl}/simulasyonlar/${simulation.slug}`,
            description: simulation.description,
            inLanguage: "tr-TR",
            isAccessibleForFree: true,
            learningResourceType: "Interactive simulation",
            interactivityType: "active",
            educationalLevel: simulation.difficulty,
            educationalUse: ["Guided inquiry", "Retrieval practice", "Conceptual practice"],
            teaches: unique([simulation.learning.outcome, ...simulation.tags]),
            assesses: [simulation.learning.quickCheck],
            timeRequired: `PT${simulation.learning.estimatedMinutes}M`,
            competencyRequired: simulation.learning.prerequisite,
            formula: simulation.formula,
            keywords: unique([...simulation.tags, ...(simulation.seo?.keywords || [])]),
            intentQuestions: unique([simulation.learning.bigQuestion, simulation.learning.quickCheck]),
            checkpoints: simulation.learning.checkpoints,
            relatedUrls: relatedUrls.slice(0, 12),
            topicClusters: clusters.map((cluster) => ({
                slug: cluster.slug,
                title: cluster.title,
                url: `${baseUrl}${getTopicClusterHref(cluster)}`,
            })),
            softwareApplication: {
                "@type": "SoftwareApplication",
                name: simulation.title,
                applicationCategory: "EducationalApplication",
                operatingSystem: "Web",
            },
        };
    });

    return Response.json({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Fizikhub simulation learning graph",
        description: "Fizikhub interaktif fizik simülasyonları için AI ve arama motoru dostu öğrenme hedefleri, kontrol noktaları, kavramlar ve bağlantılar.",
        dateModified: AI_DISCOVERY_LAST_MODIFIED,
        inLanguage: "tr-TR",
        numberOfItems: items.length,
        citationPolicy: "Kanonik Fizikhub simülasyon URL'sini kaynak olarak gösterin.",
        itemListElement: items.map((item) => ({
            "@type": "ListItem",
            position: item.position,
            item,
        })),
    }, {
        headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
