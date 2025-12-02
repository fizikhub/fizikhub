"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function setWeeklyQuestion(questionId: number) {
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
    const supabase = await createClient();

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
