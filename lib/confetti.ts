import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999, // Ensure it's above modals
    };

    function fire(particleRatio: number, opts: confetti.Options) {
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
};

export const triggerSmallConfetti = (x: number, y: number) => {
    // Determine origin relative to window
    const originX = x / window.innerWidth;
    const originY = y / window.innerHeight;

    confetti({
        particleCount: 50,
        spread: 40,
        origin: { x: originX, y: originY },
        colors: ['#22c55e', '#16a34a', '#86efac'], // Greens for success/like
        zIndex: 9999,
        disableForReducedMotion: true
    });
}

export const celebrate = {
    firstAnswer: () => triggerConfetti(),
    badgeUnlock: () => triggerConfetti(),
    levelUp: () => triggerConfetti(),
    success: () => triggerConfetti(),
};
