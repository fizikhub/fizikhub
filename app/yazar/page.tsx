import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, CheckCircle, XCircle, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default async function WriterDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is a writer
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_writer")
        .eq("id", user.id)
        .single();

    if (!profile?.is_writer) {
        redirect("/");
    }

    const { data: articles } = await supabase
        .from("articles")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="container max-w-5xl py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Yazar Paneli</h1>
                    <p className="text-muted-foreground mt-1">Makalelerinizi yönetin ve yeni içerikler oluşturun.</p>
                </div>
                <Link href="/yazar/yeni">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Makale
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {!articles || articles.length === 0 ? (
                    <div className="text-center py-20 border rounded-xl bg-muted/20 border-dashed">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
                        <h3 className="text-lg font-medium">Henüz makaleniz yok</h3>
                        <p className="text-muted-foreground mb-6">İlk makalenizi yazarak topluluğa katkıda bulunun.</p>
                        <Link href="/yazar/yeni">
                            <Button variant="outline">Blog Yaz</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <div key={article.id} className="group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <Badge
                                            variant={
                                                article.status === "published" ? "default" :
                                                    article.status === "rejected" ? "destructive" :
                                                        "secondary"
                                            }
                                            className="capitalize"
                                        >
                                            {article.status === "published" && <CheckCircle className="mr-1 h-3 w-3" />}
                                            {article.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                                            {article.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                                            {article.status === "published" ? "Yayında" :
                                                article.status === "rejected" ? "Reddedildi" :
                                                    "Onay Bekliyor"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {article.excerpt || article.content.substring(0, 100)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2">
                                    <Link href={`/yazar/${article.id}`} className="w-full">
                                        <Button variant="outline" className="w-full" size="sm">
                                            <Edit className="mr-2 h-3 w-3" />
                                            Düzenle
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
