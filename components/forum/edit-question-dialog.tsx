"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2, Loader2 } from "lucide-react";
import { MarkdownEditor } from "@/components/markdown-editor";
import { updateQuestion } from "@/app/forum/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditQuestionDialogProps {
    questionId: number;
    initialContent: string;
}

export function EditQuestionDialog({ questionId, initialContent }: EditQuestionDialogProps) {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleUpdate = async () => {
        if (!content.trim()) {
            toast.error("İçerik boş olamaz.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateQuestion(questionId, content);
            if (result.success) {
                toast.success("Soru başarıyla güncellendi.");
                setOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Soruyu Düzenle</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto py-4">
                    <MarkdownEditor
                        value={content}
                        onChange={setContent}
                        minHeight="400px"
                    />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                        İptal
                    </Button>
                    <Button onClick={handleUpdate} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Güncelleniyor...
                            </>
                        ) : (
                            "Kaydet"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
