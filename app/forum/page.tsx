import { createClient } from "@/lib/supabase-server";
import { ForumHeader } from "@/components/forum/forum-header";
import { ForumSidebar } from "@/components/forum/forum-sidebar";
import { QuestionCard } from "@/components/forum/question-card";


export const dynamic = "force-dynamic";

interface ForumPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
    const supabase = await createClient();
    const params = await searchParams;

    const category = typeof params.category === 'string' ? params.category : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : 'newest';
    const searchQuery = typeof params.q === 'string' ? params.q : undefined;
    const filter = typeof params.filter === 'string' ? params.filter : undefined;

    // Build query
    let query = supabase
        .from('questions')
        .select(`
            *,
            profiles(username, full_name, avatar_url, is_verified),
            answers(count)
        `);

    // Apply filters
    if (category && category !== "Tümü") {
        query = query.eq('category', category);
    }

    if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
    }

    // Apply sorting
    if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
    } else {
        // Default to popular (votes)
        query = query.order('votes', { ascending: false });
    }

    const { data: questions } = await query;

    // Fetch user's votes to show "voted" state
    let userVotes = new Set<number>();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && questions && questions.length > 0) {
        const { data: votes } = await supabase
            .from('question_votes')
            .select('question_id')
            .eq('user_id', user.id)
            .in('question_id', questions.map(q => q.id));

        if (votes) {
            votes.forEach(v => userVotes.add(v.question_id));
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container py-6 md:py-10 px-4 md:px-6 max-w-7xl mx-auto">
                <ForumHeader />



                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:block sticky top-24 h-fit">
                        <ForumSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="space-y-4 md:space-y-6 min-w-0">
                        {!questions || questions.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
                                <div className="max-w-md mx-auto">
                                    <p className="text-muted-foreground text-lg mb-2">
                                        {searchQuery
                                            ? `"${searchQuery}" için sonuç bulunamadı.`
                                            : "Henüz hiç soru sorulmamış."}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {!searchQuery && "İlk soran sen ol!"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 md:space-y-4">
                                {questions.map((question) => (
                                    <QuestionCard
                                        key={question.id}
                                        question={question}
                                        hasVoted={userVotes.has(question.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
