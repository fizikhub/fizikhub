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
        <div className="pt-6 border-t-[2.5px] border-black/10 dark:border-zinc-800">
            <h3 className="text-base font-black mb-4 flex items-center gap-2 uppercase tracking-tight text-neutral-700 dark:text-zinc-300">
                <span className="text-[#FFBD2E]">📚</span>
                Benzer {category} Soruları
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {questions.map((q: any) => (
                    <Link
                        key={q.id}
                        href={`/forum/${q.id}`}
                        className="group block p-4 bg-white dark:bg-[#1e1e21] border-[2px] border-black/20 dark:border-zinc-700 rounded-[10px] hover:border-black dark:hover:border-zinc-500 hover:shadow-[3px_3px_0_0_#000] dark:hover:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)] transition-all duration-200 hover:-translate-y-0.5"
                    >
                        {/* Title */}
                        <h4 className="font-bold text-sm line-clamp-2 mb-3 group-hover:text-[#FFBD2E] transition-colors text-foreground">
                            {q.title}
                        </h4>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs font-medium text-neutral-400 dark:text-zinc-500">
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
