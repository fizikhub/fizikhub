interface CustomRocketIconProps {
    className?: string;
}

export function CustomRocketIcon({ className = "" }: CustomRocketIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 
               Modern Minimalist Rocket Design 
               Designed to work with currentColor for professional theme integration.
            */}

            {/* Main Fuselage & Fins - Unified Shape */}
            <path
                d="M12 2C12 2 15.5 8 16.2 13.5C16.4 15.2 16.5 16 19.5 19C19.8 19.3 19.5 20 19 20H5C4.5 20 4.2 19.3 4.5 19C7.5 16 7.6 15.2 7.8 13.5C8.5 8 12 2 12 2Z"
                fill="currentColor"
            />

            {/* Center Vertical Highlight/Shadow (Negative Space for depth) */}
            <path
                d="M12 4V18"
                stroke="var(--background)"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.2"
                style={{ stroke: 'var(--background)' }} // fallback
            />

            {/* Cockpit Window (Negative Space - showing background color) */}
            <circle
                cx="12"
                cy="10"
                r="2.2"
                fill="var(--background)"
            />
            <circle
                cx="12"
                cy="10"
                r="1.2"
                fill="currentColor"
            />

            {/* Engine Area */}
            <path
                d="M9 20L9.5 21.5C9.7 22.1 10.3 22.5 11 22.5H13C13.7 22.5 14.3 22.1 14.5 21.5L15 20H9Z"
                fill="currentColor"
                opacity="0.8"
            />

            {/* Flame (Only visible via stroke/fill if needed, otherwise part of the main icon) 
                Here adding a separate dynamic flame part 
            */}
            <path
                d="M12 22.5V24.5M10 22L8 24M14 22L16 24"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
            />
        </svg>
    );
}
