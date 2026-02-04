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
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    hover: "hsl(var(--primary-hover))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    hover: "hsl(var(--secondary-hover))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
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
                // RetroUI Logic: Override defaults with hard shadows
                sm: "var(--shadow-sm)",
                DEFAULT: "var(--shadow)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
                xl: "var(--shadow-xl)",
                '2xl': "var(--shadow-2xl)",

                // Existing Custom
                'neo-xs': '1px 1px 0px 0px #000000',
                'neo-sm': '2px 2px 0px 0px #000000',
                'neo': '4px 4px 0px 0px #000000',
                'neo-lg': '6px 6px 0px 0px #000000',
                'neo-xl': '10px 10px 0px 0px #000000',
                'neo-hover': '2px 2px 0px 0px #000000',
                'neo-active': '0px 0px 0px 0px #000000',
                'neo-dark': '4px 4px 0px 0px #ffffff',
            },
            fontFamily: {
                sans: ["var(--font-sans)", "sans-serif"],
                heading: ["var(--font-head)", "sans-serif"],
                head: ["var(--font-head)", "sans-serif"], // RetroUI alias
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
