"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// Helper to verify admin
async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { isAdmin: false, error: "Giriş yapmalısınız." };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'admin' || user.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';

    if (!isAdmin) {
        return { isAdmin: false, error: "Bu işlem için admin yetkisi gereklidir." };
    }

    return { isAdmin: true, supabase };
}

export async function deleteArticle(id: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const { error } = await adminCheck.supabase!.from('articles').delete().eq('id', id);

    if (error) {
        console.error("Delete Article Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/blog');
    return { success: true };
}

export async function deleteQuestion(id: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    // Delete answers first (cascade should handle this, but being explicit)
    const { error: answersError } = await adminCheck.supabase!
        .from('answers')
        .delete()
        .eq('question_id', id);

    if (answersError) {
        console.error("Delete Answers Error:", answersError);
        return { success: false, error: answersError.message };
    }

    // Delete question
    const { error } = await adminCheck.supabase!.from('questions').delete().eq('id', id);

    if (error) {
        console.error("Delete Question Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/forum');
    return { success: true };
}

export async function deleteAnswer(id: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const { error } = await adminCheck.supabase!.from('answers').delete().eq('id', id);

    if (error) {
        console.error("Delete Answer Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/forum');
    return { success: true };
}

export async function deleteDictionaryTerm(id: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const { error } = await adminCheck.supabase!.from('dictionary_terms').delete().eq('id', id);

    if (error) {
        console.error("Delete Dictionary Term Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/sozluk');
    return { success: true };
}
