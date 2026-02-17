import { StoryEditor } from "@/components/stories/story-editor";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function StoryEditorPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Secure the route
    if (!user) {
        redirect("/login");
    }

    // Check if admin (this logic should ideally be more robust with roles, but checking username works for now as per instructions)
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();

    if (profile?.username !== 'baranbozkurt') {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-black pt-20">
            <StoryEditor />
        </div>
    );
}
