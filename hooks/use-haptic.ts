"use client";

import { useCallback } from 'react';

export function useHaptic() {
    const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(pattern);
        }
    }, []);

    return { triggerHaptic };
}
