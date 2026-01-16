import { cn } from "@/lib/utils";

interface CustomBadgeIconProps {
    name: string;
    className?: string;
}

export function CustomBadgeIcon({ name, className }: CustomBadgeIconProps) {
    const normalizedName = name.toLowerCase();

    // Einstein/Bilim Badge (Refined)
    if (normalizedName.includes("einstein") || normalizedName.includes("bilim")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="10" fill="url(#grad-einstein)" className="opacity-20" />
                <defs>
                    <linearGradient id="grad-einstein" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FCD34D" />
                        <stop offset="1" stopColor="#F59E0B" />
                    </linearGradient>
                </defs>
                <path d="M4 10C4 6 7 3 12 3C17 3 20 6 20 10C21 11 22 13 21 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/80" />
                <path d="M6 10C6 10 6 18 12 18C18 18 18 10 18 10" fill="currentColor" className="text-amber-200/90" />
                <path d="M9 14C10 13.5 11 14 12 14C13 14 14 13.5 15 14" stroke="#000" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                <circle cx="9" cy="11" r="1.5" fill="#333" />
                <circle cx="15" cy="11" r="1.5" fill="#333" />
            </svg>
        );
    }

    // Newton Badge (Refined)
    if (normalizedName.includes("newton") || normalizedName.includes("elma") || normalizedName.includes("yerçekimi")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <defs>
                    <linearGradient id="grad-newton" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6EE7B7" />
                        <stop offset="1" stopColor="#10B981" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" fill="url(#grad-newton)" className="opacity-10" />

                {/* Wig/Hair outline */}
                <path d="M6 18C5 16 5 13 6 11C6 7 9 4 12 4C15 4 18 7 18 11C19 13 19 16 18 18" fill="currentColor" className="text-zinc-300" />

                {/* Face */}
                <path d="M8 12C8 12 8 19 12 19C16 19 16 12 16 12" fill="currentColor" className="text-amber-100" />

                {/* Apple */}
                <g className="animate-bounce" style={{ animationDuration: '3s' }}>
                    <circle cx="18" cy="8" r="3" fill="#EF4444" />
                    <path d="M18 5V4" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M18 5L20 3" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
                </g>
            </svg>
        );
    }

    // Tesla Badge (Refined)
    if (normalizedName.includes("tesla") || normalizedName.includes("elektrik") || normalizedName.includes("enerji")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <defs>
                    <linearGradient id="grad-tesla" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#60A5FA" />
                        <stop offset="1" stopColor="#2563EB" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" fill="url(#grad-tesla)" className="opacity-10" />

                {/* Lightning Background */}
                <path d="M11 2L9 9H13L11 22L20 10H15L18 2" fill="currentColor" className="text-blue-500/20" />

                {/* Face Silhouette */}
                <path d="M8 10C8 7 10 5 12 5C14 5 16 7 16 10V18H8V10Z" fill="currentColor" className="text-slate-200" />
                <path d="M10.5 14H13.5" stroke="currentColor" strokeWidth="1" className="text-slate-400" /> {/* Mustache hint */}
                <path d="M12 5V8" stroke="currentColor" strokeWidth="1" className="text-slate-400" /> {/* Center part */}

                {/* Flash */}
                <path d="M16 12L19 6L21 9" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
            </svg>
        );
    }

    // Curie Badge (Refined)
    if (normalizedName.includes("curie") || normalizedName.includes("radyoaktif")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="10" fill="#A855F7" className="opacity-10" />
                {/* Flask */}
                <path d="M12 4V10L17 19H7L12 10" fill="currentColor" className="text-purple-500/30" />
                <path d="M12 4V10L17 19H7L12 10" stroke="currentColor" strokeWidth="1.5" className="text-purple-300" strokeLinejoin="round" />
                {/* Bubbles */}
                <circle cx="12" cy="16" r="2" fill="#4ADE80" className="animate-pulse" />
                <circle cx="10" cy="18" r="1" fill="#4ADE80" className="animate-ping" style={{ animationDuration: '2s' }} />
                <circle cx="14" cy="14" r="1" fill="#4ADE80" />
                {/* Glow */}
                <circle cx="12" cy="19" r="6" stroke="#4ADE80" strokeWidth="0.5" strokeDasharray="2 2" className="animate-spin-slow opacity-50" />
            </svg>
        );
    }

    // Galileo Badge (Refined)
    if (normalizedName.includes("galileo") || normalizedName.includes("teleskop")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="10" fill="#0F172A" className="opacity-30" />
                {/* Telescope */}
                <rect x="8" y="8" width="8" height="12" transform="rotate(-45 12 14)" rx="2" fill="currentColor" className="text-slate-400" />
                <path d="M16 8L18 6" stroke="currentColor" strokeWidth="3" className="text-amber-600" />
                <path d="M6 18L4 22M6 18L8 22" stroke="currentColor" strokeWidth="1.5" className="text-amber-800" />

                {/* Stars */}
                <circle cx="18" cy="6" r="1.5" fill="#FCD34D" />
                <circle cx="20" cy="9" r="1" fill="white" />
                <circle cx="15" cy="4" r="0.5" fill="white" />
            </svg>
        );
    }

    // Hawking Badge (Refined)
    if (normalizedName.includes("hawking") || normalizedName.includes("kara delik")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                {/* Black Circle Body */}
                <circle cx="12" cy="12" r="8" fill="black" />
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="0.5" className="text-indigo-500" />

                {/* Accretion Disk */}
                <ellipse cx="12" cy="12" rx="10" ry="3" stroke="url(#hawking-grad)" strokeWidth="1.5" transform="rotate(-15 12 12)" />
                <defs>
                    <linearGradient id="hawking-grad">
                        <stop stopColor="#818CF8" />
                        <stop offset="1" stopColor="#C084FC" />
                    </linearGradient>
                </defs>

                {/* Wheelchair Symbol (Simplified) */}
                <path d="M11 16H13M12 16V14M12 14L10 11M12 14L14 11" stroke="white" strokeWidth="1" strokeLinecap="round" />
            </svg>
        );
    }

    // Da Vinci Badge (Refined)
    if (normalizedName.includes("vinci") || normalizedName.includes("sanat")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="10" fill="#78350F" className="opacity-10" />
                {/* Vitruvian Overlay */}
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="0.5" className="text-amber-700/60" />
                <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="0.5" className="text-amber-700/60" />

                {/* Figure */}
                <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1.5" className="text-amber-600" />
                <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="1" className="text-amber-600/50" />
            </svg>
        );
    }

    // Kaşif/Explorer Badge (Refined Compass)
    if (normalizedName.includes("kaşif") || normalizedName.includes("explorer")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="10" fill="#F59E0B" className="opacity-10" />
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                <circle cx="12" cy="12" r="2" fill="currentColor" className="text-amber-300" />
                <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-600" />
                <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-600" />
                <path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-600" />
                <path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-600" />
                {/* Needle */}
                <path d="M12 12L15 6L12 12L9 18L12 12Z" fill="#EF4444" />
                <path d="M12 12L9 18L12 12L15 6L12 12Z" stroke="white" strokeWidth="0.5" />
            </svg>
        );
    }

    // Writer Badge (Refined Quill)
    if (normalizedName.includes("yazar") || normalizedName.includes("kalem") || normalizedName.includes("içerik")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M19.5 3.5L18 8L15 8.5L14 13L10 17L8 20L6 20.5L6.5 18L9 15L13 13L14.5 9.5L19.5 3.5Z" fill="currentColor" className="text-white" />
                <path d="M19.5 3.5L18 8L15 8.5L14 13L10 17L8 20L6 20.5L6.5 18L9 15L13 13L14.5 9.5L19.5 3.5Z" stroke="currentColor" strokeWidth="1" className="text-indigo-200" />
                <path d="M6 20.5L4 22" stroke="currentColor" strokeWidth="2" className="text-indigo-400" />
                <circle cx="13" cy="13" r="6" stroke="currentColor" strokeWidth="1" className="text-white/20" strokeDasharray="2 2" />
            </svg>
        );
    }

    // Rank Badges - Evrensel Zeka (Universal Mind)
    if (normalizedName.includes("evrensel")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="9" fill="url(#grad-evrensel)" />
                <defs>
                    <linearGradient id="grad-evrensel" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#38BDF8" />
                        <stop offset="1" stopColor="#0EA5E9" />
                    </linearGradient>
                </defs>
                <path d="M12 3V21M3 12H21" stroke="white" strokeWidth="1" opacity="0.5" />
                <circle cx="12" cy="12" r="4" fill="white" className="mix-blend-overlay" />
                <circle cx="12" cy="12" r="2" fill="white" />
                <path d="M12 6A6 6 0 0 1 18 12" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
        );
    }

    if (normalizedName.includes("teorisyen")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 2L22 8V16L12 22L2 16V8L12 2Z" fill="url(#grad-teorisyen)" />
                <defs>
                    <linearGradient id="grad-teorisyen" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F59E0B" />
                        <stop offset="1" stopColor="#D97706" />
                    </linearGradient>
                </defs>
                <path d="M12 6L17 9V15L12 18L7 15V9L12 6Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.6" />
                <circle cx="12" cy="12" r="2" fill="white" />
            </svg>
        );
    }

    if (normalizedName.includes("araştırmacı")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="9" fill="#A855F7" opacity="0.2" />
                <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" className="text-purple-500" />
                <path d="M16 16L19 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-purple-500" />
                <path d="M10 10H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-purple-400" />
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-purple-400" />
            </svg>
        );
    }

    if (normalizedName.includes("gözlemci")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 5C5 5 2 12 2 12C2 12 5 19 12 19C19 19 22 12 22 12C22 12 19 5 12 5Z" fill="#3B82F6" opacity="0.2" />
                <path d="M12 5C5 5 2 12 2 12C2 12 5 19 12 19C19 19 22 12 22 12C22 12 19 5 12 5Z" stroke="currentColor" strokeWidth="2" className="text-blue-500" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3.5" fill="currentColor" className="text-blue-400" />
                <circle cx="13" cy="11" r="1" fill="white" />
            </svg>
        );
    }

    if (normalizedName.includes("çaylak") || normalizedName.includes("meraklı")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="#22C55E" opacity="0.1" />
                <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="currentColor" strokeWidth="2" className="text-green-500" />
                <path d="M12 15V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-green-600" />
                <circle cx="12" cy="8" r="1.5" fill="currentColor" className="text-green-600" />
            </svg>
        );
    }

    // Point-based Badges
    if (normalizedName.includes("yıldız tozu") || normalizedName.includes("stardust")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 2L14.5 8.5L21 9L16 13.5L17.5 20L12 16.5L6.5 20L8 13.5L3 9L9.5 8.5L12 2Z" fill="url(#star-gradient-dust)" stroke="#B45309" strokeWidth="0.5" />
                <defs>
                    <linearGradient id="star-gradient-dust" x1="12" y1="2" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FDE68A" />
                        <stop offset="1" stopColor="#F59E0B" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }

    if (normalizedName.includes("kuyruklu yıldız") || normalizedName.includes("comet")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M20 4L16 8L12 12" stroke="url(#comet-trail)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                    <linearGradient id="comet-trail" x1="20" y1="4" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#60A5FA" />
                        <stop offset="1" stopColor="transparent" />
                    </linearGradient>
                </defs>
                <circle cx="19" cy="5" r="3" fill="#3B82F6" />
                <circle cx="19" cy="5" r="1.5" fill="white" />
            </svg>
        );
    }

    if (normalizedName.includes("galaksi") || normalizedName.includes("galaxy")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <radialGradient id="galaxy-core" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12) rotate(90) scale(8)">
                    <stop stopColor="#C084FC" />
                    <stop offset="0.6" stopColor="#7C3AED" />
                    <stop offset="1" stopColor="transparent" />
                </radialGradient>
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" stroke="currentColor" strokeWidth="0.5" className="text-purple-500 animate-[spin_20s_linear_infinite]" strokeDasharray="4 4" />
                <ellipse cx="12" cy="12" rx="9" ry="3" fill="url(#galaxy-core)" transform="rotate(-30 12 12)" className="opacity-70" />
                <circle cx="12" cy="12" r="1.5" fill="white" />
            </svg>
        );
    }

    // Default Fallback
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" className="text-white/40" />
            <path d="M12 8L14 11H17L15 14L16 17L12 15L8 17L9 14L7 11H10L12 8Z" fill="currentColor" className="text-yellow-400" />
        </svg>
    );
}
