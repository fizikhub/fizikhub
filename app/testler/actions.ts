"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getQuizzes() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching quizzes:", error);
        return [];
    }

    return data;
}

export async function getQuizBySlug(slug: string) {
    const supabase = await createClient();

    const { data: quiz, error } = await supabase
        .from('quizzes')
        .select(`
            *,
            questions:quiz_questions(*)
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error("Error fetching quiz:", error);
        return null;
    }

    // Sort questions by order
    if (quiz.questions) {
        quiz.questions.sort((a: any, b: any) => a.order - b.order);
    }

    return quiz;
}

export async function submitQuizResult(quizId: string, score: number, totalQuestions: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // 1. Record the attempt
    const { error: attemptError } = await supabase
        .from('user_quiz_attempts')
        .insert({
            user_id: user.id,
            quiz_id: quizId,
            score: score,
            total_questions: totalQuestions
        });

    if (attemptError) {
        console.error("Error recording attempt:", attemptError);
        return { success: false, error: "Sonuç kaydedilemedi." };
    }

    // 2. Award points (only if score > 0)
    // In a real app, we might want to check if they already got points for this quiz
    if (score > 0) {
        // Calculate points based on percentage
        // For simplicity, let's just give fixed points for now if they pass a threshold
        // Or fetch the quiz points
        const { data: quiz } = await supabase
            .from('quizzes')
            .select('points')
            .eq('id', quizId)
            .single();

        if (quiz) {
            const percentage = (score / totalQuestions) * 100;
            const pointsToAward = Math.round((percentage / 100) * quiz.points);

            if (pointsToAward > 0) {
                // Update profile reputation
                // We use a stored procedure or just increment directly if RLS allows
                // Since we don't have a procedure, we fetch, increment, update (prone to race conditions but ok for now)
                // Better: use rpc if available, or just update.

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('reputation')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    await supabase
                        .from('profiles')
                        .update({ reputation: profile.reputation + pointsToAward })
                        .eq('id', user.id);
                }
            }
        }
    }

    revalidatePath('/testler');
    revalidatePath('/profil');
    revalidatePath('/siralamalar');

    return { success: true };
}
