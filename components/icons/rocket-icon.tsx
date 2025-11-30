"use client";

export function RocketIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <style>
                {`
                    @keyframes rocket-float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-3px); }
                    }
                    .rocket-animate {
                        animation: rocket-float 2s ease-in-out infinite;
                        transform-origin: center;
                    }
                    @keyframes flame-flicker {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.6; }
                    }
                    .flame-animate {
                        animation: flame-flicker 0.3s ease-in-out infinite;
                    }
                `}
            </style>
            <g className="rocket-animate">
                {/* Rocket Body */}
                <path
                    d="M12 2L8 10H16L12 2Z"
                    fill="currentColor"
                    className="text-current"
                />
                <path
                    d="M8 10H16V16C16 17.1046 15.1046 18 14 18H10C8.89543 18 8 17.1046 8 16V10Z"
                    fill="currentColor"
                    className="text-current"
                />
                {/* Window */}
                <circle cx="12" cy="13" r="1.5" fill="white" opacity="0.9" />

                {/* Flames */}
                <g className="flame-animate">
                    <path d="M10 18L9 22L10 20Z" fill="#FF6B35" />
                    <path d="M12 18L12 23L12 20Z" fill="#FFA500" />
                    <path d="M14 18L15 22L14 20Z" fill="#FF6B35" />
                </g>

                {/* Wings */}
                <path d="M8 12L5 14L6 11L8 12Z" fill="currentColor" opacity="0.8" />
                <path d="M16 12L19 14L18 11L16 12Z" fill="currentColor" opacity="0.8" />
            </g>
        </svg>
    );
}
