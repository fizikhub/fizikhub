import { cn } from "@/lib/utils";

interface CustomBadgeIconProps {
    name: string;
    className?: string;
}

export function CustomBadgeIcon({ name, className }: CustomBadgeIconProps) {
    const normalizedName = name.toLowerCase();

    // Einstein Badge (Face Concept)
    if (normalizedName.includes("einstein") || normalizedName.includes("bilim")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                {/* Hair */}
                <path d="M4 10C4 6 7 3 12 3C17 3 20 6 20 10C21 11 22 13 21 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-400" />
                <path d="M3 15C2 13 3 11 4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-400" />
                {/* Face */}
                <path d="M6 10C6 10 6 18 12 18C18 18 18 10 18 10" stroke="currentColor" strokeWidth="1.5" className="text-amber-200" />
                {/* Mustache */}
                <path d="M9 14C10 13.5 11 14 12 14C13 14 14 13.5 15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-500" />
                {/* Eyes */}
                <circle cx="9" cy="11" r="1" fill="currentColor" className="text-slate-700" />
                <circle cx="15" cy="11" r="1" fill="currentColor" className="text-slate-700" />
            </svg>
        );
    }

    // Newton Badge (Face/Wig Concept)
    if (normalizedName.includes("newton") || normalizedName.includes("elma") || normalizedName.includes("yerçekimi")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                {/* Wig */}
                <path d="M5 18C4 16 4 14 5 12C5 8 8 5 12 5C16 5 19 8 19 12C20 14 20 16 19 18" stroke="currentColor" strokeWidth="1.5" className="text-gray-300" />
                {/* Face */}
                <path d="M7 12C7 12 7 19 12 19C17 19 17 12 17 12" stroke="currentColor" strokeWidth="1.5" className="text-amber-200" />
                {/* Apple (Small, falling) */}
                <circle cx="18" cy="6" r="2" fill="currentColor" className="text-red-500" />
                <path d="M18 4V5" stroke="currentColor" strokeWidth="1" className="text-green-700" />
            </svg>
        );
    }

    // Tesla Badge (Face/Mustache)
    if (normalizedName.includes("tesla") || normalizedName.includes("elektrik") || normalizedName.includes("enerji")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                {/* Face */}
                <path d="M7 8C7 8 7 18 12 18C17 18 17 8 17 8" stroke="currentColor" strokeWidth="1.5" className="text-amber-200" />
                {/* Hair (Center Part) */}
                <path d="M7 8C7 5 9 3 12 3C15 3 17 5 17 8" stroke="currentColor" strokeWidth="1.5" className="text-slate-800 dark:text-slate-200" />
                {/* Mustache (Sharp) */}
                <path d="M10 14L12 13.5L14 14" stroke="currentColor" strokeWidth="1" className="text-slate-800 dark:text-slate-200" />
                {/* Lightning Bolt (Background) */}
                <path d="M20 2L18 8H21L19 14" stroke="currentColor" strokeWidth="1.5" className="text-yellow-500 opacity-50" />
            </svg>
        );
    }

    // Curie Badge (Glowing Flask - Redesigned)
    if (normalizedName.includes("curie") || normalizedName.includes("radyoaktif")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                {/* Flask Body */}
                <path d="M12 3V9L6 19C5.5 19.8 6 21 7 21H17C18 21 18.5 19.8 18 19L12 9" stroke="currentColor" strokeWidth="1.5" className="text-purple-400" fill="none" />
                {/* Liquid Level */}
                <path d="M8 15.5H16" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-green-400" />
                {/* Bubbles/Glow */}
                <circle cx="12" cy="18" r="1.5" fill="currentColor" className="text-green-400 animate-pulse" />
                <circle cx="10" cy="16" r="1" fill="currentColor" className="text-green-300 animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="14" cy="14" r="0.5" fill="currentColor" className="text-green-300" />
                {/* Radioactive Symbol Hint */}
                <path d="M12 12L13.5 10.5" stroke="currentColor" strokeWidth="1" className="text-green-500" />
                <path d="M12 12L10.5 10.5" stroke="currentColor" strokeWidth="1" className="text-green-500" />
            </svg>
        );
    }

    // Galileo Badge (Telescope & Jupiter Moons - Redesigned)
    if (normalizedName.includes("galileo") || normalizedName.includes("teleskop")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                {/* Telescope Tube */}
                <rect x="5" y="5" width="4" height="14" transform="rotate(-45 7 12)" rx="1" fill="currentColor" className="text-amber-700" />
                {/* Lens */}
                <path d="M14 8L16 6" stroke="currentColor" strokeWidth="3" className="text-slate-400" />
                {/* Stand */}
                <path d="M6 18L4 22M6 18L8 22" stroke="currentColor" strokeWidth="1.5" className="text-amber-900" />
                {/* Jupiter & Moons */}
                <circle cx="18" cy="6" r="3" fill="currentColor" className="text-orange-300" />
                <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="0.5" className="text-orange-400" />
                <circle cx="13" cy="4" r="0.5" fill="currentColor" className="text-white" />
                <circle cx="22" cy="7" r="0.8" fill="currentColor" className="text-white" />
                <circle cx="16" cy="10" r="0.6" fill="currentColor" className="text-white" />
            </svg>
        );
    }

    // Hawking Badge (Wheelchair & Black Hole - Redesigned)
    if (normalizedName.includes("hawking") || normalizedName.includes("kara delik")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                {/* Black Hole Background */}
                <circle cx="18" cy="6" r="5" fill="black" className="dark:fill-white opacity-20" />
                <path d="M18 6m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" stroke="currentColor" strokeWidth="0.5" className="text-indigo-500 animate-[spin_10s_linear_infinite]" />

                {/* Wheelchair Side View */}
                {/* Back rest */}
                <path d="M7 8L7 16" stroke="currentColor" strokeWidth="1.5" className="text-slate-600 dark:text-slate-400" />
                {/* Seat */}
                <path d="M7 16H12" stroke="currentColor" strokeWidth="1.5" className="text-slate-600 dark:text-slate-400" />
                {/* Main Wheel */}
                <circle cx="10" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" className="text-slate-700 dark:text-slate-300" />
                <circle cx="10" cy="19" r="1" fill="currentColor" className="text-slate-500" />
                {/* Small front wheel */}
                <circle cx="14" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" className="text-slate-700 dark:text-slate-300" />
                {/* Handle */}
                <path d="M7 8L5 8" stroke="currentColor" strokeWidth="1.5" className="text-slate-600 dark:text-slate-400" />

                {/* Silhouette Hint */}
                <path d="M8 10C8 9 9 8 10 8C11 8 11 9 11 11L10 15L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-slate-800 dark:text-slate-200" fill="none" />
            </svg>
        );
    }

    // Da Vinci (Vitruvian/Sketch - Redesigned)
    if (normalizedName.includes("vinci") || normalizedName.includes("sanat")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                {/* Circle */}
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.5" className="text-amber-700" strokeDasharray="2 2" />
                {/* Square */}
                <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="0.5" className="text-amber-700" />
                {/* Human Figure Abstract */}
                <path d="M12 6V18" stroke="currentColor" strokeWidth="1" className="text-amber-500" />
                <path d="M7 10L12 7L17 10" stroke="currentColor" strokeWidth="1" className="text-amber-500" />
                <path d="M7 14L12 18L17 14" stroke="currentColor" strokeWidth="1" className="text-amber-500" />
                {/* Arms */}
                <path d="M6 9H18" stroke="currentColor" strokeWidth="0.5" className="text-amber-500 opacity-60" />
                <path d="M5 8L19 8" stroke="currentColor" strokeWidth="0.5" className="text-amber-500 opacity-40" />
            </svg>
        );
    }

    // Writer/Pen Badge (Feather Quill - Redesigned)
    if (normalizedName.includes("yazar") || normalizedName.includes("kalem") || normalizedName.includes("içerik")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                {/* Ink Pot */}
                <path d="M16 16V20C16 21.1 15.1 22 14 22H10C8.9 22 8 21.1 8 20V16" stroke="currentColor" strokeWidth="1.5" className="text-slate-600 dark:text-slate-400" />
                <path d="M7 16H17" stroke="currentColor" strokeWidth="1.5" className="text-slate-600 dark:text-slate-400" />

                {/* Quill */}
                <path d="M12 16L18 4C19 2 21 2 21 2C21 2 20 5 18 7C16 9 12 16 12 16Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" className="text-slate-800 dark:text-slate-200" />
                <path d="M12 16L12 20" stroke="currentColor" strokeWidth="1" className="text-slate-800" />

                {/* Ink drop */}
                <circle cx="15" cy="20" r="1" fill="currentColor" className="text-slate-800 dark:text-white" />
            </svg>
        );
    }

    // Rank Badges
    if (normalizedName.includes("evrensel")) { // Evrensel Zeka
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" className="text-sky-500" />
                <path d="M12 2V22" stroke="currentColor" strokeWidth="1" className="text-sky-300 opacity-50" />
                <path d="M2 12H22" stroke="currentColor" strokeWidth="1" className="text-sky-300 opacity-50" />
                <circle cx="12" cy="12" r="3" fill="currentColor" className="text-sky-400" />
                <path d="M12 4A8 8 0 0 1 20 12" stroke="currentColor" strokeWidth="1.5" className="text-sky-200" strokeDasharray="2 2" />
            </svg>
        );
    }

    if (normalizedName.includes("teorisyen")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 3L14.5 9H20.5L15.5 13L17.5 19L12 15.5L6.5 19L8.5 13L3.5 9H9.5L12 3Z" fill="currentColor" className="text-amber-500" />
                <path d="M12 7L13.5 10H17L14 12.5L15 16L12 14L9 16L10 12.5L7 10H10.5L12 7Z" fill="white" className="opacity-30" />
            </svg>
        );
    }

    if (normalizedName.includes("araştırmacı")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" className="text-purple-500" />
                <path d="M16 16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-purple-500" />
                <path d="M11 8V11H14" stroke="currentColor" strokeWidth="1.5" className="text-purple-400" />
            </svg>
        );
    }

    if (normalizedName.includes("gözlemci")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" className="text-blue-500" fill="none" />
                <circle cx="12" cy="12" r="3" fill="currentColor" className="text-blue-400" />
            </svg>
        );
    }

    if (normalizedName.includes("çaylak") || normalizedName.includes("meraklı")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" className="text-green-500" />
                <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-green-500" />
                <circle cx="12" cy="8" r="1" fill="currentColor" className="text-green-500" />
            </svg>
        );
    }

    // Kaşif Badge (Existing but refreshed)
    if (normalizedName.includes("kaşif") || normalizedName.includes("explorer")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                {/* Compass */}
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" className="text-amber-600" />
                <path d="M12 3V5" stroke="currentColor" strokeWidth="1.5" className="text-amber-800" />
                <path d="M12 19V21" stroke="currentColor" strokeWidth="1.5" className="text-amber-800" />
                <path d="M3 12H5" stroke="currentColor" strokeWidth="1.5" className="text-amber-800" />
                <path d="M19 12H21" stroke="currentColor" strokeWidth="1.5" className="text-amber-800" />
                {/* Needle */}
                <path d="M12 12L14 8L12 12L10 16L12 12Z" fill="currentColor" className="text-red-500" />
            </svg>
        );
    }


    // Point-based Badges
    if (normalizedName.includes("yıldız tozu") || normalizedName.includes("stardust")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 2L14 9L21 9L15 14L17 21L12 17L7 21L9 14L3 9L10 9L12 2Z" fill="url(#star-gradient)" stroke="currentColor" strokeWidth="1" className="text-yellow-500" />
                <defs>
                    <linearGradient id="star-gradient" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FCD34D" />
                        <stop offset="1" stopColor="#F59E0B" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="2" fill="white" className="opacity-50" />
            </svg>
        );
    }

    if (normalizedName.includes("kuyruklu yıldız") || normalizedName.includes("comet")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M18 6C18 6 14 6 10 10C6 14 4 18 4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-500" />
                <path d="M16 4C16 4 12 4 8 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-slate-400" />
                <path d="M20 8C20 8 16 8 12 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-slate-400" />
                <circle cx="19" cy="5" r="3" fill="currentColor" className="text-blue-400" />
                <circle cx="19" cy="5" r="1.5" fill="white" />
            </svg>
        );
    }

    if (normalizedName.includes("galaksi") || normalizedName.includes("galaxy")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" stroke="currentColor" strokeWidth="0.5" className="text-purple-500 animate-[spin_20s_linear_infinite]" strokeDasharray="4 4" />
                <path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" stroke="currentColor" strokeWidth="1" className="text-purple-400" transform="rotate(45 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="3" stroke="currentColor" strokeWidth="1" className="text-pink-500" transform="rotate(-30 12 12)" />
                <circle cx="12" cy="12" r="2" fill="currentColor" className="text-white" />
            </svg>
        );
    }

    // Default fallback
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" className="text-gray-400" />
            <path d="M12 7L13.5 11H17.5L14.5 14L15.5 18L12 15.5L8.5 18L9.5 14L6.5 11H10.5L12 7Z" fill="currentColor" className="text-gray-400" />
        </svg>
    );
}
