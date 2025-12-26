import { createClient } from "@/lib/supabase-server";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Check, X, Coffee, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveApplication, rejectApplication } from "./actions"; // We'll client-wrap these or use form actions
import AdminApplicationCard from "./application-card"; // Breaking into client component for interactivity

export default async function AdminWriterApplicationsPage() {
    const supabase = await createClient();

    const { data: applications, error } = await supabase
        .from("writer_applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-8 text-destructive">Hata: {error.message}</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Yazar Başvuruları</h1>
                    <p className="text-muted-foreground">
                        Bekleyen başvuruları buradan inceleyip onaylayabilirsin.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {applications?.map((app) => (
                    <AdminApplicationCard key={app.id} application={app} />
                ))}

                {applications?.length === 0 && (
                    <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-secondary">
                        <PenTool className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Henüz bekleyen başvuru yok.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
