"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAnswer } from "@/app/forum/actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

interface DeleteAnswerButtonProps {
    answerId: number;
    questionId: number;
    authorId: string;
}

export function DeleteAnswerButton({ answerId, questionId, authorId }: DeleteAnswerButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const supabase = createClient();

    useState(() => {
        const checkPermission = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const isAdmin = user.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';
            const isAuthor = user.id === authorId;

            if (isAdmin || isAuthor) {
                setCanDelete(true);
            }
        };
        checkPermission();
    });

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteAnswer(answerId, questionId);
            if (result.success) {
                toast.success("Cevap silindi.");
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!canDelete) return null;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cevabı silmek istediğinize emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting ? "Siliniyor..." : "Sil"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
