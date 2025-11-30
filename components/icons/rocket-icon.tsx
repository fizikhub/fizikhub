"use client";

import { motion } from "framer-motion";

export function RocketIcon({ className }: { className?: string }) {
    return (
        <motion.div
            className={className}
            animate={{
                scale: [1, 1.05, 1],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
            >
                {/* Hexagon Background */}
                <path
                    d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
                    fill="currentColor"
                    className="opacity-20"
                />

                {/* Inner Hexagon */}
                <path
                    d="M12 4L18 8V16L12 20L6 16V8L12 4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    className="opacity-60"
                />

                {/* Star/Sparkle in center */}
                <motion.g
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        rotate: {
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        },
                        scale: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                    }}
                >
                    <path
                        d="M12 7L13 11H17L14 13.5L15 17.5L12 15L9 17.5L10 13.5L7 11H11L12 7Z"
                        fill="currentColor"
                    />
                </motion.g>

                {/* Corner accents */}
                <circle cx="12" cy="3" r="1" fill="currentColor" className="opacity-40" />
                <circle cx="19" cy="7.5" r="1" fill="currentColor" className="opacity-40" />
                <circle cx="19" cy="16.5" r="1" fill="currentColor" className="opacity-40" />
                <circle cx="12" cy="21" r="1" fill="currentColor" className="opacity-40" />
                <circle cx="5" cy="16.5" r="1" fill="currentColor" className="opacity-40" />
                <circle cx="5" cy="7.5" r="1" fill="currentColor" className="opacity-40" />
            </svg>
        </motion.div>
    );
}
