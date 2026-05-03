"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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
  const [loadIdleEffects, setLoadIdleEffects] = useState(false);

  useEffect(() => {
    const enable = () => setLoadIdleEffects(true);

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(enable, { timeout: 3500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeout = setTimeout(enable, 2500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!loadIdleEffects || process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // PWA registration must never block the product path.
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, [loadIdleEffects]);

  return (
    <>
      <WebVitalsReporter />
      {loadIdleEffects && (
        <>
          <UserActivityTracker />
          <OnboardingCheck />
        </>
      )}
    </>
  );
}
