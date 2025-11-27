"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { deleteDictionaryTerm } from "@/app/admin/actions";
import { DictionaryTerm } from "@/lib/api";

interface AdminDictionaryListProps {
    initialTerms: DictionaryTerm[];
}

export function AdminDictionaryList({ initialTerms }: AdminDictionaryListProps) {
    const [terms, setTerms] = useState(initialTerms);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        const result = await deleteDictionaryTerm(deleteId);

        if (result.success) {
            setTerms(terms.filter(t => t.id !== deleteId));
            toast.success("Terim silindi");
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }

        setIsDeleting(false);
        setDeleteId(null);
    };

    return (
        <>
            <div className="space-y-4">
                {terms.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Henüz terim yok.</p>
                ) : (
                    terms.map((term) => (
                        <Card key={term.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{term.term}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {term.category || "Genel"}
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setDeleteId(term.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">{term.definition}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Terimi sil?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz. Terim kalıcı olarak silinecek.
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
