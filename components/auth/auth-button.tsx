"use client";

import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OptimizedAvatar } from "@/components/ui/optimized-image";
import { isAdminEmail } from "@/lib/admin-shared";

export function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    // Fix: Initialize supabase client once
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);

            if (session?.user) {


                const userEmail = session.user.email;
                const isEmailMatch = isAdminEmail(userEmail);

                if (isEmailMatch) {
                    setIsAdmin(true);
                } else {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single();

                    setIsAdmin(profile?.role === 'admin');
                }
            } else {
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    if (!user) {
        return (
            <Link href="/login" >
                <Button variant="default" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" /> Giriş Yap
                </Button>
            </Link>
        );
    }

    const avatarUrl = user?.user_metadata?.avatar_url || null;
    const displayName = user?.user_metadata?.full_name || "Kullanıcı";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <OptimizedAvatar
                        src={avatarUrl}
                        alt={user?.email || ""}
                        size={32}
                        className=""
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link  href="/admin" className="cursor-pointer text-red-500 font-bold">
                                <Shield className="mr-2 h-4 w-4" />
                                Admin Paneli
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem asChild>
                    <Link  href="/profil" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profilim
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
