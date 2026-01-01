export const CosmicQuestionIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* Simple, clean question mark with a subtle orbit ring */}

        {/* The Question Mark - Clean Typography */}
        <path
            d="M9 9C9 7.5 10.5 6 12 6C13.5 6 15 7 15 9C15 11 12 11.5 12 14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        />

        {/* The Dot */}
        <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
);
