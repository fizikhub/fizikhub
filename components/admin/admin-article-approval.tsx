"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ExternalLink, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import { approveArticle, rejectArticle } from "@/app/admin/actions";
import Link from "next/link";

interface AdminArticleApprovalProps {
    pendingArticles: any[];
}

export function AdminArticleApproval({ pendingArticles }: AdminArticleApprovalProps) {
    const [articles, setArticles] = useState(pendingArticles);
    const [isLoading, setIsLoading] = useState<number | null>(null);

    const handleApprove = async (id: number) => {
        setIsLoading(id);
        try {
            const result = await approveArticle(id);
            if (result.success) {
                toast.success("Makale onaylandı ve yayınlandı.");
                setArticles(articles.filter(a => a.id !== id));
            } else {
                toast.error(result.error || "İşlem başarısız.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsLoading(null);
        }
    };

    const handleReject = async (id: number) => {
        setIsLoading(id);
        try {
            const result = await rejectArticle(id);
            if (result.success) {
                toast.success("Makale reddedildi.");
                setArticles(articles.filter(a => a.id !== id));
            } else {
                toast.error(result.error || "İşlem başarısız.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsLoading(null);
        }
    };

    if (articles.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/20 border-dashed">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500/20 mb-4" />
                <h3 className="text-lg font-medium">Bekleyen makale yok</h3>
                <p className="text-muted-foreground">Tüm makaleler incelendi.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {articles.map((article) => (
                <Card key={article.id}>
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                                        <Clock className="mr-1 h-3 w-3" />
                                        Onay Bekliyor
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                    </span>
                                </div>
                                <CardTitle className="text-lg leading-tight">
                                    {article.title}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Yazar: <span className="font-medium text-foreground">{article.author?.full_name || article.author?.username}</span></span>
                                    <span>•</span>
                                    <span>Kategori: {article.category}</span>
                                </div>
                            </div>
                            <Link href={`/blog/${article.slug}`} target="_blank">
                                <Button variant="ghost" size="icon">
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {article.excerpt || article.content.substring(0, 200)}
                        </p>

                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleReject(article.id)}
                                disabled={isLoading === article.id}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reddet
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApprove(article.id)}
                                disabled={isLoading === article.id}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Yayınla
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
