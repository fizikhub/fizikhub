interface CustomRocketIconProps {
    className?: string;
}

export function CustomRocketIcon({ className = "" }: CustomRocketIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 
                Custom Rocket Logo
                Replica of the provided neon-style image.
                Composition: Rotated 45deg right structure.
            */}

            {/* We use a group rotated -45deg to draw upright, then rotate to match logic if needed, 
                BUT the image is already diagonal. Let's draw it diagonally directly for best control.
            */}

            {/* Main Body - The large loop pointing top-right */}
            <path d="M13 3 C13 3 8 8 7 13 C6.5 15.5 7.5 18 10 19 C12.5 20 15.5 19 18 17 C22 13 22 8 22 8 C22 8 18 3 13 3 Z" />

            {/* Left Wing - Loop attached to body */}
            <path d="M7.5 12.5 L5 12.5 C3.5 12.5 2.5 13.5 2.5 15 C2.5 16.5 3.5 17.5 5 17.5 L8 16.5" />

            {/* Right Wing / Fin - Loop attached to bottom right of body */}
            <path d="M12 18.5 L12 21 C12 22.5 13 23.5 14.5 23.5 C16 23.5 17 22.5 17 21 L16 18" />

            {/* Flame - Detached loop at bottom left */}
            <path d="M3.5 20.5 C2.5 21.5 2.5 23 3.5 24 C4.5 25 6 25 7 24 C8 23 8 21.5 7 20.5 C6 19.5 4.5 19.5 3.5 20.5 Z" transform="translate(1 -1)" />

        </svg>
    );
}
