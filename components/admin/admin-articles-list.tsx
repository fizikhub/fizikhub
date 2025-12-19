"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
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
import { deleteArticle } from "@/app/admin/actions";
import { Article } from "@/lib/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface AdminArticlesListProps {
    initialArticles: Article[];
}

export function AdminArticlesList({ initialArticles }: AdminArticlesListProps) {
    const [articles, setArticles] = useState(initialArticles);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        const result = await deleteArticle(deleteId);

        if (result.success) {
            setArticles(articles.filter(a => a.id !== deleteId));
            toast.success("Makale silindi");
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }

        setIsDeleting(false);
        setDeleteId(null);
    };

    const getStatusBadge = (status?: string | null) => {
        switch (status) {
            case 'published':
                return <Badge variant="default" className="bg-green-600">Yayında</Badge>;
            case 'draft':
                return <Badge variant="secondary">Taslak</Badge>;
            case 'pending':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Beklemede</Badge>;
            default:
                return <Badge variant="outline">{status || 'Bilinmiyor'}</Badge>;
        }
    };

    return (
        <>
            <div className="space-y-4">
                {articles.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Henüz makale yok.</p>
                ) : (
                    articles.map((article) => (
                        <Card key={article.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">{article.title}</CardTitle>
                                            {getStatusBadge(article.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {article.category} • {new Date(article.created_at).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/articles/${article.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setDeleteId(article.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            {article.excerpt && (
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                                </CardContent>
                            )}
                        </Card>
                    ))
                )}
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Makaleyi sil?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz. Makale kalıcı olarak silinecek.
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
