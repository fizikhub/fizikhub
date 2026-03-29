"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Author {
    id?: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    is_verified?: boolean;
    is_writer?: boolean;
}

interface AuthorCardProps {
    author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
    const displayName = author.full_name || author.username || "Anonim Yazar";
    const username = author.username || "anonim";

    return (
        <div className="relative p-4 sm:p-7 bg-white dark:bg-[#27272a] border-2 sm:border-[3px] border-black dark:border-zinc-700 rounded-lg sm:rounded-[8px] shadow-[3px_3px_0px_#000] sm:shadow-[6px_6px_0px_#000] hover:shadow-[4px_4px_0px_#000] sm:hover:shadow-[8px_8px_0px_#000] hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden">
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />


            <div className="flex items-start gap-3 sm:gap-5 relative z-10">
                {/* Avatar */}
                <Link prefetch={false} href={`/kullanici/${username}`} className="shrink-0 mt-0.5 sm:mt-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 sm:border-[3px] border-black dark:border-zinc-600 overflow-hidden bg-zinc-100 shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] group-hover:shadow-[3px_3px_0px_0px_#FFC800] sm:group-hover:shadow-[4px_4px_0px_0px_#FFC800] transition-shadow">
                        <Image
                            src={author.avatar_url || "/images/default-avatar.png"}
                            alt={displayName}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1 sm:mb-1.5">
                        <Link prefetch={false} href={`/kullanici/${username}`}
                            className="font-black text-[15px] sm:text-lg text-foreground hover:text-[#FFC800] transition-colors tracking-tight leading-none"
                        >
                            {displayName}
                        </Link>
                        {author.is_writer && (
                            <span className="text-[10px] font-black px-1.5 sm:px-2 py-0.5 bg-[#FFC800] text-black border-2 border-black rounded-[4px] shadow-[1px_1px_0px_0px_#000] uppercase pt-[3px]">
                                Yazar
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold text-muted-foreground mb-2 sm:mb-3 mt-[2px]">
                        @{username}
                    </p>
                    {author.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                            {author.bio}
                        </p>
                    )}
                    <Link prefetch={false} href={`/kullanici/${username}`}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-foreground hover:text-[#FFC800] mt-3 uppercase tracking-wider transition-colors group/link"
                    >
                        <span>Profilini Gör</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[3px] group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
