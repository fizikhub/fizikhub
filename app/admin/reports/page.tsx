import { getReports } from "@/app/actions/report";
import { AdminReportsList } from "@/components/admin/admin-reports-list";

export default async function AdminReportsPage() {
    const reports = await getReports();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Raporlar</h1>
                <p className="text-muted-foreground">
                    Kullanıcı şikayetlerini ve raporlarını incele.
                </p>
            </div>

            <AdminReportsList initialReports={reports} />
        </div>
    );
}
