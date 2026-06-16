"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/admin";

export async function approveApplication(applicationId: string, userId: string) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin || !adminCheck.supabase) {
        return { error: adminCheck.error || "Bu işlem için admin yetkisi gereklidir." };
    }

    const supabase = adminCheck.supabase;

    // 1. Update application status
    const { error: appError } = await supabase
        .from("writer_applications")
        .update({ status: "approved" })
        .eq("id", applicationId);

    if (appError) {
        console.error("Error approving application:", appError);
        return { error: "Başvuru onaylanamadı." };
    }

    // 2. Grant writer role to user
    // Assuming profiles table has is_writer boolean, inferred from previous context
    const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_writer: true })
        .eq("id", userId);

    if (profileError) {
        console.error("Error updating profile:", profileError);
        // Ideally rollback application status but for now simple
        return { error: "Kullanıcıya yazar yetkisi verilemedi." };
    }

    revalidatePath("/admin/basvurular");
    return { success: true };
}

export async function rejectApplication(applicationId: string) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin || !adminCheck.supabase) {
        return { error: adminCheck.error || "Bu işlem için admin yetkisi gereklidir." };
    }

    const supabase = adminCheck.supabase;

    const { error } = await supabase
        .from("writer_applications")
        .update({ status: "rejected" })
        .eq("id", applicationId);

    if (error) {
        return { error: "Başvuru reddedilemedi." };
    }

    revalidatePath("/admin/basvurular");
    return { success: true };
}
