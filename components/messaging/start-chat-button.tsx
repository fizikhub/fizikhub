"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { startConversation } from "@/app/mesajlar/actions";
import { toast } from "sonner";
import { useState } from "react";

interface StartChatButtonProps {
    otherUserId: string;
}

export function StartChatButton({ otherUserId }: StartChatButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleStartChat = async () => {
        setLoading(true);
        try {
            const result = await startConversation(otherUserId);
            if (!result?.success && result?.error) {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleStartChat} disabled={loading} size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary border-0 shadow-sm transition-all hover:scale-105" title="Mesaj Gönder">
            <MessageCircle className="h-5 w-5" />
            <span className="sr-only">Mesaj Gönder</span>
        </Button>
    );
}
