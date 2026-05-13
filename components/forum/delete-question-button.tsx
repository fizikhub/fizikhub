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
import { deleteQuestion } from "@/app/forum/actions";
import { toast } from "sonner";

interface DeleteQuestionButtonProps {
    questionId: number;
}

export function DeleteQuestionButton({ questionId }: DeleteQuestionButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteQuestion(questionId);
            if (result.success) {
                toast.success("Soru başarıyla silindi.");
            } else {
                toast.error(result.error || "Soru silinirken bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Sil
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Soruyu silmek istediğine emin misin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bu işlem geri alınamaz. Sonra deme vay efendim benim sorum gitti..
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {isDeleting ? "Siliniyor..." : "Evet, Sil"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
