/**
 * Haptic Feedback Utility
 * Provides tactile feedback on mobile devices (if supported)
 */

export const haptics = {
    /**
     * Light impact - for subtle interactions (like button taps)
     */
    light: () => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(10);
        }
    },

    /**
     * Medium impact - for standard interactions (like selections)
     */
    medium: () => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(20);
        }
    },

    /**
     * Heavy impact - for significant interactions (like confirmations)
     */
    heavy: () => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(30);
        }
    },

    /**
     * Success pattern - for successful actions
     */
    success: () => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([10, 50, 10]);
        }
    },

    /**
     * Error pattern - for failed actions
     */
    error: () => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([30, 50, 30, 50, 30]);
        }
    },

    /**
     * Selection pattern - for making selections
     */
    selection: () => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(5);
        }
    },
};
