export const SEO_ANALYTICS_EVENTS = {
    landingArticle: "landing_article",
    landingForum: "landing_forum",
    landingDictionary: "landing_dictionary",
    landingQuiz: "landing_quiz",
    landingSimulation: "landing_simulation",
    sourceAiReferral: "source_ai_referral",
    brandQueryLanding: "brand_query_landing",
} as const;

export type SeoAnalyticsEvent = typeof SEO_ANALYTICS_EVENTS[keyof typeof SEO_ANALYTICS_EVENTS];
