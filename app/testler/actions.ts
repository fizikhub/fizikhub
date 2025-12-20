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
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error("Error fetching quiz:", error);
        return null;
    }

    if (!quiz) {
        return null;
    }

    // Fetch questions separately to avoid relationship issues
    const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quiz.id)
        .order('order', { ascending: true });

    if (questionsError) {
        console.error("Error fetching questions:", questionsError);
        quiz.questions = [];
    } else {
        quiz.questions = questions || [];
    }

    // Double sort to be safe
    quiz.questions.sort((a: any, b: any) => a.order - b.order);

    return quiz;
}

export async function submitQuizResult(quizId: string, score: number, totalQuestions: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // 0. Check if user ALREADY got points for this quiz (score > 0)
    // We treat any previous attempt with score > 0 as "completed for points"
    const { data: existingAttempts } = await supabase
        .from('user_quiz_attempts')
        .select('id')
        .eq('user_id', user.id)
        .eq('quiz_id', quizId)
        .gt('score', 0)
        .limit(1);

    const alreadyCompleted = existingAttempts && existingAttempts.length > 0;
    let pointsEarned = 0;

    // 1. Record the attempt (Always record valid attempts)
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

    // 2. Award points ONLY if not already completed and score > 0
    if (!alreadyCompleted && score > 0) {
        const { data: quiz } = await supabase
            .from('quizzes')
            .select('points')
            .eq('id', quizId)
            .single();

        if (quiz) {
            // Simple logic: If score is > 50%, give full points. 
            // Or proportional? User request implies "Unlimited points farming" so block repeats.
            // Let's go with: Proportional points based on score
            const percentage = (score / totalQuestions);
            pointsEarned = Math.round(percentage * quiz.points);

            if (pointsEarned > 0) {
                // Fetch current profile to increment
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('reputation')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    await supabase
                        .from('profiles')
                        .update({ reputation: profile.reputation + pointsEarned })
                        .eq('id', user.id);
                }
            }
        }
    }

    revalidatePath('/testler');
    revalidatePath('/profil');
    revalidatePath('/siralamalar');

    return { success: true, pointsEarned, alreadyCompleted };
}
