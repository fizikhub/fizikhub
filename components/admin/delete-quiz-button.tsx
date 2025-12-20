"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteQuiz } from "@/app/admin/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteQuizButtonProps {
    quizId: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    showText?: boolean;
    redirectAfter?: boolean;
}

export function DeleteQuizButton({
    quizId,
    variant = "destructive",
    size = "sm",
    className,
    showText = true,
    redirectAfter = false
}: DeleteQuizButtonProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Bu quizi ve bağlı tüm soruları silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
            return;
        }

        startTransition(async () => {
            try {
                const result = await deleteQuiz(quizId);
                if (result.success) {
                    toast.success("Quiz başarıyla silindi.");
                    if (redirectAfter) {
                        router.push("/admin/quizzes");
                    }
                } else {
                    toast.error(`Hata: ${result.error}`);
                }
            } catch (error) {
                toast.error("Bir hata oluştu.");
                console.error(error);
            }
        });
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleDelete}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
            {showText && <span className="ml-2">Sil</span>}
        </Button>
    );
}
