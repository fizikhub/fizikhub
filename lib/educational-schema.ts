export type SimulationCourseSource = {
    slug: string;
    title: string;
    description: string;
    difficulty: string;
    tags: string[];
    formula: string;
    learning: {
        estimatedMinutes: number;
        outcome: string;
        prerequisite?: string;
        bigQuestion: string;
    };
};

export function buildSimulationCourseJsonLd(sim: SimulationCourseSource, baseUrl: string) {
    const url = `${baseUrl}/simulasyonlar/${sim.slug}`;

    return {
        "@type": "Course",
        "@id": `${url}#course`,
        name: sim.title,
        description: `${sim.description} Temel formül: ${sim.formula}. Öğrenme hedefi: ${sim.learning.outcome}`,
        url,
        inLanguage: "tr-TR",
        isAccessibleForFree: true,
        provider: {
            "@type": "Organization",
            "@id": `${baseUrl}/#organization`,
            name: "Fizikhub",
            sameAs: baseUrl,
        },
        educationalLevel: sim.difficulty,
        teaches: [...sim.tags, sim.learning.outcome],
        about: sim.tags.map((tag) => ({
            "@type": "Thing",
            name: tag,
        })),
        coursePrerequisites: sim.learning.prerequisite,
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: ["online", "self-paced"],
            courseWorkload: `PT${sim.learning.estimatedMinutes}M`,
            name: `${sim.title} interaktif öğrenme oturumu`,
            description: sim.learning.bigQuestion,
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "TRY",
                category: "free",
                availability: "https://schema.org/InStock",
                url,
            },
        },
    };
}

export function buildSimulationCourseListJsonLd(
    simulations: SimulationCourseSource[],
    baseUrl: string,
) {
    return {
        "@type": "ItemList",
        "@id": `${baseUrl}/simulasyonlar#course-list`,
        name: "Fizikhub çevrimiçi fizik öğrenme modülleri",
        itemListElement: simulations.map((sim, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${baseUrl}/simulasyonlar/${sim.slug}`,
            item: buildSimulationCourseJsonLd(sim, baseUrl),
        })),
    };
}
