import { StoryEditor } from "@/components/stories/story-editor";
import { createClient } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin-shared";
import { redirect } from "next/navigation";

export default async function StoryEditorPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Secure the route
    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    if (profile?.role !== 'admin' && !isAdminEmail(user.email)) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-black pt-20">
            <StoryEditor />
        </div>
    );
}
