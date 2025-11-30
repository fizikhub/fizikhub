"use client";

import { Badge as BadgeUI } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CustomBadgeIcon } from "@/components/profile/custom-badge-icon";

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
        sm: "w-8 h-8 p-1",
        md: "w-12 h-12 p-2",
        lg: "w-16 h-16 p-3"
    };

    if (userBadges.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            {displayBadges.map((userBadge) => (
                <div
                    key={userBadge.badges.id}
                    className="group relative"
                >
                    <div className={cn(
                        "relative cursor-help transition-all duration-300",
                        "rounded-xl bg-gradient-to-br from-muted/50 to-muted",
                        "border border-border/50 hover:border-primary/50",
                        "hover:scale-110 hover:shadow-lg hover:-translate-y-1",
                        "flex items-center justify-center",
                        sizeClasses[size]
                    )}>
                        <CustomBadgeIcon name={userBadge.badges.name} className="w-full h-full drop-shadow-sm" />
                    </div>

                    {/* Simple Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-max max-w-[200px]">
                        <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border text-center">
                            <div className="font-semibold text-sm mb-1">
                                {userBadge.badges.name}
                            </div>
                            <div className="text-xs text-muted-foreground leading-tight mb-2">
                                {userBadge.badges.description}
                            </div>
                            <div className="text-[10px] text-muted-foreground/70">
                                {new Date(userBadge.awarded_at).toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                        {/* Arrow */}
                        <div className="w-2 h-2 bg-popover rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 border-r border-b" />
                    </div>
                </div>
            ))}

            {remainingCount > 0 && (
                <BadgeUI variant="secondary" className="text-xs px-2 py-1">
                    +{remainingCount}
                </BadgeUI>
            )}
        </div>
    );
}
