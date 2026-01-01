export const CosmicQuestionIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* 1. The "Pen/Wand" Shaft - Stylized as a particle beam */}
        <path
            d="M4.5 20.5L9.5 15.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        />

        {/* 2. The Cosmic Head/Tip */}
        <path
            d="M13 12L16 9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        />

        {/* 3. The Orbiting Rings around the 'Idea' */}
        <path
            d="M19 5C19 5 21 8 19 11C17 14 13 14 11 12C9 10 9 6 12 4C15 2 19 5 19 5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        {/* 4. Central Core/Singularity of the Idea */}
        <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor" />

        {/* 5. Extra Sparkle/Satellite */}
        <circle cx="21" cy="3" r="1" fill="currentColor" opacity="0.6" />
        <circle cx="8" cy="18" r="0.5" fill="currentColor" opacity="0.4" />
    </svg>
);
