import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profili Düzenle",
    description: "Profil bilgilerinizi güncelleyin.",
};

export default async function ProfileEditPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // The form now handles its own full-page layout
    return <ProfileEditForm user={user} profile={profile} />;
}
