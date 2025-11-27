"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { updateReportStatus } from "@/app/actions/report";
import { toast } from "sonner";
import Link from "next/link";
import { ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react";

interface Report {
    id: number;
    reporter_id: string;
    resource_id: string;
    resource_type: string;
    reason: string;
    description: string | null;
    status: string;
    created_at: string;
    reporter: {
        username: string | null;
        full_name: string | null;
    } | null;
}

interface AdminReportsListProps {
    initialReports: Report[];
}

export function AdminReportsList({ initialReports }: AdminReportsListProps) {
    const [reports, setReports] = useState<Report[]>(initialReports);

    const handleStatusUpdate = async (reportId: number, newStatus: 'resolved' | 'dismissed') => {
        try {
            const result = await updateReportStatus(reportId, newStatus);
            if (result.success) {
                setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
                toast.success("Rapor durumu güncellendi.");
            } else {
                toast.error("Hata oluştu.");
            }
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    const getResourceLink = (report: Report) => {
        switch (report.resource_type) {
            case 'question':
                return `/forum/${report.resource_id}`;
            case 'answer':
                // Ideally link to specific answer anchor
                return `/forum/soru-bulunamadi`; // Placeholder as we don't have question ID easily for answers without join
            case 'user':
                return `/kullanici/${report.resource_id}`; // Assuming resource_id is username for user reports, or we need to fetch
            default:
                return '#';
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Raporlayan</TableHead>
                        <TableHead>Tür</TableHead>
                        <TableHead>Sebep</TableHead>
                        <TableHead>Detay</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                Henüz rapor yok.
                            </TableCell>
                        </TableRow>
                    ) : (
                        reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>
                                    <div className="font-medium">{report.reporter?.username || "Anonim"}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {report.resource_type}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {report.reason}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate" title={report.description || ""}>
                                    {report.description || "-"}
                                </TableCell>
                                <TableCell>
                                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: tr })}
                                </TableCell>
                                <TableCell>
                                    {report.status === 'pending' && <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Bekliyor</Badge>}
                                    {report.status === 'resolved' && <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Çözüldü</Badge>}
                                    {report.status === 'dismissed' && <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">Reddedildi</Badge>}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild title="İçeriğe Git">
                                            <Link href={getResourceLink(report)} target="_blank">
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        {report.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleStatusUpdate(report.id, 'resolved')}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    title="Çözüldü Olarak İşaretle"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleStatusUpdate(report.id, 'dismissed')}
                                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                                    title="Reddet"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
