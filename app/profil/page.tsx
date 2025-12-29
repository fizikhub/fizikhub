import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getFollowStats } from "@/app/profil/actions";
import { ProfileViewWrapper } from "@/components/profile/profile-view-wrapper";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Parallel Data Fetching with Optimized Selections
    const [
        { data: profile },
        { data: articles },
        { data: questions },
        { data: answers },
        { data: userBadges },
        followStats,
        { data: bookmarkedArticles },
        { data: bookmarkedQuestions },
        { data: drafts }
    ] = await Promise.all([
        // 1. Fetch Profile
        supabase.from('profiles').select('*').eq('id', user.id).single(),

        // 2. Fetch Articles (Published only) - Optimized Selection
        supabase.from('articles')
            .select('id, title, slug, excerpt, created_at, category, cover_url, views, likes_count')
            .eq('author_id', user.id)
            .neq('status', 'draft')
            .order('created_at', { ascending: false }),

        // 3. Fetch Questions - Optimized Selection
        supabase.from('questions')
            .select('id, title, slug, created_at, category, views, answers_count')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false }),

        // 4. Fetch Answers - Optimized Selection
        supabase.from('answers')
            .select('id, content, created_at, is_accepted, questions(id, title, slug)')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false }),

        // 5. Fetch Badges
        supabase.from('user_badges')
            .select('awarded_at, badges(id, name, description, icon, category)')
            .eq('user_id', user.id)
            .order('awarded_at', { ascending: false }),

        // 6. Fetch Follow Stats (keep as is, likely optimized in function)
        getFollowStats(user.id),

        // 7. Fetch Bookmarked Articles - Optimized Selection
        supabase.from('article_bookmarks')
            .select('created_at, articles(id, title, slug, excerpt, created_at, category, cover_url, author:profiles(full_name, username))')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),

        // 8. Fetch Bookmarked Questions - Optimized Selection
        supabase.from('question_bookmarks')
            .select('created_at, questions(id, title, slug, content, created_at, category, profiles(full_name, username), answers(count))')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),

        // 9. Fetch Drafts (Only for own profile) - Optimized Selection
        supabase.from('articles')
            .select('id, title, slug, excerpt, created_at, category, cover_url, status')
            .eq('author_id', user.id)
            .eq('status', 'draft')
            .order('created_at', { ascending: false })
    ]);

    return (
        <ProfileViewWrapper
            profile={profile}
            user={user}
            articles={articles || []}
            questions={questions || []}
            answers={answers || []}
            userBadges={userBadges || []}
            followStats={followStats}
            bookmarkedArticles={bookmarkedArticles || []}
            bookmarkedQuestions={bookmarkedQuestions || []}
            drafts={drafts || []}
        />
    );
}
