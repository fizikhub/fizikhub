"use client";

import React from "react";
import Link from "next/link";
import { Home, Search, Compass, User, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MobileNavbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", icon: Home, label: "Ana" },
        { href: "/makale", icon: Compass, label: "Keşfet" },
        { href: "/ozel", icon: Zap, label: "Özel", isPrimary: true }, // Central Action
        { href: "/ara", icon: Search, label: "Ara" },
        { href: "/profil", icon: User, label: "Ben" },
    ];

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
            {/* 
        ATOM KURAL 2: SINIR MATEMATİĞİ (3px Solid Black)
        ATOM KURAL 3: RENK KİMYASI (Yellow Background for Dock)
        ATOM KURAL 1: GÖLGE FİZİĞİ (5px Hard Shadow)
      */}
            <div className="flex items-center justify-between px-2 py-2 bg-[#facc15] border-[3px] border-black shadow-neo rounded-xl">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    if (link.isPrimary) {
                        return (
                            <motion.div
                                key={link.href}
                                className="relative -top-6"
                                whileTap={{ scale: 0.9 }}
                            >
                                <Link
                                    href={link.href}
                                    className="flex items-center justify-center w-14 h-14 bg-[#8b5cf6] border-[3px] border-black shadow-neo text-white rounded-lg"
                                >
                                    <Icon className="w-7 h-7 stroke-[3px]" />
                                </Link>
                            </motion.div>
                        )
                    }

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg transition-all",
                                isActive ? "bg-black text-white" : "text-black hover:bg-black/10"
                            )}
                        >
                            <Icon className={cn("w-6 h-6 stroke-[3px]", isActive ? "stroke-white" : "stroke-black")} />
                            {/* <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">{link.label}</span> */}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
