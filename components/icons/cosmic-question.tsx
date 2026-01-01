export const CosmicQuestionIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* 1. The Nucleus (Dot of the Question Mark) */}
        <circle cx="12" cy="20" r="2.5" fill="currentColor" />

        {/* 2. The Orbit/Swoosh (Hook of the Question Mark) */}
        {/* A fluid path that looks like an electron orbit but traces a '?' shape */}
        <path
            d="M12 20C12 20 16 18 18 14C20 10 18 6 14 4C10 2 6 4 4 8C3.5 9 12 12 12 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        {/* 3. Secondary Orbit Ring (Background depth) */}
        <ellipse
            cx="12"
            cy="11"
            rx="8"
            ry="3"
            transform="rotate(-20 12 11)"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.4"
        />

        {/* 4. Electron on the ring */}
        <circle cx="18" cy="13" r="1.5" fill="currentColor" />
    </svg>
);
