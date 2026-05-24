"use server";

import { verifyAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function setWeeklyQuestion(questionId: number) {
    const { isAdmin, supabase, error: authError } = await verifyAdmin();
    if (!isAdmin) return { error: authError || "Unauthorized" };

    // Deactivate previous picks
    await supabase
        .from("weekly_picks")
        .update({ is_active: false })
        .eq("is_active", true);

    // Insert new pick
    const { error } = await supabase
        .from("weekly_picks")
        .insert({
            question_id: questionId,
            is_active: true
        });

    if (error) return { error: error.message };

    revalidatePath("/");
    revalidatePath("/admin/weekly-question");
    return { success: true };
}

export async function getWeeklyQuestion() {
    const { supabase } = await verifyAdmin();

    const { data, error } = await supabase
        .from("weekly_picks")
        .select(`
            *,
            questions (
                id,
                title,
                slug,
                category,
                created_at,
                profiles (
                    username
                )
            )
        `)
        .eq("is_active", true)
        .single();

    if (error) return null;
    return data;
}
