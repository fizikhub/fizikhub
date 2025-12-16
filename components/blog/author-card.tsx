"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
        <div className="flex items-start gap-4 p-6 rounded-xl bg-muted/50 border border-border">
            {/* Avatar */}
            <Link href={`/kullanici/${username}`} className="shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-muted">
                    <Image
                        src={author.avatar_url || "/images/default-avatar.png"}
                        alt={displayName}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                    />
                </div>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Link
                        href={`/kullanici/${username}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        {displayName}
                    </Link>
                    {author.is_writer && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            Yazar
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                    @{username}
                </p>
                {author.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {author.bio}
                    </p>
                )}
                <Link
                    href={`/kullanici/${username}`}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                >
                    Profilini gör
                    <ExternalLink className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}
