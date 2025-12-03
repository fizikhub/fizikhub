"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, HelpCircle } from "lucide-react";
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
            <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/30 max-w-md mx-auto">
                <CardContent className="p-6">
                    {/* Badges */}
                    {userBadges && userBadges.length > 0 ? (
                        <div className="mt-6 pt-6 border-t">
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4" />
                                    Rozetler
                                </h3>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="text-muted-foreground hover:text-foreground transition-colors outline-none">
                                            <HelpCircle className="h-3.5 w-3.5" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-64">
                                        <div className="p-3 space-y-2">
                                            <h4 className="font-semibold text-sm">Rozetler Nedir?</h4>
                                            <p className="text-xs text-muted-foreground">
                                                Topluluğa katkılarınızdan dolayı kazandığınız özel ödüllerdir.
                                            </p>
                                            <Link href="/puanlar-nedir#rozetler" className="block">
                                                <Button variant="secondary" size="sm" className="w-full h-7 text-xs mt-1">
                                                    Rozetleri İncele
                                                </Button>
                                            </Link>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <BadgeDisplay userBadges={userBadges} maxDisplay={10} size="md" />
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground text-center py-4">
                            Henüz rozet kazanılmadı
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
