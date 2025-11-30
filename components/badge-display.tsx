"use client";

import { Badge as BadgeUI } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CustomBadgeIcon } from "@/components/profile/custom-badge-icon";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
                <DropdownMenu key={userBadge.badges.id}>
                    <DropdownMenuTrigger asChild>
                        <div
                            className="group relative cursor-pointer outline-none"
                        >
                            <div className={cn(
                                "relative transition-all duration-300",
                                "rounded-xl bg-gradient-to-br from-muted/50 to-muted",
                                "border border-border/50 hover:border-primary/50",
                                "hover:scale-110 hover:shadow-lg hover:-translate-y-1",
                                "flex items-center justify-center",
                                sizeClasses[size]
                            )}>
                                <CustomBadgeIcon name={userBadge.badges.name} className="w-full h-full drop-shadow-sm" />
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56">
                        <div className="p-3 text-center">
                            <div className="w-12 h-12 mx-auto mb-2">
                                <CustomBadgeIcon name={userBadge.badges.name} />
                            </div>
                            <h4 className="font-bold text-sm mb-1">{userBadge.badges.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{userBadge.badges.description}</p>
                            <div className="text-[10px] text-muted-foreground/70 mb-2">
                                Kazanıldı: {new Date(userBadge.awarded_at).toLocaleDateString('tr-TR')}
                            </div>
                            <Link href="/puanlar-nedir#rozetler" className="block">
                                <Button variant="secondary" size="sm" className="w-full h-7 text-xs">
                                    Tüm Rozetler
                                </Button>
                            </Link>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            ))}

            {remainingCount > 0 && (
                <BadgeUI variant="secondary" className="text-xs px-2 py-1">
                    +{remainingCount}
                </BadgeUI>
            )}
        </div>
    );
}
