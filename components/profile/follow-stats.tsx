import { Users } from "lucide-react";

interface FollowStatsProps {
    followers: number;
    following: number;
}

export function FollowStats({ followers, following }: FollowStatsProps) {
    return (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                <span className="font-bold text-foreground">{followers.toLocaleString('tr-TR')}</span>
                <span>Takipçi</span>
            </div>
            <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                <span className="font-bold text-foreground">{following.toLocaleString('tr-TR')}</span>
                <span>Takip Edilen</span>
            </div>
        </div>
    );
}
