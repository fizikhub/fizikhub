"use client";

import { useCallback } from "react";

// Web Audio API context
let audioContext: AudioContext | null = null;

const createAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
};

export function useUiSounds() {
    // A subtle pop sound for clicking buttons like tags, small actions
    const playPop = useCallback(() => {
        try {
            const ctx = createAudioContext();
            if (!ctx) return;

            // Resume context if needed (browsers require user interaction first)
            if (ctx.state === "suspended") {
                ctx.resume();
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            // A quick sweep down in frequency gives a nice "pop" or "bloop"
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

            // Envelope to make it short and snappy
            gain.gain.setValueAtTime(0.0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            // Ignore if audio isn't supported or allowed yet
        }
    }, []);

    // A crisp click sound for important actions like voting, submitting
    const playClick = useCallback(() => {
        try {
            const ctx = createAudioContext();
            if (!ctx) return;

            if (ctx.state === "suspended") {
                ctx.resume();
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "square"; // harsher tone for a click
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);

            // Very short envelope
            gain.gain.setValueAtTime(0.0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {
            // Ignore
        }
    }, []);

    // Haptic vibration
    const vibrate = useCallback((pattern: number | number[] = 15) => {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore
            }
        }
    }, []);

    // Combined sensory interaction for major buttons (like/upvote)
    const playInteractSound = useCallback(() => {
        playClick();
        vibrate(15);
    }, [playClick, vibrate]);

    return { playPop, playClick, vibrate, playInteractSound };
}
