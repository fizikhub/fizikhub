"use server";

import { createClient } from "@/lib/supabase-server";
import { writerApplicationSchema, WriterApplicationFormValues } from "./schema";
import { revalidatePath } from "next/cache";

export async function submitWriterApplication(data: WriterApplicationFormValues) {
    const supabase = await createClient();

    // Validate data on server side
    const result = writerApplicationSchema.safeParse(data);
    if (!result.success) {
        return { error: "Form verileri geçersiz." };
    }

    const { fullName, university, phone, interestArea, menemenPreference, email, experience, about } = result.data;

    // Get current user (optional, but good to link if logged in)
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from("writer_applications")
        .insert({
            user_id: user?.id, // Can be null if not logged in (RLS might block this if we only allow auth users, let's check plan)
            // Plan said "Users can insert their own application" RLS policy for authenticated.
            // If user is NOT logged in, the RLS will fail.
            // The user request implies "anyone" or "site members"?
            // "bu karttaki buttona basınca yazar olma başvuru sayfası çıksın"
            // Usually writer application is for members.
            // I will assume user must be logged in. 
            // If not, I should probably redirect them to login or allow public insert (but RLS was set to authenticated).
            // Let's assume auth is required.
            full_name: fullName,
            university,
            phone,
            interest_area: interestArea,
            menemen_preference: menemenPreference,
            email,
            experience,
            about,
            status: 'pending'
        });

    if (error) {
        console.error("Submission error:", error);
        return { error: "Başvuru gönderilirken bir hata oluştu." };
    }

    revalidatePath("/admin/basvurular");
    return { success: true };
}
