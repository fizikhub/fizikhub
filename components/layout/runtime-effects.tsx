"use client";

import dynamic from "next/dynamic";

const UserActivityTracker = dynamic(
  () => import("@/components/analytics/user-activity-tracker").then((mod) => mod.UserActivityTracker),
  { ssr: false }
);

const OnboardingCheck = dynamic(
  () => import("@/components/auth/onboarding-check").then((mod) => mod.OnboardingCheck),
  { ssr: false }
);

const WebVitalsReporter = dynamic(
  () => import("@/components/analytics/web-vitals-reporter").then((mod) => mod.WebVitalsReporter),
  { ssr: false }
);

export function RuntimeEffects() {
  return (
    <>
      <UserActivityTracker />
      <OnboardingCheck />
      <WebVitalsReporter />
    </>
  );
}
