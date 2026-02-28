"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { startConversation } from "@/app/mesajlar/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface StartChatButtonProps {
    otherUserId: string;
}

export function StartChatButton({ otherUserId }: StartChatButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleStartChat = async () => {
        setLoading(true);
        try {
            const result = await startConversation(otherUserId);
            if (!result?.success && result?.error) {
                toast.error(result.error);
            } else if (result?.success && result?.conversationId) {
                router.push(`/mesajlar/${result.conversationId}`);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleStartChat}
            disabled={loading}
            size="icon"
            variant="secondary"
            className="rounded-full h-10 w-10 bg-[#FACC15]/10 hover:bg-[#FACC15]/20 text-[#FACC15] border-0 shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Mesaj Gönder"
        >
            <MessageCircle className="h-5 w-5" />
            <span className="sr-only">Mesaj Gönder</span>
        </Button>
    );
}
