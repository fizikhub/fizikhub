"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function BottomNav() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 50 || currentScrollY < lastScrollY) {
                setIsVisible(true);
            }
            else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div className={cn(
            "fixed bottom-4 left-4 right-4 z-[50] md:hidden transition-all duration-500 ease-out font-sans",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
        )}>
            <nav className="
                w-full
                h-[62px]
                bg-white/80 dark:bg-zinc-900/80
                backdrop-blur-lg
                border-[2.5px] border-black dark:border-white/20
                flex items-center justify-around
                px-2
                relative
                rounded-2xl
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]
            ">
                <NavItem
                    href="/"
                    icon={Home}
                    label="Akış"
                    isActive={pathname === "/"}
                />

                <NavItem
                    href="/makale"
                    icon={BookOpen}
                    label="Makale"
                    isActive={pathname.startsWith("/makale")}
                />

                <ViewTransitionLink
                    href="/paylas"
                    className="
                        flex items-center justify-center
                        w-12 h-12
                        bg-[#FACC15]
                        border-2 border-black
                        rounded-xl
                        shadow-[2px_2px_0px_0px_#000]
                        active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                        transition-all
                        -mt-8
                        relative z-10
                    "
                >
                    <Plus className="w-6 h-6 text-black stroke-[3px]" />
                </ViewTransitionLink>

                <NavItem
                    href="/forum"
                    icon={MessageCircle}
                    label="Forum"
                    isActive={pathname.startsWith("/forum")}
                />

                <NavItem
                    href="/profil"
                    icon={User}
                    label="Profil"
                    isActive={pathname.startsWith("/profil")}
                />
            </nav>
        </div>
    );
}

function NavItem({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) {
    return (
        <ViewTransitionLink
            href={href}
            className={cn(
                "flex flex-col items-center justify-center min-w-[50px] h-full relative group transition-all duration-300",
                isActive ? "text-black dark:text-white" : "text-black/40 dark:text-white/40"
            )}
        >
            <motion.div
                initial={false}
                animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={cn(
                    "p-1.5 rounded-xl transition-colors duration-300 flex flex-col items-center gap-0.5",
                    isActive && "bg-[#FACC15] border-[1.5px] border-black shadow-[2px_2px_0px_0px_#000]"
                )}
            >
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                <span className={cn(
                    "text-[9px] font-black uppercase tracking-tight",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                    {label}
                </span>
            </motion.div>
        </ViewTransitionLink>
    );
}
