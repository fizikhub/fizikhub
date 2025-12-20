import { createClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, GraduationCap, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { DeleteQuizButton } from "@/components/admin/delete-quiz-button";

export default async function AdminQuizzesPage() {
    const supabase = await createClient();

    const { data: quizzes } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Testler (Quiz)</h1>
                    <p className="text-muted-foreground">
                        Sitedeki testleri yönet ve yenilerini oluştur.
                    </p>
                </div>
                <Link href="/admin/quizzes/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" /> Yeni Quiz
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quizzes?.map((quiz) => (
                    <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold line-clamp-1">
                                {quiz.title}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Link href={`/admin/quizzes/${quiz.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <DeleteQuizButton quizId={quiz.id} variant="ghost" size="icon" showText={false} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                {quiz.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{quiz.points} Puan</span>
                                <span>{formatDistanceToNow(new Date(quiz.created_at), { addSuffix: true, locale: tr })}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
