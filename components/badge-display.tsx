"use client";

import { Badge as BadgeUI } from "@/components/ui/badge";

interface Badge {
    id: number;
    name: string;
    description: string;
    icon: string;
    category: string;
}

interface UserBadge {
    awarded_at: string;
    badges: Badge;
}

interface BadgeDisplayProps {
    userBadges: UserBadge[];
    maxDisplay?: number;
    size?: "sm" | "md" | "lg";
}

export function BadgeDisplay({ userBadges, maxDisplay = 5, size = "md" }: BadgeDisplayProps) {
    const displayBadges = userBadges.slice(0, maxDisplay);
    const remainingCount = userBadges.length - maxDisplay;

    const sizeClasses = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-3xl"
    };

    if (userBadges.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {displayBadges.map((userBadge) => (
                <div
                    key={userBadge.badges.id}
                    className="group relative"
                    title={`${userBadge.badges.name}: ${userBadge.badges.description}`}
                >
                    <div className={cn(
                        "cursor-help transition-transform hover:scale-125",
                        sizeClasses[size]
                    )}>
                        {userBadge.badges.icon}
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-max max-w-xs">
                        <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border text-sm">
                            <div className="font-bold">{userBadge.badges.name}</div>
                            <div className="text-xs text-muted-foreground">{userBadge.badges.description}</div>
                        </div>
                    </div>
                </div>
            ))}

            {remainingCount > 0 && (
                <BadgeUI variant="secondary" className="text-xs">
                    +{remainingCount}
                </BadgeUI>
            )}
        </div>
    );
}

// Import missing
import { cn } from "@/lib/utils";
