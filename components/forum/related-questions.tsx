import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { MessageSquare, ChevronUp } from "lucide-react";

interface RelatedQuestionsProps {
    currentQuestionId: number;
    category: string;
}

export async function RelatedQuestions({ currentQuestionId, category }: RelatedQuestionsProps) {
    const supabase = await createClient();

    // Fetch 3 related questions from the same category
    const { data: questions } = await supabase
        .from("questions")
        .select(`
            id,
            title,
            votes,
            created_at,
            profiles(username, avatar_url),
            answers(count)
        `)
        .eq("category", category)
        .neq("id", currentQuestionId)
        .order("votes", { ascending: false })
        .limit(3);

    if (!questions || questions.length === 0) return null;

    return (
        <div className="mt-12 pt-8 border-t-2 border-border/40">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">📚</span>
                Benzer {category} Soruları
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {questions.map((q: any) => (
                    <Link
                        key={q.id}
                        href={`/forum/${q.id}`}
                        className="group block p-4 bg-card border-2 border-border/60 rounded-xl hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Title */}
                        <h4 className="font-semibold text-sm line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                            {q.title}
                        </h4>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <ChevronUp className="w-3 h-3" />
                                <span>{q.votes || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{q.answers?.[0]?.count || 0}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
