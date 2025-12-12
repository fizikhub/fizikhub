import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";

interface ScrollToAnswerButtonProps {
    className?: string;
}

export function ScrollToAnswerButton({ className }: ScrollToAnswerButtonProps) {
    const [supabase] = useState(() => createClient());

    const handleClick = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            toast("GİRİŞ YAPMAN GEREKİYOR", {
                description: "Cevap yazmak için giriş yapmalısın. Hadi, topluluk seni bekliyor!",
                action: {
                    label: "GİRİŞ YAP",
                    onClick: () => window.location.href = "/login"
                },
            });
            return;
        }

        const formElement = document.getElementById('answer-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Optional: Focus the editor if possible, but scroll is good enough
        } else {
            // Fallback if element not found but user is logged in
            toast.error("Cevap formu yüklenemedi.");
        }
    };

    return (
        <Button
            onClick={handleClick}
            className={cn("w-full sm:w-auto px-6 py-3 border-2 border-primary hover:border-primary/80 active:scale-95 transition-all font-bold text-base", className)}
        >
            📝 Cevap Yaz
        </Button>
    );
}
