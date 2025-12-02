import { createClient } from "@/lib/supabase-server";
import { AdminQuestionsList } from "@/components/admin/admin-questions-list";

export default async function AdminQuestionsPage() {
    const supabase = await createClient();

    // Fetch questions with answer count
    const { data: questions } = await supabase
        .from('questions')
        .select(`
            *,
            answers(count)
        `)
        .order('created_at', { ascending: false });

    const questionsWithCount = questions?.map(q => ({
        ...q,
        answer_count: q.answers?.[0]?.count || 0
    })) || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Forum Soruları</h1>
                <p className="text-muted-foreground">
                    Forumdaki soruları yönet.
                </p>
            </div>

            <AdminQuestionsList initialQuestions={questionsWithCount} />
        </div>
    );
}
