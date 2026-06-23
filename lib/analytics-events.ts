export const SEO_ANALYTICS_EVENTS = {
    landingArticle: "landing_article",
    landingForum: "landing_forum",
    landingDictionary: "landing_dictionary",
    landingQuiz: "landing_quiz",
    landingSimulation: "landing_simulation",
    sourceAiReferral: "source_ai_referral",
    brandQueryLanding: "brand_query_landing",
    acquisitionLanding: "acquisition_landing",
    share: "share",
    signUp: "sign_up",
    login: "login",
    tutorialBegin: "tutorial_begin",
    tutorialComplete: "tutorial_complete",
} as const;

export type SeoAnalyticsEvent = typeof SEO_ANALYTICS_EVENTS[keyof typeof SEO_ANALYTICS_EVENTS];
