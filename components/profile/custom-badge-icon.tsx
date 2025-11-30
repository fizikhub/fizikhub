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

    // Curie Badge (Flask/Radioactivity)
    if (normalizedName.includes("curie") || normalizedName.includes("radyoaktif")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 4V10" stroke="currentColor" strokeWidth="1.5" className="text-slate-500" />
                <path d="M9 10L7 19H17L15 10H9Z" fill="currentColor" className="text-purple-200 dark:text-purple-900" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="15" r="2" fill="currentColor" className="text-green-400 animate-pulse" />
                <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" className="text-slate-500" />
                <path d="M8 22H16" stroke="currentColor" strokeWidth="1.5" className="text-slate-500" />
            </svg>
        );
    }

    // Galileo Badge (Telescope)
    if (normalizedName.includes("galileo") || normalizedName.includes("teleskop")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M4 18L16 6" stroke="currentColor" strokeWidth="3" className="text-amber-700" />
                <path d="M14 4L18 8" stroke="currentColor" strokeWidth="3" className="text-amber-500" />
                <path d="M3 19L5 21" stroke="currentColor" strokeWidth="1.5" className="text-slate-500" />
                <circle cx="19" cy="5" r="1" fill="currentColor" className="text-blue-300" />
                <path d="M18 18L21 21" stroke="currentColor" strokeWidth="1.5" className="text-slate-400" />
            </svg>
        );
    }

    // Hawking Badge (Black Hole)
    if (normalizedName.includes("hawking") || normalizedName.includes("kara delik")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="6" fill="currentColor" className="text-black dark:text-white" />
                <ellipse cx="12" cy="12" rx="9" ry="3" stroke="currentColor" strokeWidth="1" className="text-purple-500" transform="rotate(45 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="3" stroke="currentColor" strokeWidth="1" className="text-blue-500" transform="rotate(-45 12 12)" />
            </svg>
        );
    }

    // Da Vinci Badge (Vitruvian/Geometry)
    if (normalizedName.includes("vinci") || normalizedName.includes("sanat")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" className="text-amber-600" />
                <rect x="6.5" y="6.5" width="11" height="11" stroke="currentColor" strokeWidth="1" className="text-amber-800" />
                <path d="M12 6V18" stroke="currentColor" strokeWidth="0.5" className="text-amber-500" />
                <path d="M6 12H18" stroke="currentColor" strokeWidth="0.5" className="text-amber-500" />
            </svg>
        );
    }

    // Writer/Pen Badge
    if (normalizedName.includes("yazar") || normalizedName.includes("kalem") || normalizedName.includes("içerik")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 19L19 12L22 15L15 22L12 19Z" fill="currentColor" className="text-blue-500" />
                <path d="M18 13L16.5 11.5L2 22L2.5 22.5L18 13Z" fill="currentColor" className="text-amber-700" />
                <path d="M2 22L5 22L16.5 11.5L13.5 8.5L2 19V22Z" fill="currentColor" className="text-amber-500" />
            </svg>
        );
    }

    // Rank Badges
    if (normalizedName.includes("efsane")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5z" fill="currentColor" className="text-amber-500" />
            </svg>
        );
    }

    if (normalizedName.includes("uzman")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" className="text-purple-500" />
            </svg>
        );
    }

    if (normalizedName.includes("aktif")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" className="text-blue-500" />
            </svg>
        );
    }

    if (normalizedName.includes("yeni")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-gray-400" />
                <circle cx="12" cy="12" r="6" fill="currentColor" className="text-gray-400" />
            </svg>
        );
    }

    if (normalizedName.includes("doğrulanmış")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-500" />
                <circle cx="12" cy="12" r="9" fill="currentColor" className="text-blue-100 dark:text-blue-900/30" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" className="text-yellow-400" />
        </svg>
    );
}
