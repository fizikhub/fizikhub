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
            {/* Main rocket body - sleek futuristic design */}
            <path
                d="M12 2L10 8L8 10L6 12L8 14L10 16L12 22L14 16L16 14L18 12L16 10L14 8L12 2Z"
                fill="currentColor"
                opacity="0.9"
            />

            {/* Window/cockpit */}
            <ellipse
                cx="12"
                cy="9"
                rx="1.5"
                ry="2"
                fill="white"
                opacity="0.3"
            />

            {/* Left wing */}
            <path
                d="M8 12L4 14L6 15L8 14L8 12Z"
                fill="currentColor"
                opacity="0.8"
            />

            {/* Right wing */}
            <path
                d="M16 12L20 14L18 15L16 14L16 12Z"
                fill="currentColor"
                opacity="0.8"
            />

            {/* Engine flames - three exhaust points */}
            <path
                d="M10 20L9.5 22L10 23L10.5 22L10 20Z"
                fill="#ff6b35"
                opacity="0.9"
            />
            <path
                d="M12 21L11.5 23.5L12 24L12.5 23.5L12 21Z"
                fill="#ffa500"
                opacity="0.95"
            />
            <path
                d="M14 20L13.5 22L14 23L14.5 22L14 20Z"
                fill="#ff6b35"
                opacity="0.9"
            />

            {/* Detail lines for texture */}
            <line
                x1="11"
                y1="6"
                x2="11"
                y2="18"
                stroke="white"
                strokeWidth="0.3"
                opacity="0.2"
            />
            <line
                x1="13"
                y1="6"
                x2="13"
                y2="18"
                stroke="white"
                strokeWidth="0.3"
                opacity="0.2"
            />

            {/* Nose cone detail */}
            <path
                d="M12 2L11 5L12 6L13 5L12 2Z"
                fill="white"
                opacity="0.15"
            />
        </svg>
    );
}
