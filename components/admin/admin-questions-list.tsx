"use client";

import { useState } from "react";
import { Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteQuestion } from "@/app/admin/actions";
import { Question } from "@/lib/api";

interface AdminQuestionsListProps {
    initialQuestions: (Question & { answer_count?: number })[];
}

export function AdminQuestionsList({ initialQuestions }: AdminQuestionsListProps) {
    const [questions, setQuestions] = useState(initialQuestions);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        const result = await deleteQuestion(deleteId);

        if (result.success) {
            setQuestions(questions.filter(q => q.id !== deleteId));
            toast.success("Soru ve cevapları silindi");
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }

        setIsDeleting(false);
        setDeleteId(null);
    };

    const questionToDelete = questions.find(q => q.id === deleteId);

    return (
        <>
            <div className="space-y-4">
                {questions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Henüz soru yok.</p>
                ) : (
                    questions.map((question) => (
                        <Card key={question.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{question.title}</CardTitle>
                                        <div className="flex items-center gap-4 mt-2">
                                            <p className="text-sm text-muted-foreground">
                                                {question.category} • {new Date(question.created_at).toLocaleDateString('tr-TR')}
                                            </p>
                                            {question.answer_count !== undefined && (
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3" />
                                                    {question.answer_count} cevap
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setDeleteId(question.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            {question.content && (
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{question.content}</p>
                                </CardContent>
                            )}
                        </Card>
                    ))
                )}
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Soruyu sil?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz. Soru ve {questionToDelete?.answer_count || 0} cevabı kalıcı olarak silinecek.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Siliniyor..." : "Sil"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
