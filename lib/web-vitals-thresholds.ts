export type WebVitalName = "CLS" | "FCP" | "INP" | "LCP" | "TTFB";
export type WebVitalRating = "good" | "needs-improvement" | "poor";

export const WEB_VITAL_THRESHOLDS: Record<WebVitalName, {
    good: number;
    poor: number;
    unit: "ms" | "score";
    priorityWeight: number;
    seoImpact: string;
}> = {
    LCP: {
        good: 2500,
        poor: 4000,
        unit: "ms",
        priorityWeight: 3,
        seoImpact: "Yükleme deneyimi ve mobil arama performansı için kritik.",
    },
    INP: {
        good: 200,
        poor: 500,
        unit: "ms",
        priorityWeight: 3,
        seoImpact: "Etkileşim gecikmesi ve kullanıcı hissi için kritik.",
    },
    CLS: {
        good: 0.1,
        poor: 0.25,
        unit: "score",
        priorityWeight: 2,
        seoImpact: "Görsel stabilite ve okunabilirlik için önemli.",
    },
    FCP: {
        good: 1800,
        poor: 3000,
        unit: "ms",
        priorityWeight: 1,
        seoImpact: "İlk görünür içerik hızı için destek metrik.",
    },
    TTFB: {
        good: 800,
        poor: 1800,
        unit: "ms",
        priorityWeight: 1,
        seoImpact: "Sunucu yanıtı ve LCP başlangıcı için destek metrik.",
    },
};

export function isWebVitalName(value: string | null | undefined): value is WebVitalName {
    return Boolean(value && value in WEB_VITAL_THRESHOLDS);
}

export function rateWebVital(name: WebVitalName, value: number): WebVitalRating {
    const threshold = WEB_VITAL_THRESHOLDS[name];
    if (value <= threshold.good) return "good";
    if (value < threshold.poor) return "needs-improvement";
    return "poor";
}

export function formatWebVitalValue(name: WebVitalName, value: number | string | null | undefined) {
    const numericValue = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numericValue)) return "-";

    const threshold = WEB_VITAL_THRESHOLDS[name];
    if (threshold.unit === "score") return numericValue.toFixed(3);
    return `${Math.round(numericValue)} ms`;
}

export function webVitalPriorityScore(name: WebVitalName, poorCount: number, needsImprovementCount: number) {
    const threshold = WEB_VITAL_THRESHOLDS[name];
    return (poorCount * 3 + needsImprovementCount) * threshold.priorityWeight;
}
