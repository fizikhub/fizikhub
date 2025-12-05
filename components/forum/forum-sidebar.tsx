"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, Clock, Flame, Filter } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

export function ForumSidebar() {
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "newest";
    const [open, setOpen] = useState(false);

    const SidebarContent = () => (
        <div className="space-y-6">
            <div className="brutalist-card p-6 bg-card">
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-4 border-b-2 border-black dark:border-white pb-2">
                    FİLTRELER
                </h3>
                <div className="flex flex-col gap-2">
                    <Link href="/forum?sort=newest" onClick={() => setOpen(false)}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 font-bold uppercase rounded-none border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-transparent transition-all",
                                currentSort === "newest"
                                    ? "bg-primary text-primary-foreground border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Clock className="h-4 w-4" />
                            En Yeniler
                        </Button>
                    </Link>
                    <Link href="/forum?sort=popular" onClick={() => setOpen(false)}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 font-bold uppercase rounded-none border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-transparent transition-all",
                                currentSort === "popular"
                                    ? "bg-primary text-primary-foreground border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Flame className="h-4 w-4" />
                            Popüler
                        </Button>
                    </Link>
                    <Link href="/forum?filter=solved" onClick={() => setOpen(false)}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 font-bold uppercase rounded-none border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-transparent transition-all",
                                searchParams.get("filter") === "solved"
                                    ? "bg-primary text-primary-foreground border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                                    : "text-muted-foreground"
                            )}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Çözülenler
                        </Button>
                    </Link>
                    <Link href="/forum?filter=unanswered" onClick={() => setOpen(false)}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 font-bold uppercase rounded-none border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-transparent transition-all",
                                searchParams.get("filter") === "unanswered"
                                    ? "bg-primary text-primary-foreground border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                                    : "text-muted-foreground"
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
                        <Button variant="outline" className="w-full gap-2 border-2 border-black dark:border-white rounded-none font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                            <Filter className="h-4 w-4" />
                            Filtrele ve Sırala
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] max-w-sm border-2 border-black dark:border-white p-0 overflow-hidden">
                        <DialogTitle className="p-4 bg-primary text-primary-foreground font-black uppercase border-b-2 border-black dark:border-white m-0">
                            Filtreler
                        </DialogTitle>
                        <div className="p-4">
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
