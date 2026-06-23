"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    PWA_DISMISSED_AT_KEY,
    PWA_SESSION_COUNT_KEY,
    PWA_SESSION_MARKER_KEY,
    shouldOfferPwaInstall,
} from "@/lib/pwa-install";
import { trackGrowthEvent } from "@/lib/growth-client";

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PwaInstallPrompt() {
    const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let sessionCount = 0;
        try {
            sessionCount = Number(window.localStorage.getItem(PWA_SESSION_COUNT_KEY) || "0");
            if (!window.sessionStorage.getItem(PWA_SESSION_MARKER_KEY)) {
                sessionCount += 1;
                window.sessionStorage.setItem(PWA_SESSION_MARKER_KEY, "1");
                window.localStorage.setItem(PWA_SESSION_COUNT_KEY, String(sessionCount));
            }
        } catch {
            return;
        }

        const handlePrompt = (event: Event) => {
            const promptEvent = event as BeforeInstallPromptEvent;
            promptEvent.preventDefault();
            const dismissedAt = window.localStorage.getItem(PWA_DISMISSED_AT_KEY);
            if (!shouldOfferPwaInstall(sessionCount, dismissedAt)) return;

            setInstallEvent(promptEvent);
            setIsVisible(true);
            trackGrowthEvent("pwa_install_prompt", { session_count: sessionCount });
        };

        const handleInstalled = () => {
            setIsVisible(false);
            setInstallEvent(null);
            trackGrowthEvent("pwa_install", { method: "browser_prompt" });
        };

        window.addEventListener("beforeinstallprompt", handlePrompt);
        window.addEventListener("appinstalled", handleInstalled);
        return () => {
            window.removeEventListener("beforeinstallprompt", handlePrompt);
            window.removeEventListener("appinstalled", handleInstalled);
        };
    }, []);

    const dismiss = () => {
        try {
            window.localStorage.setItem(PWA_DISMISSED_AT_KEY, new Date().toISOString());
        } catch {
            // Dismiss in memory when storage is unavailable.
        }
        setIsVisible(false);
        setInstallEvent(null);
        trackGrowthEvent("pwa_install_dismiss", { method: "not_now" });
    };

    const install = async () => {
        if (!installEvent) return;
        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        trackGrowthEvent(choice.outcome === "accepted" ? "pwa_install" : "pwa_install_dismiss", {
            method: "browser_prompt",
        });
        setIsVisible(false);
        setInstallEvent(null);
    };

    if (!isVisible || !installEvent) return null;

    return (
        <aside
            aria-label="Fizikhub uygulamasını kur"
            className="fixed bottom-20 right-3 z-[90] w-[min(360px,calc(100vw-1.5rem))] rounded-xl border-[3px] border-black bg-[#EAB308] p-4 text-black shadow-[5px_5px_0_0_#000] md:bottom-5 md:right-5"
        >
            <button
                type="button"
                onClick={dismiss}
                aria-label="Kurulum önerisini kapat"
                className="absolute right-2 top-2 rounded-md border-2 border-black bg-white p-1 hover:bg-zinc-100"
            >
                <X className="h-4 w-4" />
            </button>
            <div className="flex gap-3 pr-7">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white">
                    <Download className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-sm font-black uppercase tracking-tight">Fizikhub hep yanında olsun</p>
                    <p className="mt-1 text-xs font-bold leading-relaxed text-black/70">Daha hızlı aç, çevrimdışı sayfaya eriş ve ana ekrandan geri dön.</p>
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <Button type="button" onClick={install} className="h-9 flex-1 border-2 border-black bg-black text-xs font-black uppercase text-white hover:bg-zinc-800">
                    Uygulamayı kur
                </Button>
                <Button type="button" onClick={dismiss} variant="outline" className="h-9 border-2 border-black bg-white text-xs font-black uppercase text-black hover:bg-zinc-100">
                    Şimdi değil
                </Button>
            </div>
        </aside>
    );
}
