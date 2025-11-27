import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface AuthorCardProps {
    author: {
        username?: string | null;
        full_name?: string | null;
        avatar_url?: string | null;
        bio?: string | null;
    };
}

export function AuthorCard({ author }: AuthorCardProps) {
    const displayName = author.full_name || author.username || "Anonim";
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/50">
            <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                    <AvatarImage src={author.avatar_url || ""} />
                    <AvatarFallback className="text-xl bg-primary/5">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                        {displayName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                        @{author.username || "kullanici"}
                    </p>
                    {author.bio && (
                        <p className="text-sm text-muted-foreground/80">
                            {author.bio}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
