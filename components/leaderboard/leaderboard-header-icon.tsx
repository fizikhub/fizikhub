"use client";

import { Trophy } from "lucide-react";
import { useState } from "react";
import { ShyModeModal } from "./shy-mode-modal";

interface ShyUser {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    reputation: number;
    rank: number;
}

export function LeaderboardHeaderIcon({ silginimUser }: { silginimUser?: ShyUser | null }) {
    const [showShyModal, setShowShyModal] = useState(false);

    const handleDoubleClick = () => {
        setShowShyModal(true);
    };

    return (
        <>
            <ShyModeModal
                isOpen={showShyModal}
                onClose={() => setShowShyModal(false)}
                user={silginimUser}
            />
            <div
                className="bg-[#FACC15] text-black p-3 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:scale-105 transition-transform active:translate-y-[2px] active:shadow-none select-none"
                onDoubleClick={handleDoubleClick}
                title="Çift tıkla!"
            >
                <Trophy className="h-8 w-8 fill-black" />
            </div>
        </>
    );
}
