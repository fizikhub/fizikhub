"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function BottomNav() {
    const pathname = usePathname();
    const navRef = useRef<HTMLDivElement>(null);
    const lastScrollYRef = useRef(0);
    const hiddenRef = useRef(false);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) return;

        const setHidden = (hidden: boolean) => {
            if (hiddenRef.current === hidden) return;
            hiddenRef.current = hidden;
            navRef.current?.classList.toggle("translate-y-full", hidden);
        };

        const onScroll = () => {
            if (frameRef.current !== null) return;

            frameRef.current = requestAnimationFrame(() => {
                frameRef.current = null;

                const latest = window.scrollY;
                const previous = lastScrollYRef.current;
                const diff = latest - previous;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const isNearBottom = maxScroll > 0 && latest / maxScroll > 0.95;

                lastScrollYRef.current = latest;

                if (latest < 48 || isNearBottom) {
                    setHidden(false);
                    return;
                }

                if (diff > 8) setHidden(true);
                if (diff < -8) setHidden(false);
            });
        };

        lastScrollYRef.current = window.scrollY;
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        };
    }, []);

    const vibrate = () => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(6);
        }
    };

    return (
        <div
            ref={navRef}
            className="fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans translate-y-0 transition-transform duration-200 ease-out transform-gpu"
        >
            <nav aria-label="Mobil navigasyon" className={cn(
                "w-full h-[calc(56px+env(safe-area-inset-bottom))] bg-white/92 dark:bg-[#121212]/92 backdrop-blur-sm border-t border-black/10 dark:border-white/10 flex items-start justify-around px-2 pt-1 pb-[env(safe-area-inset-bottom)] relative shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
            )}>
                <div className="flex items-center justify-around w-full">
                    <NavItem
                        id="nav-item-home"
                        href="/"
                        icon={Home}
                        label="Ana Sayfa"
                        isActive={pathname === "/"}
                        onInteract={vibrate}
                    />

                    <NavItem
                        id="nav-item-feed"
                        href="/makale"
                        icon={BookOpen}
                        label="Keşfet"
                        isActive={pathname.startsWith("/makale")}
                        onInteract={vibrate}
                    />

                    <div className="relative -top-3.5 z-20">
                        <Link
                            id="nav-item-share"
                            href="/paylas"
                            className="relative block touch-manipulation"
                            onPointerDown={vibrate}
                        >
                            <div
                                className="
                                    flex items-center justify-center
                                    w-12 h-12
                                    bg-[#FACC15]
                                    border-2 border-black dark:border-white
                                    rounded-full
                                    shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                    dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]
                                    group
                                    relative
                                    overflow-hidden
                                    transition-transform duration-150
                                    active:scale-90 active:rotate-[15deg]
                                "
                            >
                                <Plus className="w-5 h-5 text-black stroke-[3px] group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                            </div>
                        </Link>
                    </div>

                    <NavItem
                        id="nav-item-forum"
                        href="/forum"
                        icon={MessageCircle}
                        label="Forum"
                        isActive={pathname.startsWith("/forum")}
                        onInteract={vibrate}
                    />

                    <NavItem
                        id="nav-item-profile"
                        href="/profil"
                        icon={User}
                        label="Profil"
                        isActive={pathname.startsWith("/profil")}
                        onInteract={vibrate}
                    />
                </div>
            </nav>
        </div>
    );
}

function NavItem({ id, href, icon: Icon, label, isActive, onInteract }: { id?: string; href: string; icon: LucideIcon; label: string; isActive: boolean; onInteract: () => void }) {
    const handleNavItemClick = (e: React.MouseEvent) => {
        if (e.detail === 0) onInteract();
        if (isActive) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <Link
            id={id}
            href={href}
            onClick={handleNavItemClick}
            onPointerDown={onInteract}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                "flex flex-col items-center justify-center min-w-[56px] min-h-[48px] relative group z-10 touch-manipulation",
                isActive ? "text-black dark:text-white" : "text-zinc-500 dark:text-zinc-500"
            )}
        >
            <div
                className="flex flex-col items-center gap-0.5 relative transition-transform duration-150 active:scale-x-110 active:scale-y-90"
            >
                {isActive && (
                    <div
                        className="
                            absolute inset-0 
                            bg-black/5 dark:bg-white/10 
                            border border-black/5 dark:border-white/5 
                            rounded-lg
                            shadow-inner dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.2)]
                        "
                    />
                )}

                <div className={cn(
                    "p-1.5 rounded-lg transition-all duration-200 relative z-10",
                    !isActive && "group-hover:bg-black/5 dark:group-hover:bg-white/5"
                )}>
                    <div
                        className={cn(
                            "transition-transform duration-150",
                            isActive && "scale-110"
                        )}
                    >
                        <Icon
                            fill={isActive ? "currentColor" : "none"}
                            className={cn(
                                "w-5 h-5 transition-all duration-200",
                                isActive ? "stroke-[2.75px]" : "stroke-[2px]"
                            )}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}
