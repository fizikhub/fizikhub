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
                background: "hsl(var(--background))", // Dynamic from globals.css
                foreground: "#ffffff",
                primary: {
                    DEFAULT: "#facc15", // Warning Yellow
                    foreground: "#000000",
                },
                secondary: {
                    DEFAULT: "#8b5cf6", // Quantum Purple
                    foreground: "#ffffff",
                },
                card: {
                    DEFAULT: "#1f2937", // Matter
                    foreground: "#ffffff",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "#27272a",
                    foreground: "#a1a1aa",
                },
                accent: {
                    DEFAULT: "#facc15",
                    foreground: "#000000",
                },
                popover: {
                    DEFAULT: "#1f2937",
                    foreground: "#ffffff",
                },
                // Custom Neo-Brutalist Colors
                neo: {
                    yellow: "#facc15",
                    purple: "#8b5cf6",
                    black: "#000000",
                    white: "#FFFFFF",
                    void: "#09090b",
                    matter: "#1f2937"
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                none: "0px",
            },
            borderWidth: {
                DEFAULT: "2px",
                '3': "3px",
            },
            boxShadow: {
                // Neo-Brutalism Shadow Scale (RetroUI inspired, 0 blur)
                'neo-xs': '1px 1px 0px 0px #000000',    // Micro elements
                'neo-sm': '2px 2px 0px 0px #000000',    // Mobile/Compact
                'neo': '4px 4px 0px 0px #000000',    // Default
                'neo-lg': '6px 6px 0px 0px #000000',    // Large components
                'neo-xl': '10px 10px 0px 0px #000000',  // Hero elements
                // Interactive States
                'neo-hover': '2px 2px 0px 0px #000000',
                'neo-active': '0px 0px 0px 0px #000000',
                // Dark Mode Variants
                'neo-dark': '4px 4px 0px 0px #ffffff',
                'neo-white': '4px 4px 0px 0px #ffffff',
                // Colored Shadows (Accent)
                'neo-yellow': '4px 4px 0px 0px #facc15',
                'neo-purple': '4px 4px 0px 0px #8b5cf6',
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                heading: ["var(--font-outfit)", "sans-serif"],
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
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "slide-up": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "slide-down": {
                    "0%": { opacity: "0", transform: "translateY(-10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "orbit": {
                    "0%": {
                        transform: "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
                    },
                    "100%": {
                        transform: "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
                    },
                },
                "meteor": {
                    "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
                    "70%": { opacity: "1" },
                    "100%": {
                        transform: "rotate(215deg) translateX(-500px)",
                        opacity: "0",
                    },
                },
                "border-beam": {
                    "100%": {
                        "offset-distance": "100%",
                    },
                },
                "aurora": {
                    from: {
                        backgroundPosition: "50% 50%, 50% 50%",
                    },
                    to: {
                        backgroundPosition: "350% 50%, 350% 50%",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "shake": "shake 0.4s cubic-bezier(.36,.07,.19,.97) both",
                "fade-in": "fade-in 0.2s ease-out forwards",
                "slide-up": "slide-up 0.2s ease-out",
                "slide-down": "slide-down 0.2s ease-out",
                "orbit": "orbit calc(var(--duration)*1s) linear infinite",
                "meteor": "meteor 5s linear infinite",
                "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
                "aurora": "aurora 60s linear infinite",
            },
        },
    },
    plugins: [tailwindAnimate],
} satisfies Config;

export default config;
