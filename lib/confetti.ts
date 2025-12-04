"use client";

import confetti from 'canvas-confetti';

/**
 * Confetti Celebration Utility
 * Creates fun confetti animations for user achievements
 */

export const celebrate = {
    /**
     * Basic confetti burst
     */
    basic: () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    },

    /**
     * First answer celebration - special effect for first contribution
     */
    firstAnswer: () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    },

    /**
     * Badge unlock celebration - emoji confetti
     */
    badgeUnlock: () => {
        const scalar = 2;
        const emoji = confetti.shapeFromText({ text: '🏆', scalar });

        confetti({
            shapes: [emoji],
            particleCount: 30,
            spread: 100,
            origin: { y: 0.6 },
            scalar
        });

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
        }, 200);

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 400);
    },

    /**
     * Level up celebration - fireworks effect
     */
    levelUp: () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });

        fire(0.2, {
            spread: 60,
        });

        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    },

    /**
     * Quick success burst
     */
    success: () => {
        confetti({
            particleCount: 50,
            angle: 90,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#10b981', '#34d399', '#6ee7b7']
        });
    },
};
