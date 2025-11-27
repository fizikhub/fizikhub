"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, Clock, Flame } from "lucide-react";

const categories = [
    "Tümü",
    "Kuantum Fiziği",
    "Astrofizik",
    "Termodinamik",
    "Mekanik",
    "Elektromanyetizma",
    "Genel Görelilik",
    "Parçacık Fiziği"
];

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Filter } from "lucide-react";

export function ForumSidebar() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "Tümü";
    const currentSort = searchParams.get("sort") || "newest";
    const [open, setOpen] = useState(false);

    const SidebarContent = () => (
        <div className="space-y-6 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm">
            {/* Filters */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-2">Filtreler</h3>
                <div className="flex flex-col gap-1">
                    <Link href="/forum?sort=newest" onClick={() => setOpen(false)}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "w-full justify-start gap-2 font-normal rounded-lg h-9",
                                currentSort === "newest"
                                    ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                                    : "hover:bg-muted/50"
                            )}
                        >
                            <Clock className="h-4 w-4" />
                            En Yeniler
                        </Button>
                    </Link>
                    <Link href="/forum?sort=popular" onClick={() => setOpen(false)}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "w-full justify-start gap-2 font-normal rounded-lg h-9",
                                currentSort === "popular"
                                    ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                                    : "hover:bg-muted/50"
                            )}
                        >
                            <Flame className="h-4 w-4" />
                            Popüler
                        </Button>
                    </Link>
                    <Link href="/forum?filter=solved" onClick={() => setOpen(false)}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "w-full justify-start gap-2 font-normal rounded-lg h-9",
                                searchParams.get("filter") === "solved"
                                    ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                                    : "hover:bg-muted/50"
                            )}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Çözülenler
                        </Button>
                    </Link>
                    <Link href="/forum?filter=unanswered" onClick={() => setOpen(false)}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "w-full justify-start gap-2 font-normal rounded-lg h-9",
                                searchParams.get("filter") === "unanswered"
                                    ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                                    : "hover:bg-muted/50"
                            )}
                        >
                            <MessageSquare className="h-4 w-4" />
                            Cevaplanmamış
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-6">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full gap-2 bg-background/50 backdrop-blur-sm">
                            <Filter className="h-4 w-4" />
                            Filtrele ve Sırala
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] max-w-sm rounded-xl">
                        <DialogTitle>Filtreler</DialogTitle>
                        <div className="mt-4">
                            <SidebarContent />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block sticky top-24">
                <SidebarContent />
            </div>
        </>
    );
}
