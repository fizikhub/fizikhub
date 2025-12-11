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
                Professional Custom Rocket Icon v3
                Style: Modern, Tech, Aerodynamic
                Characteristics: Sharp angles, negative space, sleek profile
            */}

            <g transform="rotate(-45 12 12)">
                {/* Main Body - Split Design for Tech Feel */}
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C12 2 16 9 16.5 15C16.634 16.6075 16 20 16 20L12 18L8 20C8 20 7.36603 16.6075 7.5 15C8 9 12 2 12 2Z"
                    fill="currentColor"
                />

                {/* Center Groove / Detail Line (Negative space) */}
                <path
                    d="M12 5V14"
                    stroke="var(--background)"
                    strokeWidth="1"
                    strokeLinecap="round"
                />

                {/* Cockpit / Tech Node */}
                <circle cx="12" cy="11" r="1.5" fill="var(--background)" />
                <circle cx="12" cy="11" r="0.8" fill="currentColor" />

                {/* Aerodynamic Fins - Sharp and angular */}
                <path
                    d="M7.5 14L4 17.5L5.5 19L8 18"
                    fill="currentColor"
                    fillOpacity="0.8"
                />
                <path
                    d="M16.5 14L20 17.5L18.5 19L16 18"
                    fill="currentColor"
                    fillOpacity="0.8"
                />

                {/* Propulsion / Exhaust */}
                <path
                    d="M12 18V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M10 19.5L9 21.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.6"
                />
                <path
                    d="M14 19.5L15 21.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.6"
                />
            </g>
        </svg>
    );
}
