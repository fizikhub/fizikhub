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

    return (
        <main className="min-h-screen bg-background py-8 sm:py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Profili Düzenle</h1>
                    <p className="text-muted-foreground mt-2">
                        Kişisel bilgilerinizi ve profil görünümünüzü buradan yönetebilirsiniz.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                    <ProfileEditForm user={user} profile={profile} />
                </div>
            </div>
        </main>
    );
}
