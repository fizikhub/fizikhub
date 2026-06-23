export const PWA_SESSION_COUNT_KEY = "fizikhub:pwa-session-count:v1";
export const PWA_SESSION_MARKER_KEY = "fizikhub:pwa-session-seen:v1";
export const PWA_DISMISSED_AT_KEY = "fizikhub:pwa-dismissed-at:v1";
export const PWA_DISMISS_DAYS = 30;

export function shouldOfferPwaInstall(sessionCount: number, dismissedAt: string | null, now = new Date()) {
    if (sessionCount < 2) return false;
    if (!dismissedAt) return true;

    const dismissedTime = Date.parse(dismissedAt);
    if (Number.isNaN(dismissedTime)) return true;
    return now.getTime() - dismissedTime >= PWA_DISMISS_DAYS * 24 * 60 * 60 * 1000;
}
