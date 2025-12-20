import { createClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteQuizQuestion } from "@/app/admin/actions";
import { notFound } from "next/navigation";

export default async function QuizManagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch quiz details
    const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id)
        .single();

    if (quizError || !quiz) {
        return notFound();
    }

    // Fetch questions
    const { data: questions, error: questionsError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", id)
        .order("order", { ascending: true });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/quizzes">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Geri
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
                    <p className="text-muted-foreground">
                        {quiz.description}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
                <div className="flex gap-4">
                    <Badge variant="outline" className="bg-background">
                        {quiz.slug}
                    </Badge>
                    <Badge variant="outline" className="bg-background">
                        {quiz.points} Puan
                    </Badge>
                    <Badge variant="outline" className="bg-background">
                        {questions?.length || 0} Soru
                    </Badge>
                </div>
                {/* Future: Add Question Button */}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold">Sorular</h2>

                {!questions || questions.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                        Bu teste ait soru bulunmuyor.
                    </div>
                ) : (
                    questions.map((question, index) => (
                        <Card key={question.id} className="relative group">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge className="mb-2">Soru {index + 1}</Badge>
                                    <form action={async () => {
                                        "use server";
                                        await deleteQuizQuestion(question.id);
                                    }}>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" /> Sil
                                        </Button>
                                    </form>
                                </div>
                                <CardTitle className="text-base font-medium">
                                    {question.question_text}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    {question.options.map((option: string, optIndex: number) => (
                                        <div
                                            key={optIndex}
                                            className={`p-2 rounded border ${optIndex === question.correct_answer
                                                    ? "bg-green-100 border-green-500 text-green-900 dark:bg-green-900/40 dark:text-white"
                                                    : "bg-muted/50"
                                                }`}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
