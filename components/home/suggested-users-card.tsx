"use client";

import { motion } from "framer-motion";
import { UserPlus, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface SuggestedUser {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    is_writer: boolean;
    is_verified: boolean;
    bio: string;
}

interface SuggestedUsersCardProps {
    users: SuggestedUser[];
}

export function SuggestedUsersCard({ users }: SuggestedUsersCardProps) {
    const [following, setFollowing] = useState<string[]>([]);

    const handleFollow = (id: string) => {
        if (following.includes(id)) {
            setFollowing(following.filter(f => f !== id));
            toast.info("Takip bırakıldı.");
        } else {
            setFollowing([...following, id]);
            toast.success("Takip edildi!");
        }
    };

    if (!users || users.length === 0) return null;

    return (
        <div className="my-8">
            <div className="flex items-center gap-2 mb-4 px-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-black text-lg text-foreground tracking-tight">Takip Önerileri</h3>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide snap-x">
                {users.map((user, i) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex-shrink-0 w-48 snap-center"
                    >
                        <div className="flex flex-col items-center p-5 bg-card border border-border rounded-2xl text-center hover:border-amber-500/30 hover:shadow-lg transition-all duration-300 group">
                            <div className="relative mb-3">
                                <Avatar className="w-16 h-16 ring-2 ring-transparent group-hover:ring-amber-500/20 transition-all">
                                    <AvatarImage src={user.avatar_url} />
                                    <AvatarFallback className="text-lg font-bold bg-secondary">
                                        {user.username?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                {user.is_verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-card">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <Link href={`/kullanici/${user.username}`} className="font-bold text-foreground hover:text-primary truncate w-full mb-0.5">
                                {user.full_name || user.username}
                            </Link>
                            <div className="text-xs text-muted-foreground mb-4 truncate w-full">
                                {user.is_writer ? "Bilim Yazarı" : `@${user.username}`}
                            </div>

                            <Button
                                size="sm"
                                variant={following.includes(user.id) ? "secondary" : "default"}
                                className={`w-full rounded-full h-8 text-xs font-bold ${following.includes(user.id) ? "" : "bg-foreground text-background hover:bg-foreground/90"}`}
                                onClick={() => handleFollow(user.id)}
                            >
                                {following.includes(user.id) ? "Takip Ediliyor" : "Takip Et"}
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
