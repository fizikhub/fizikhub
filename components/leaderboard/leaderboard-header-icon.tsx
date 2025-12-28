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
                className="bg-yellow-500 text-yellow-950 p-3 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] cursor-pointer hover:scale-105 transition-transform active:scale-95 select-none"
                onDoubleClick={handleDoubleClick}
                title="Çift tıkla!"
            >
                <Trophy className="h-8 w-8" />
            </div>
        </>
    );
}
