"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const HIDDEN_NAV_CLASS = "translate-y-[calc(100%+1rem)]";

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const isArticleDetail = /^\/makale\/[^/]+/.test(pathname || "");
    const navRef = useRef<HTMLDivElement>(null);
    const lastScrollYRef = useRef(0);
    const hiddenRef = useRef(false);
    const frameRef = useRef<number | null>(null);
    const navigatingHrefRef = useRef<string | null>(null);
    const [optimisticHref, setOptimisticHref] = useState<string | null>(null);

    useEffect(() => {
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const coarsePointerQuery = window.matchMedia("(hover: none), (pointer: coarse)");

        if (motionQuery.matches || (coarsePointerQuery.matches && !isArticleDetail)) {
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
    }, [isArticleDetail]);

    useEffect(() => {
        let cancelled = false;
        queueMicrotask(() => {
            if (!cancelled) setOptimisticHref(null);
        });
        navigatingHrefRef.current = null;
        navRef.current?.classList.toggle(HIDDEN_NAV_CLASS, isArticleDetail);
        hiddenRef.current = isArticleDetail;

        return () => {
            cancelled = true;
        };
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

    const warmRoute = (href: string) => {
        if (href.startsWith("/")) router.prefetch(href);
    };

    const activateRoute = (href: string) => {
        navRef.current?.classList.remove(HIDDEN_NAV_CLASS);
        hiddenRef.current = false;
        setOptimisticHref(href);
        vibrate();
        warmRoute(href);
    };

    const navigateImmediately = (href: string) => {
        activateRoute(href);

        if (isHrefActive(href)) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        navigatingHrefRef.current = href;
        router.push(href);
    };

    const handleSharePointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
        if (event.pointerType === "mouse") {
            activateRoute("/paylas");
            return;
        }

        navigateImmediately("/paylas");
    };

    const handleShareClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (navigatingHrefRef.current === "/paylas") {
            event.preventDefault();
            return;
        }

        activateRoute("/paylas");
    };

    return (
        <div
            ref={navRef}
            className={cn(
                "fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans transition-transform duration-200 ease-out transform-gpu",
                isArticleDetail ? "translate-y-[calc(100%+1rem)]" : "translate-y-0"
            )}
        >
            <nav aria-label="Mobil navigasyon" className={cn(
                "w-full h-[calc(64px+env(safe-area-inset-bottom))] bg-[#101013]/88 backdrop-blur-md border-t border-white/10 flex items-start justify-around px-2 pt-1.5 pb-[env(safe-area-inset-bottom)] relative shadow-[0_-10px_30px_rgba(0,0,0,0.38)]"
            )}>
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <div className="flex items-center justify-around w-full">
                    <NavItem
                        id="nav-item-home"
                        href="/"
                        icon={Home}
                        label="Ana Sayfa"
                        isActive={(optimisticHref ?? pathname) === "/"}
                        onActivate={activateRoute}
                        onNavigateImmediately={navigateImmediately}
                        navigatingHrefRef={navigatingHrefRef}
                    />

                    <NavItem
                        id="nav-item-feed"
                        href="/makale"
                        icon={BookOpen}
                        label="Keşfet"
                        isActive={(optimisticHref ?? pathname).startsWith("/makale")}
                        onActivate={activateRoute}
                        onNavigateImmediately={navigateImmediately}
                        navigatingHrefRef={navigatingHrefRef}
                    />

                    <div className="relative -top-4 z-20">
                        <Link
                            id="nav-item-share"
                            href="/paylas"
                            className="relative block touch-manipulation"
                            onPointerDown={handleSharePointerDown}
                            onClick={handleShareClick}
                            onTouchStart={() => warmRoute("/paylas")}
                            onFocus={() => warmRoute("/paylas")}
                        >
                            <div
                                className="
                                    flex items-center justify-center
                                    w-14 h-14
                                    bg-[#EAB308]
                                    border-2 border-black
                                    rounded-full
                                    shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                                    ring-2 ring-white/80
                                    group
                                    relative
                                    overflow-hidden
                                    transition-transform duration-150
                                    active:scale-90 active:rotate-[15deg]
                                "
                            >
                                <Plus className="w-6 h-6 text-black stroke-[3px] group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                            </div>
                        </Link>
                    </div>

                    <NavItem
                        id="nav-item-forum"
                        href="/forum"
                        icon={MessageCircle}
                        label="Forum"
                        isActive={(optimisticHref ?? pathname).startsWith("/forum")}
                        onActivate={activateRoute}
                        onNavigateImmediately={navigateImmediately}
                        navigatingHrefRef={navigatingHrefRef}
                    />

                    <NavItem
                        id="nav-item-profile"
                        href="/profil"
                        icon={User}
                        label="Profil"
                        isActive={(optimisticHref ?? pathname).startsWith("/profil")}
                        onActivate={activateRoute}
                        onNavigateImmediately={navigateImmediately}
                        navigatingHrefRef={navigatingHrefRef}
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
    isActive,
    onActivate,
    onNavigateImmediately,
    navigatingHrefRef
}: {
    id?: string;
    href: string;
    icon: LucideIcon;
    label: string;
    isActive: boolean;
    onActivate: (href: string) => void;
    onNavigateImmediately: (href: string) => void;
    navigatingHrefRef: React.MutableRefObject<string | null>;
}) {
    const handlePointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
        if (event.pointerType === "mouse") {
            onActivate(href);
            return;
        }

        onNavigateImmediately(href);
    };

    const handleNavItemClick = (e: React.MouseEvent) => {
        if (navigatingHrefRef.current === href) {
            e.preventDefault();
            return;
        }

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
            onClick={handleNavItemClick}
            onPointerDown={handlePointerDown}
            onTouchStart={() => onActivate(href)}
            onFocus={() => onActivate(href)}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                "flex flex-col items-center justify-center min-w-[58px] min-h-[52px] relative group z-10 touch-manipulation",
                isActive ? "text-white" : "text-zinc-500"
            )}
        >
            <div
                className="flex flex-col items-center gap-0.5 relative transition-transform duration-150 active:scale-x-110 active:scale-y-90"
            >
                {isActive && (
                    <div
                        className="
                            absolute inset-0 
                            bg-white/10
                            border border-white/10
                            rounded-[8px]
                            shadow-[inset_0_1px_6px_rgba(0,0,0,0.25)]
                        "
                    />
                )}

                <div className={cn(
                    "p-2 rounded-[8px] transition-all duration-200 relative z-10",
                    !isActive && "group-hover:bg-white/5"
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
                                "w-[22px] h-[22px] transition-all duration-200",
                                isActive ? "stroke-[2.75px]" : "stroke-[2px]"
                            )}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}
