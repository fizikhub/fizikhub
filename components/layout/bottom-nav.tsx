"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const HIDDEN_NAV_CLASS = "mobile-bottom-nav--hidden";
const PRIMARY_MOBILE_ROUTES = ["/", "/makale", "/paylas", "/forum", "/profil", "/konular", "/sozluk", "/simulasyonlar", "/testler"];

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const isArticleDetail = /^\/makale\/[^/]+/.test(pathname || "");
    const navRef = useRef<HTMLDivElement>(null);
    const lastScrollYRef = useRef(0);
    const hiddenRef = useRef(false);
    const frameRef = useRef<number | null>(null);
    const [optimisticHref, setOptimisticHref] = useState<string | null>(null);

    useEffect(() => {
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        if (motionQuery.matches) {
            navRef.current?.classList.remove(HIDDEN_NAV_CLASS);
            return;
        }

        const setHidden = (hidden: boolean) => {
            if (hiddenRef.current === hidden) return;
            hiddenRef.current = hidden;
            navRef.current?.classList.toggle(HIDDEN_NAV_CLASS, hidden);
        };

        const onScroll = () => {
            if (frameRef.current !== null) return;

            frameRef.current = requestAnimationFrame(() => {
                frameRef.current = null;

                const latest = window.scrollY;
                const previous = lastScrollYRef.current;
                const diff = latest - previous;
                lastScrollYRef.current = latest;

                if (latest < 64) {
                    setHidden(false);
                    return;
                }

                if (diff > 6) setHidden(true);
                if (diff < -5) setHidden(false);
            });
        };

        lastScrollYRef.current = window.scrollY;
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        };
    }, [isArticleDetail]);

    useEffect(() => {
        navRef.current?.classList.toggle(HIDDEN_NAV_CLASS, isArticleDetail);
        hiddenRef.current = isArticleDetail;

        const resetId = window.setTimeout(() => setOptimisticHref(null), 0);
        return () => window.clearTimeout(resetId);
    }, [pathname, isArticleDetail]);

    const vibrate = () => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(6);
        }
    };

    const isHrefActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    useEffect(() => {
        const prefetchPrimaryRoutes = () => {
            for (const href of PRIMARY_MOBILE_ROUTES) {
                if (href !== pathname) router.prefetch(href);
            }
        };

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(prefetchPrimaryRoutes, { timeout: 1200 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = setTimeout(prefetchPrimaryRoutes, 350);
        return () => clearTimeout(timeoutId);
    }, [pathname, router]);

    const activateRoute = (href: string) => {
        navRef.current?.classList.remove(HIDDEN_NAV_CLASS);
        hiddenRef.current = false;
        setOptimisticHref(href);
        vibrate();
    };

    const handleSharePointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
        if (event.pointerType !== "mouse") activateRoute("/paylas");
    };

    const handleShareClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        activateRoute("/paylas");

        if (isHrefActive("/paylas")) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
    };

    return (
        <div
            ref={navRef}
            className={cn(
                "fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans transform-gpu transition-[transform,opacity,filter] duration-300 mobile-bottom-nav-transition",
                isArticleDetail ? HIDDEN_NAV_CLASS : "translate-y-0 opacity-100"
            )}
        >
            <nav aria-label="Mobil navigasyon" className={cn(
                "w-full h-[calc(64px+env(safe-area-inset-bottom))] bg-white/94 dark:bg-[#121212]/94 backdrop-blur-md border-t border-black/10 dark:border-white/10 flex items-start justify-around px-2 pt-1 pb-[env(safe-area-inset-bottom)] relative shadow-[0_-6px_18px_rgba(0,0,0,0.12)]"
            )}>
                <div className="flex items-center justify-around w-full">
                    <NavItem
                        id="nav-item-home"
                        href="/"
                        icon={Home}
                        label="Ana Sayfa"
                        shortLabel="Ana"
                        isActive={(optimisticHref ?? pathname) === "/"}
                        onActivate={activateRoute}
                    />

                    <NavItem
                        id="nav-item-feed"
                        href="/makale"
                        icon={BookOpen}
                        label="Keşfet"
                        shortLabel="Keşfet"
                        isActive={(optimisticHref ?? pathname).startsWith("/makale")}
                        onActivate={activateRoute}
                    />

                    <div className="relative -top-3.5 z-20">
                        <Link
                            id="nav-item-share"
                            href="/paylas"
                            prefetch
                            className="relative block touch-manipulation"
                            aria-label="Paylaş"
                            onPointerDown={handleSharePointerDown}
                            onClick={handleShareClick}
                            onTouchStart={() => activateRoute("/paylas")}
                            onFocus={() => activateRoute("/paylas")}
                        >
                            <div
                                className="
                                    flex items-center justify-center
                                    w-14 h-14
                                    bg-[#EAB308]
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
                        shortLabel="Forum"
                        isActive={(optimisticHref ?? pathname).startsWith("/forum")}
                        onActivate={activateRoute}
                    />

                    <NavItem
                        id="nav-item-profile"
                        href="/profil"
                        icon={User}
                        label="Profil"
                        shortLabel="Profil"
                        isActive={(optimisticHref ?? pathname).startsWith("/profil")}
                        onActivate={activateRoute}
                    />
                </div>
            </nav>
        </div>
    );
}

function NavItem({
    id,
    href,
    icon: Icon,
    label,
    shortLabel,
    isActive,
    onActivate,
}: {
    id?: string;
    href: string;
    icon: LucideIcon;
    label: string;
    shortLabel?: string;
    isActive: boolean;
    onActivate: (href: string) => void;
}) {
    const handlePointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
        if (event.pointerType !== "mouse") onActivate(href);
    };

    const handleNavItemClick = (e: React.MouseEvent) => {
        onActivate(href);

        if (isActive) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <Link
            id={id}
            href={href}
            prefetch
            onClick={handleNavItemClick}
            onPointerDown={handlePointerDown}
            onTouchStart={() => onActivate(href)}
            onFocus={() => onActivate(href)}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                "flex flex-col items-center justify-center min-w-[56px] min-h-[56px] relative group z-10 touch-manipulation rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]",
                isActive ? "text-black dark:text-white" : "text-zinc-700 dark:text-zinc-300"
            )}
        >
            <div
                className="flex flex-col items-center gap-0.5 relative transition-transform duration-150 active:scale-x-105 active:scale-y-95"
            >
                {isActive && (
                    <div
                        className="
                            absolute inset-0 
                            bg-black/5 dark:bg-white/10 
                            border border-black/5 dark:border-white/5 
                            rounded-[8px]
                            shadow-inner dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.2)]
                        "
                    />
                )}

                <div className={cn(
                    "p-1 rounded-[8px] transition-all duration-200 relative z-10",
                    !isActive && "group-hover:bg-black/5 dark:group-hover:bg-white/5"
                )}>
                    <div
                        className={cn(
                            "transition-transform duration-150",
                            isActive && "scale-110"
                        )}
                    >
                        <Icon
                            fill="none"
                            className={cn(
                                "w-5 h-5 transition-all duration-200",
                                isActive ? "stroke-[3px]" : "stroke-[2px]"
                            )}
                        />
                    </div>
                </div>
                <span className={cn(
                    "relative z-10 text-[10px] font-black leading-none tracking-normal",
                    isActive ? "opacity-100" : "opacity-90"
                )}>
                    {shortLabel || label}
                </span>
            </div>
        </Link>
    );
}
