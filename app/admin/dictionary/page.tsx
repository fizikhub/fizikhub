import { createClient } from "@/lib/supabase-server";
import { getDictionaryTerms } from "@/lib/api";
import { AdminDictionaryList } from "@/components/admin/admin-dictionary-list";

export default async function AdminDictionaryPage() {
    const supabase = await createClient();
    const terms = await getDictionaryTerms(supabase);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sözlük Yönetimi</h1>
                <p className="text-muted-foreground">
                    Fizik terimlerini ekle, düzenle veya sil.
                </p>
            </div>

            <AdminDictionaryList initialTerms={terms} />
        </div>
    );
}
