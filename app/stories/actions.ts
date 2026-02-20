"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// --- STORY GROUPS (HIGHLIGHTS) ---

export async function createStoryGroup(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Oturum açmalısınız." };

    const title = formData.get("title") as string;
    const coverUrl = formData.get("cover_url") as string;
    const ringColor = formData.get("ring_color") as string;

    if (!title) return { success: false, error: "Başlık gereklidir." };

    const { data, error } = await supabase
        .from("story_groups")
        .insert({
            title,
            cover_url: coverUrl,
            ring_color: ringColor || null,
            author_id: user.id
        })
        .select()
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/");
    return { success: true, data };
}

export async function updateStoryGroup(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Oturum açmalısınız." };

    const title = formData.get("title") as string;
    const coverUrl = formData.get("cover_url") as string;
    const ringColor = formData.get("ring_color") as string;

    const updates: any = {};
    if (title) updates.title = title;
    if (coverUrl) updates.cover_url = coverUrl;
    if (ringColor !== null) updates.ring_color = ringColor;

    const { error } = await supabase
        .from("story_groups")
        .update(updates)
        .eq("id", id)
        .eq("author_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/");
    return { success: true };
}

export async function deleteStoryGroup(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Oturum açmalısınız." };

    // This will ideally also set group_id to null in stories due to ON DELETE SET NULL
    const { error } = await supabase
        .from("story_groups")
        .delete()
        .eq("id", id)
        .eq("author_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/");
    return { success: true };
}

export async function getStoryGroups(userId: string) {
    const supabase = await createClient();

    // If userId not provided, maybe fetch all public? But usually we want specific user's or all for homepage
    // For now let's just fetch all for homepage usage, or specific user's for management

    let query = supabase.from("story_groups").select("*").order("created_at", { ascending: false });

    if (userId) {
        query = query.eq("author_id", userId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return data;
}

// --- STORIES ---

export async function updateStory(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Oturum açmalısınız." };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const groupId = formData.get("group_id") as string;

    const updates: any = {};
    if (title !== null) updates.title = title;
    if (content !== null) updates.content = content;
    if (groupId !== null && groupId !== "null") updates.group_id = groupId;

    const { error } = await supabase
        .from("stories")
        .update(updates)
        .eq("id", id)
        .eq("author_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/");
    return { success: true };
}

export async function deleteStory(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Oturum açmalısınız." };

    const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", id)
        .eq("author_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/");
    return { success: true };
}

export async function getStoriesByGroup(groupId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data;
}
