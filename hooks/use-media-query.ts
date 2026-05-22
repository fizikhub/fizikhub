import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
    const subscribe = (callback: () => void) => {
        if (typeof window === "undefined") return () => {};
        const matchMedia = window.matchMedia(query);
        matchMedia.addEventListener("change", callback);
        return () => matchMedia.removeEventListener("change", callback);
    };

    const getSnapshot = () => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(query).matches;
    };

    const getServerSnapshot = () => {
        return false;
    };

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
