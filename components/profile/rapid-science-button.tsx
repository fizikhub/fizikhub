"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RapidScienceEditorModal } from "@/components/science-cards/rapid-science-editor-modal";

export function RapidScienceButton() {
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditorOpen(true)}
                className="rounded-full border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500 text-amber-500 transition-all"
                title="Hızlı Bilim Paylaş"
            >
                <Sparkles className="h-4 w-4" />
            </Button>

            <RapidScienceEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
        </>
    );
}
