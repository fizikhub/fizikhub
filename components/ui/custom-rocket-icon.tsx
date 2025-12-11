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
            <defs>
                {/* Gradient for 3D body effect */}
                <linearGradient id="rocketBodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
                </linearGradient>

                {/* Gradient for nose cone */}
                <linearGradient id="noseConeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
                </linearGradient>

                {/* Gradient for flames */}
                <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffeb3b" />
                    <stop offset="40%" stopColor="#ff9800" />
                    <stop offset="100%" stopColor="#ff5722" />
                </linearGradient>
            </defs>

            {/* Left fin - classic rocket fin shape */}
            <path
                d="M8 13 L4 17 L4 18 L8 16 Z"
                fill="url(#rocketBodyGradient)"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.9"
            />

            {/* Right fin - classic rocket fin shape */}
            <path
                d="M16 13 L20 17 L20 18 L16 16 Z"
                fill="url(#rocketBodyGradient)"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.9"
            />

            {/* Main rocket body - cylindrical with proper proportions */}
            <path
                d="M10 7 L10 18 C10 18.5 10.5 19 11 19 L13 19 C13.5 19 14 18.5 14 18 L14 7 Z"
                fill="url(#rocketBodyGradient)"
                stroke="currentColor"
                strokeWidth="0.4"
            />

            {/* Nose cone - pointed tip */}
            <path
                d="M12 2 L10 7 L14 7 Z"
                fill="url(#noseConeGradient)"
                stroke="currentColor"
                strokeWidth="0.4"
            />

            {/* Window/porthole - round with glass effect */}
            <circle
                cx="12"
                cy="10"
                r="1.3"
                fill="#87ceeb"
                opacity="0.7"
                stroke="currentColor"
                strokeWidth="0.3"
            />
            <circle
                cx="12"
                cy="10"
                r="1.3"
                fill="url(#noseConeGradient)"
                opacity="0.15"
            />

            {/* Detail band/stripe on body */}
            <rect
                x="10"
                y="13"
                width="4"
                height="0.8"
                fill="currentColor"
                opacity="0.3"
                rx="0.2"
            />

            {/* Engine nozzle base */}
            <path
                d="M10 18.5 L10 19.5 L14 19.5 L14 18.5 Z"
                fill="currentColor"
                opacity="0.5"
            />

            {/* Rocket fire/exhaust - layered flames */}
            {/* Outer flame layer - red/orange */}
            <path
                d="M10.5 19.5 L9.5 21.5 L10 23 L10.5 21.5 Z"
                fill="url(#flameGradient)"
                opacity="0.8"
            />
            <path
                d="M13.5 19.5 L14.5 21.5 L14 23 L13.5 21.5 Z"
                fill="url(#flameGradient)"
                opacity="0.8"
            />

            {/* Main center flame - brightest */}
            <path
                d="M11.5 19.5 L11 22 L11.5 24 L12 22 Z"
                fill="url(#flameGradient)"
                opacity="0.95"
            />
            <path
                d="M12.5 19.5 L13 22 L12.5 24 L12 22 Z"
                fill="url(#flameGradient)"
                opacity="0.95"
            />

            {/* Inner white-hot flame core */}
            <ellipse
                cx="12"
                cy="20.5"
                rx="0.8"
                ry="1.5"
                fill="#fff9c4"
                opacity="0.9"
            />

            {/* Highlight on body for 3D depth */}
            <ellipse
                cx="11"
                cy="12"
                rx="0.5"
                ry="3"
                fill="white"
                opacity="0.15"
            />
        </svg>
    );
}
