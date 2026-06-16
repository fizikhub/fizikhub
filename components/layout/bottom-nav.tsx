"use client";

import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useScroll, useVelocity, useMotionValueEvent, useMotionValue, animate } from "framer-motion";

import { DankLogo } from "@/components/brand/dank-logo";

const PRIMARY_ROUTES = ["/", "/makale", "/paylas", "/forum", "/profil"];

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { scrollY, scrollYProgress } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Performance: Instead of React state, use a MotionValue to prevent re-renders on scroll
    const [isAtBottom, setIsAtBottom] = useState(false);
    const navY = useMotionValue(0);
    const targetYRef = useRef(0);
    const isAtBottomRef = useRef(false);
    const animationRef = useRef<ReturnType<typeof animate> | null>(null);
    const frameRef = useRef<number | null>(null);
    const prefetchedRoutesRef = useRef(new Set<string>());
    const lastScrollYRef = useRef(0);

    const warmRoute = useCallback((href: string) => {
        if (typeof href !== "string" || !href.startsWith("/")) return;
        if (prefetchedRoutesRef.current.has(href)) return;
        prefetchedRoutesRef.current.add(href);
        router.prefetch(href);
    }, [router]);

    useEffect(() => {
        const prefetchRoutes = () => PRIMARY_ROUTES.forEach(warmRoute);

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(prefetchRoutes, { timeout: 1500 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(prefetchRoutes, 450);
        return () => globalThis.clearTimeout(timeoutId);
    }, [warmRoute]);

    useEffect(() => () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        animationRef.current?.stop();
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

        frameRef.current = requestAnimationFrame(() => {
            const velocity = scrollVelocity.get();
            const previous = lastScrollYRef.current;
            const diff = latest - previous;
            lastScrollYRef.current = latest;
            let targetY = targetYRef.current;

            // Detect if at bottom using scrollYProgress to avoid layout thrashing
            // (document.body.offsetHeight triggers forced reflow)
            const progress = scrollYProgress.get();
            const shouldShowBottomState = isAtBottomRef.current ? progress > 0.92 : progress > 0.97;

            if (isAtBottomRef.current !== shouldShowBottomState) {
                isAtBottomRef.current = shouldShowBottomState;
                setIsAtBottom(shouldShowBottomState);
            }

            if (shouldShowBottomState) {
                targetY = 0;
            } else {
                if (latest < 50) {
                    targetY = 0;
                } else if (diff > 7 || velocity > 180) {
                    targetY = 120;
                } else if (diff < -5 || velocity < -120) {
                    targetY = 0;
                }
            }

            if (targetYRef.current !== targetY) {
                targetYRef.current = targetY;
                animationRef.current?.stop();
                animationRef.current = animate(navY, targetY, {
                    type: "spring",
                    stiffness: 420,
                    damping: targetY === 0 ? 38 : 44,
                    mass: 0.75,
                    restDelta: 0.25,
                    restSpeed: 18
                });
            }
        });
    });

    // Haptic feedback helper
    const vibrate = useCallback(() => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10); // Ultra light vibration
        }
    }, []);

    return (
        <m.div
            style={{ y: navY }}

            className="fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans transform-gpu will-change-transform"
        >
            <nav aria-label="Mobil navigasyon" className={cn(
                "w-full transition-[height,background-color,box-shadow,border-color] duration-300 overflow-visible",
                isAtBottom
                    ? "h-[70px] bg-zinc-950/88"
                    : "h-[50px] bg-white/92 dark:bg-[#101012]/92",
                "backdrop-blur-2xl border-t border-black/10 dark:border-white/12 flex items-center justify-around px-2 pb-safe relative",
                "shadow-[0_-8px_22px_rgba(0,0,0,0.14)] dark:shadow-[0_-12px_28px_rgba(0,0,0,0.46)]"
            )}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/5 dark:bg-white/14" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-white/55 to-transparent opacity-70 dark:from-white/8" />
                <div className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#FACC15]/45 to-transparent" />


                <AnimatePresence mode="wait">
                    {!isAtBottom ? (
                        <m.div
                            key="nav-icons"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-around w-full"
                        >
                            <NavItem
                                id="nav-item-home"
                                href="/"
                                icon={Home}
                                label="Ana Sayfa"
                                isActive={pathname === "/"}
                                onInteract={vibrate}
                                onWarmRoute={warmRoute}
                            />

                            <NavItem
                                id="nav-item-feed"
                                href="/makale"
                                icon={BookOpen}
                                label="Keşfet"
                                isActive={pathname.startsWith("/makale")}
                                onInteract={vibrate}
                                onWarmRoute={warmRoute}
                            />

                            <div className="relative -top-3.5 z-20">
                                <div className="pointer-events-none absolute inset-[-4px] rounded-full bg-[#FACC15]/16 blur-sm dark:bg-[#FACC15]/18" />
                                <ViewTransitionLink
                                    id="nav-item-share"
                                    href="/paylas"
                                    className="relative block"
                                    onClick={vibrate}
                                    onPointerDown={() => warmRoute("/paylas")}
                                >
                                    <m.div
                                        animate={{ scale: 1 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeInOut"
                                        }}
                                        whileTap={{ scale: 0.9, rotate: 15 }}
                                        className="
                                            flex items-center justify-center
                                            w-11 h-11
                                            bg-gradient-to-b from-[#FFE26A] via-[#FACC15] to-[#EAB308]
                                            border-2 border-black dark:border-white
                                            rounded-full
                                            shadow-[2px_2px_0px_0px_rgba(0,0,0,1),0_0_0_4px_rgba(250,204,21,0.14)]
                                            dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.42),0_0_0_4px_rgba(250,204,21,0.13)]
                                            group
                                            relative
                                            overflow-hidden
                                        "
                                    >
                                        <span className="absolute inset-x-2 top-1 h-2 rounded-full bg-white/45 blur-[1px]" />
                                        <Plus className="w-5 h-5 text-black stroke-[3px] group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                                    </m.div>
                                </ViewTransitionLink>
                            </div>

                            <NavItem
                                id="nav-item-forum"
                                href="/forum"
                                icon={MessageCircle}
                                label="Forum"
                                isActive={pathname.startsWith("/forum")}
                                onInteract={vibrate}
                                onWarmRoute={warmRoute}
                            />

                            <NavItem
                                id="nav-item-profile"
                                href="/profil"
                                icon={User}
                                label="Profil"
                                isActive={pathname.startsWith("/profil")}
                                onInteract={vibrate}
                                onWarmRoute={warmRoute}
                            />
                        </m.div>
                    ) : (
                        <m.div
                            key="copyright-info"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center gap-1 py-1"
                        >
                            <div className="scale-[0.45] origin-center -my-3">
                                <DankLogo />
                            </div>
                            <span
                                className="font-black text-[10px] tracking-[0.2em] uppercase text-center"
                                style={{
                                    background: 'linear-gradient(90deg, #f97316, #ef4444, #f97316)',
                                    backgroundSize: '200% 100%',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 5px rgba(249,115,22,0.3))',
                                    animation: 'shimmer-nav 3s ease-in-out infinite',
                                }}
                            >
                                İzinsiz kopyalayanı kara deliğe atarız.
                            </span>

                        </m.div>
                    )}
                </AnimatePresence>
            </nav>
        </m.div>
    );
}

function NavItem({ id, href, icon: Icon, label, isActive, onInteract, onWarmRoute }: { id?: string; href: string; icon: LucideIcon; label: string; isActive: boolean; onInteract: () => void; onWarmRoute: (href: string) => void }) {
    const handleNavItemClick = (e: React.MouseEvent) => {
        onInteract();
        if (isActive) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <ViewTransitionLink
            id={id}
            href={href}
            onClick={handleNavItemClick}
            onPointerDown={() => onWarmRoute(href)}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                "flex flex-col items-center justify-center min-w-[55px] h-full relative group z-10 touch-manipulation",
                isActive ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-500"
            )}
        >
            <m.div
                whileTap={{ scaleX: 1.25, scaleY: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex flex-col items-center justify-center gap-0.5 relative h-full"
            >
                {isActive && (
                    <m.div
                        layoutId="nav-item-background"
                        className="
                            absolute left-1/2 top-1/2 h-9 w-11 -translate-x-1/2 -translate-y-1/2
                            bg-gradient-to-b from-white to-zinc-100 dark:from-white/16 dark:to-white/7
                            border border-black/10 dark:border-white/10
                            rounded-[14px]
                            shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_14px_rgba(0,0,0,0.12)]
                            dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_16px_rgba(0,0,0,0.32)]
                        "
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                )}

                <div className={cn(
                    "p-1.5 rounded-lg transition-all duration-200 relative z-10",
                    !isActive && "group-hover:bg-black/5 dark:group-hover:bg-white/7 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                )}>
                    <m.div
                        initial={false}
                        animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        <Icon
                            fill={isActive ? "currentColor" : "none"}
                            className={cn(
                                "w-5 h-5 transition-all duration-200",
                                isActive ? "stroke-[2.75px]" : "stroke-[2px]"
                            )}
                        />
                    </m.div>
                </div>
            </m.div>
        </ViewTransitionLink>
    );
}
