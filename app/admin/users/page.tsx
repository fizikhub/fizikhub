import { createClient } from "@/lib/supabase-server";
import { AdminUsersList } from "@/components/admin/admin-users-list";

export default async function AdminUsersPage() {
    const supabase = await createClient();

    // Fetch all users (limit to 100 for now, pagination should be added later)
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
                <p className="text-muted-foreground">
                    Kayıtlı kullanıcıları görüntüle ve yönet.
                </p>
            </div>

            <AdminUsersList initialUsers={users || []} />
        </div>
    );
}
