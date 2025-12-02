"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createQuiz(data: {
    title: string;
    slug: string;
    description: string;
    points: number;
    questions: {
        question_text: string;
        options: string[];
        correct_answer: number;
        order: number;
    }[];
}) {
    const supabase = await createClient();

    // Check admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") return { error: "Unauthorized" };

    // Create Quiz
    const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
            title: data.title,
            slug: data.slug,
            description: data.description,
            points: data.points
        })
        .select()
        .single();

    if (quizError) return { error: quizError.message };

    // Create Questions
    const questionsData = data.questions.map(q => ({
        quiz_id: quiz.id,
        question_text: q.question_text,
        options: q.options, // This will be cast to jsonb automatically by Supabase client if types match
        correct_answer: q.correct_answer,
        order: q.order
    }));

    const { error: questionsError } = await supabase
        .from("quiz_questions")
        .insert(questionsData);

    if (questionsError) {
        // Cleanup quiz if questions fail (optional but good practice)
        await supabase.from("quizzes").delete().eq("id", quiz.id);
        return { error: questionsError.message };
    }

    revalidatePath("/admin/quizzes");
    revalidatePath("/testler");
    return { success: true };
}

export async function deleteQuiz(id: string) {
    const supabase = await createClient();

    // Check admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") return { error: "Unauthorized" };

    const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/quizzes");
    revalidatePath("/testler");
    return { success: true };
}
