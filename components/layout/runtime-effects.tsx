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

const EasterEggs = dynamic(
  () => import("@/components/effects/easter-eggs").then((mod) => mod.EasterEggs),
  { ssr: false }
);

type FizikhubWindow = Window & {
  _fizikhubHello?: boolean;
};

export function RuntimeEffects() {
  const [loadIdleEffects, setLoadIdleEffects] = useState(false);
  const [loadDesktopEffects, setLoadDesktopEffects] = useState(false);

  useEffect(() => {
    const fizikhubWindow = window as FizikhubWindow;
    if (process.env.NODE_ENV === "development" && !fizikhubWindow._fizikhubHello) {
      fizikhubWindow._fizikhubHello = true;
      console.log(
        `%c
   ███████╗██╗███████╗██╗██╗  ██╗██╗  ██╗██╗   ██╗██████╗ 
   ██╔════╝██║╚══███╔╝██║██║ ██╔╝██║  ██║██║   ██║██╔══██╗
   █████╗  ██║  ███╔╝ ██║█████╔╝ ███████║██║   ██║██████╔╝
   ██╔══╝  ██║ ███╔╝  ██║██╔═██╗ ██╔══██║██║   ██║██╔══██╗
   ██║     ██║███████╗██║██║  ██╗██║  ██║╚██████╔╝██████╔╝
   ╚═╝     ╚═╝╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ 
        
      🪐 Bilimi Ti'ye Alıyoruz Ama Ciddili Şekilde!
      👨‍💻 Kodları incelemeyi seviyor musun? Aramıza katıl!
        `,
        "color: #EAB308; font-weight: bold; font-family: monospace; font-size: 12px;"
      );
    }

    const enable = () => setLoadIdleEffects(true);
    const enableDesktop = () => {
      if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        setLoadDesktopEffects(true);
      }
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => {
        enable();
        enableDesktop();
      }, { timeout: 3500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeout = setTimeout(() => {
      enable();
      enableDesktop();
    }, 2500);
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
          {loadDesktopEffects ? <EasterEggs /> : null}
        </>
      )}
    </>
  );
}
