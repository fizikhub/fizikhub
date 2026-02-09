import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BentoStatCardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    color?: "pink" | "yellow" | "cyan" | "lime" | "white";
    className?: string;
    description?: string;
}

export function BentoStatCard({
    title,
    value,
    icon: Icon,
    color = "white",
    className,
    description
}: BentoStatCardProps) {
    const colorStyles = {
        pink: "bg-neo-vibrant-pink text-black",
        yellow: "bg-neo-vibrant-yellow text-black",
        cyan: "bg-neo-vibrant-cyan text-black",
        lime: "bg-neo-vibrant-lime text-black",
        white: "bg-neo-off-white text-black",
    };

    return (
        <div className={cn(
            "relative p-4 border-3 border-black rounded-xl shadow-neo transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg",
            colorStyles[color],
            className
        )}>
            <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm uppercase tracking-wider opacity-80">{title}</span>
                {Icon && <Icon className="w-5 h-5 stroke-[2.5]" />}
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-black font-heading leading-tight">{value}</span>
                {description && (
                    <span className="text-xs font-bold mt-1 opacity-70">{description}</span>
                )}
            </div>
        </div>
    );
}
