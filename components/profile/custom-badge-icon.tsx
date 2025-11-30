import { cn } from "@/lib/utils";

interface CustomBadgeIconProps {
    name: string;
    className?: string;
}

export function CustomBadgeIcon({ name, className }: CustomBadgeIconProps) {
    const normalizedName = name.toLowerCase();

    // Einstein Badge (Atom/Brain concept)
    if (normalizedName.includes("einstein") || normalizedName.includes("bilim")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="3" fill="currentColor" className="text-amber-500" />
                <ellipse cx="12" cy="12" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" className="text-blue-500" transform="rotate(0 12 12)" />
                <ellipse cx="12" cy="12" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" className="text-blue-500" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" className="text-blue-500" transform="rotate(120 12 12)" />
            </svg>
        );
    }

    // Newton/Apple Badge
    if (normalizedName.includes("newton") || normalizedName.includes("elma") || normalizedName.includes("yerçekimi")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <path d="M12 2C13 2 14 4 14 4C14 4 15 3 16 4C17 5 16 7 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-green-600" />
                <path d="M12 5C9 5 7 7 7 10C7 14 9 19 12 21C15 19 17 14 17 10C17 7 15 5 12 5Z" fill="currentColor" className="text-red-500" />
                <path d="M14 8C14 8 15 8 15 9" stroke="white" strokeWidth="1" strokeLinecap="round" />
            </svg>
        );
    }

    // E=mc² Badge
    if (normalizedName.includes("e=mc") || normalizedName.includes("görelilik") || normalizedName.includes("teori")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" className="text-slate-800 dark:text-slate-200" />
                <path d="M6 16V8H10" stroke="currentColor" strokeWidth="2" className="text-white dark:text-black" />
                <path d="M6 12H9" stroke="currentColor" strokeWidth="2" className="text-white dark:text-black" />
                <path d="M6 16H10" stroke="currentColor" strokeWidth="2" className="text-white dark:text-black" />
                <path d="M13 10H16" stroke="currentColor" strokeWidth="2" className="text-white dark:text-black" />
                <path d="M13 13H16" stroke="currentColor" strokeWidth="2" className="text-white dark:text-black" />
            </svg>
        );
    }

    // Tesla Badge (Lightning/Energy)
    if (normalizedName.includes("tesla") || normalizedName.includes("elektrik") || normalizedName.includes("enerji")) {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                <circle cx="12" cy="12" r="10" fill="currentColor" className="text-purple-100 dark:text-purple-900" />
                <path d="M13 3L7 14H12L11 21L17 10H12L13 3Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" className="text-yellow-500" />
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

    // Default Fallback (Star)
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" className="text-yellow-400" />
        </svg>
    );
}
