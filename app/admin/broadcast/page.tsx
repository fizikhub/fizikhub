import { AdminBroadcastForm } from "@/components/admin/admin-broadcast-form";

export default function AdminBroadcastPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Duyurular</h1>
                <p className="text-muted-foreground">
                    Tüm kullanıcılara gösterilecek global bir duyuru yayınla.
                </p>
            </div>

            <AdminBroadcastForm />
        </div>
    );
}
