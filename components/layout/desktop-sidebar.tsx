"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Atom, Trophy, Book, Zap, Plus, User, LogIn, MessageCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DankLogo } from "@/components/brand/dank-logo";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import dynamic from "next/dynamic";

const PhysicsFactModal = dynamic(() => import("@/components/ui/physics-fact-modal").then(mod => mod.PhysicsFactModal), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/ui/command-palette").then(mod => mod.CommandPalette), { ssr: false });

const menuItems = [
    { href: '/', label: 'Ana Sayfa', icon: Home },
    { isAction: true, label: 'Ara', icon: Search, actionName: 'search' },
    { href: '/makale', label: 'Keşfet', icon: BookOpen },
    { href: '/forum', label: 'Forum', icon: MessageCircle },
    { href: '/simulasyonlar', label: 'Simülasyon', icon: Atom },
    { href: '/siralamalar', label: 'Sıhiyerarşi', icon: Trophy, override: 'Sıralama' },
    { href: '/sozluk', label: 'Sözlük', icon: Book },
    { isAction: true, label: "Hap Bilgi", icon: Zap, actionName: 'fact' },
];

export function DesktopSidebar() {
    const pathname = usePathname();
    const [factOpen, setFactOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<{ full_name?: string, username?: string, avatar_url?: string } | null>(null);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        let isMounted = true;
        
        const fetchProfile = async (userId: string) => {
            const { data } = await supabase.from('profiles').select('full_name, username, avatar_url').eq('id', userId).single();
            if (isMounted && data) {
                setUserProfile(data);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            if (isMounted) setUser(currentUser);
            
            if (currentUser) {
                fetchProfile(currentUser.id);
            } else {
                if (isMounted) setUserProfile(null);
            }
        });
        
        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

    return (
        <>
            <aside className="hidden md:flex flex-col fixed top-0 left-0 h-[100dvh] w-[80px] lg:w-[260px] bg-white dark:bg-background border-r-[3px] border-black z-50 transition-all duration-300">
                {/* 1. Logo Area */}
                <div className="h-[64px] flex items-center justify-center lg:justify-start lg:px-6 border-b-[3px] border-black shrink-0 relative overflow-hidden">
                    <ViewTransitionLink href="/" className="hover:scale-105 transition-transform origin-left z-10">
                        <div className="hidden lg:block">
                            <DankLogo />
                        </div>
                        <div className="lg:hidden w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_#FACC15]">
                            F
                        </div>
                    </ViewTransitionLink>
                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-[0.03] z-0 mix-blend-multiply pointer-events-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />
                </div>

                {/* 2. Scrollable Navigation List */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-6 flex flex-col gap-2 px-3 lg:px-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href!));
                        
                        const content = (
                            <div className={cn(
                                "flex items-center justify-center lg:justify-start gap-4 p-3 rounded-xl border-[3px] transition-all group cursor-pointer relative",
                                isActive 
                                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[4px_4px_0px_0px_#FACC15] translate-x-[-2px] translate-y-[-2px]" 
                                    : "border-transparent hover:bg-neutral-100 dark:hover:bg-[#27272a] hover:border-black hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                            )}>
                                <item.icon className={cn(
                                    "w-6 h-6 shrink-0 stroke-[2.5px] transition-colors",
                                    isActive ? "text-[#FACC15] dark:text-black" : "text-black dark:text-white"
                                )} />
                                <span className={cn(
                                    "hidden lg:block font-[family-name:var(--font-outfit)] font-black uppercase tracking-tight text-lg transition-colors",
                                    isActive ? "text-white dark:text-black" : "text-black dark:text-white"
                                )}>
                                    {item.override || item.label}
                                </span>
                            </div>
                        );

                        if (item.isAction) {
                            return (
                                <button 
                                    key={item.label} 
                                    onClick={() => {
                                        if (item.actionName === 'search') setSearchOpen(true);
                                        if (item.actionName === 'fact') setFactOpen(true);
                                    }} 
                                    className="w-full text-left outline-none block"
                                >
                                    {content}
                                </button>
                            );
                        }

                        return (
                            <ViewTransitionLink key={item.href} href={item.href!} className="w-full outline-none block">
                                {content}
                            </ViewTransitionLink>
                        );
                    })}

                    {/* Massive Action Button (Post/Create) */}
                    <div className="mt-6 lg:mt-8">
                        <ViewTransitionLink href="/paylas" className="block w-full outline-none">
                            <div className="flex items-center justify-center lg:justify-start lg:gap-3 p-3 lg:px-4 bg-[#FFBD2E] rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group">
                                <Plus className="w-6 h-6 shrink-0 text-black stroke-[3px] group-hover:rotate-90 transition-transform" />
                                <span className="hidden lg:block font-[family-name:var(--font-outfit)] font-black uppercase text-black text-[17px] tracking-tight whitespace-nowrap">
                                    Yeni Gönderi
                                </span>
                            </div>
                        </ViewTransitionLink>
                    </div>
                </div>

                {/* 3. Footer / User Profile Tab */}
                <div className="p-3 lg:p-4 border-t-[3px] border-black shrink-0 relative flex justify-center lg:justify-start overflow-hidden bg-white/50 dark:bg-[#18181b]/50">
                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />
                    {user ? (
                        <ViewTransitionLink href="/profil" className="block w-full outline-none">
                            <div className="relative z-10 flex items-center justify-center lg:justify-start gap-3 p-2 lg:p-3 rounded-xl border-[3px] border-transparent hover:border-black hover:bg-neutral-100 dark:hover:bg-[#27272a] hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group cursor-pointer w-full">
                                <div className="w-10 h-10 rounded-[8px] border-[3px] border-black bg-[#FACC15] flex items-center justify-center shrink-0 overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                                     {userProfile?.avatar_url || user.user_metadata?.avatar_url ? (
                                        <img src={userProfile?.avatar_url || user.user_metadata?.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                     ) : (
                                         <User className="w-5 h-5 text-black stroke-[3px]" />
                                     )}
                                </div>
                                <div className="hidden lg:flex flex-col overflow-hidden">
                                    <span className="font-bold text-[13px] uppercase truncate text-black dark:text-white leading-tight">
                                        {userProfile?.full_name || user.user_metadata?.full_name || userProfile?.username || user.user_metadata?.username || "Profilim"}
                                    </span>
                                    <span className="text-[10px] font-black text-neutral-400 dark:text-zinc-500 uppercase truncate">
                                        @{userProfile?.username || user.user_metadata?.username || "kullanici"}
                                    </span>
                                </div>
                            </div>
                        </ViewTransitionLink>
                    ) : (
                        <ViewTransitionLink href="/login" className="block w-full outline-none">
                            <div className="relative z-10 flex items-center justify-center lg:justify-start gap-3 p-2 lg:p-3 rounded-xl border-[3px] border-black bg-white dark:bg-[#27272a] shadow-[4px_4px_0px_0px_#000] hover:bg-[#FFBD2E] dark:hover:bg-[#FFBD2E] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group w-full">
                                <LogIn className="w-5 h-5 shrink-0 text-black dark:text-white group-hover:text-black stroke-[3px]" />
                                <span className="hidden lg:block font-[family-name:var(--font-outfit)] font-black uppercase text-sm text-black dark:text-white group-hover:text-black">
                                    Giriş Yap
                                </span>
                            </div>
                        </ViewTransitionLink>
                    )}
                </div>
            </aside>

            <PhysicsFactModal open={factOpen} onOpenChange={setFactOpen} />
            <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
