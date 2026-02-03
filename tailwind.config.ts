import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "#000000", // Force Black Borders
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "#FFFFFF", // Default White
                foreground: "#000000", // Default Black
                primary: {
                    DEFAULT: "#facc15", // Warning Yellow
                    foreground: "#000000",
                },
                secondary: {
                    DEFAULT: "#8b5cf6", // Quantum Purple
                    foreground: "#ffffff",
                },
                destructive: {
                    DEFAULT: "#FF0000",
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#f4f4f5",
                    foreground: "#71717a",
                },
                accent: {
                    DEFAULT: "#facc15",
                    foreground: "#000000",
                },
                popover: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#000000",
                },
                card: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#000000",
                },
                // Neo-Brutalist Pop Colors
                neo: {
                    yellow: "#FFE500", // Bright Yellow
                    pink: "#FF00D6",   // Hot Pink
                    cyan: "#00FFFF",   // Electric Cyan
                    teal: "#3BB3BD",   // Muted Teal (from Figma)
                    orange: "#FF8800", // Safety Orange
                    green: "#00FF00",  // Lime Green
                    black: "#000000",
                    white: "#FFFFFF",
                    offwhite: "#FDFDFD",
                }
            },
            borderRadius: {
                lg: "12px",
                md: "8px",
                sm: "4px",
                none: "0px",
                full: "9999px",
            },
            borderWidth: {
                DEFAULT: "2px",
                '3': "3px",
                '4': "4px",
            },
            boxShadow: {
                // Hard Shadows (No Blur)
                'neo-xs': '1px 1px 0px 0px #000000',
                'neo-sm': '2px 2px 0px 0px #000000',
                'neo': '4px 4px 0px 0px #000000',
                'neo-lg': '6px 6px 0px 0px #000000',
                'neo-xl': '8px 8px 0px 0px #000000',
                // Interactive (Pressed)
                'neo-pressed': '0px 0px 0px 0px #000000',
                // Color Shadows
                'neo-yellow': '4px 4px 0px 0px #FFE500',
                'neo-pink': '4px 4px 0px 0px #FF00D6',
                'neo-cyan': '4px 4px 0px 0px #00FFFF',
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                heading: ["var(--font-space-grotesk)", "sans-serif"], // Using Space Grotesk for headings
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "shake": {
                    "0%, 100%": { transform: "translateX(0)" },
                    "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
                    "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "shake": "shake 0.4s cubic-bezier(.36,.07,.19,.97) both",
            },
        },
    },
    plugins: [tailwindAnimate],
} satisfies Config;

export default config;
