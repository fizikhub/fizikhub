"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, HelpCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BadgeDisplay } from "@/components/badge-display";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileBadgesProps {
    userBadges: any[];
}

export function ProfileBadges({ userBadges }: ProfileBadgesProps) {
    return (
        <div className="mb-8">
            <div className="border-2 border-black dark:border-white bg-background p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 border-b-2 border-black/10 dark:border-white/10 pb-2">
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        BAŞARI KAYITLARI
                    </h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="text-muted-foreground hover:text-primary transition-colors outline-none">
                                <HelpCircle className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            <div className="p-3 space-y-2">
                                <h4 className="font-bold text-sm uppercase">Rozet Protokolü</h4>
                                <p className="text-xs text-muted-foreground">
                                    Topluluğa katkılarınızdan dolayı kazandığınız özel rütbe ve nişanlardır.
                                </p>
                                <Link href="/puanlar-nedir#rozetler" className="block">
                                    <Button variant="outline" size="sm" className="w-full h-7 text-xs mt-1 rounded-none border-black dark:border-white hover:bg-primary hover:text-white">
                                        KAYITLARI İNCELE
                                    </Button>
                                </Link>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Badges Content */}
                {userBadges && userBadges.length > 0 ? (
                    <div className="pt-2">
                        <BadgeDisplay userBadges={userBadges} maxDisplay={10} size="md" />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                        <BadgeCheck className="h-8 w-8 text-muted-foreground/30 mb-2" />
                        <div className="text-xs font-mono text-muted-foreground uppercase">
                            KAYIT BULUNAMADI
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
