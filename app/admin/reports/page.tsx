"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Flag, CheckCircle2, XCircle, ExternalLink, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Report {
    id: number;
    reporter_id: string;
    content_type: string;
    content_id: number;
    reason: string;
    description: string | null;
    status: string;
    created_at: string;
    reporter?: {
        username: string | null;
        full_name: string | null;
    };
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchReports = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('reports')
            .select(`
                *,
                reporter:profiles!reporter_id(username, full_name)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reports:', error);
            toast.error("Raporlar yüklenirken hata oluştu");
        } else {
            setReports(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const updateStatus = async (id: number, status: string) => {
        const { error } = await supabase
            .from('reports')
            .update({ status })
            .eq('id', id);

        if (error) {
            toast.error("Durum güncellenemedi");
        } else {
            toast.success(`Rapor durumu: ${status}`);
            setReports(reports.map(r => r.id === id ? { ...r, status } : r));
        }
    };

    const deleteContent = async (report: Report) => {
        // Determine table based on content_type
        let table = '';
        if (report.content_type === 'question') table = 'questions';
        else if (report.content_type === 'answer') table = 'answers';
        else if (report.content_type === 'comment') table = 'answer_comments';
        else if (report.content_type === 'article') table = 'articles';

        if (!table) return;

        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', report.content_id);

        if (error) {
            toast.error("İçerik silinemedi: " + error.message);
        } else {
            toast.success("İçerik silindi");
            updateStatus(report.id, 'resolved');
        }
    };

    const getLink = (report: Report) => {
        if (report.content_type === 'question') return `/forum/${report.content_id}`;
        if (report.content_type === 'answer') return `/forum/${report.content_id}`; // Ideally anchor to answer
        if (report.content_type === 'article') return `/blog/${report.content_id}`; // Needs slug, might be tricky if we only have ID
        return '#';
    };

    const pendingReports = reports.filter(r => r.status === 'pending');
    const resolvedReports = reports.filter(r => r.status !== 'pending');

    return (
        <div className="container py-10 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-full bg-red-500/10 text-red-500">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rapor Yönetimi</h1>
                    <p className="text-muted-foreground">Kullanıcı şikayetlerini inceleyin ve yönetin.</p>
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="pending" className="gap-2">
                        Bekleyenler
                        <Badge variant="secondary" className="ml-1">{pendingReports.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="resolved" className="gap-2">
                        Çözülenler
                        <Badge variant="secondary" className="ml-1">{resolvedReports.length}</Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10">Yükleniyor...</div>
                    ) : pendingReports.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg bg-muted/10 border-dashed">
                            <CheckCircle2 className="h-10 w-10 mx-auto mb-4 text-green-500/50" />
                            <p className="text-muted-foreground font-medium">Bekleyen rapor yok. Harika! 🎉</p>
                        </div>
                    ) : (
                        pendingReports.map(report => (
                            <ReportCard
                                key={report.id}
                                report={report}
                                onDismiss={() => updateStatus(report.id, 'dismissed')}
                                onResolve={() => updateStatus(report.id, 'resolved')}
                                onDeleteContent={() => deleteContent(report)}
                                getLink={getLink}
                            />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="resolved" className="space-y-4">
                    {resolvedReports.map(report => (
                        <ReportCard
                            key={report.id}
                            report={report}
                            onDismiss={() => updateStatus(report.id, 'dismissed')}
                            onResolve={() => updateStatus(report.id, 'resolved')}
                            onDeleteContent={() => deleteContent(report)}
                            getLink={getLink}
                            readonly
                        />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ReportCard({ report, onDismiss, onResolve, onDeleteContent, getLink, readonly }: any) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                            <Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>
                                {report.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                                {report.content_type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: tr })}
                            </span>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Flag className="h-4 w-4 text-red-500" />
                                {report.reason}
                            </h3>
                            {report.description && (
                                <p className="text-muted-foreground mt-1 bg-muted/30 p-2 rounded text-sm">
                                    "{report.description}"
                                </p>
                            )}
                        </div>

                        <div className="text-sm text-muted-foreground">
                            Raporlayan: <span className="font-medium text-foreground">{report.reporter?.username || "Anonim"}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[140px]">
                        <Link href={getLink(report)} target="_blank">
                            <Button variant="outline" size="sm" className="w-full gap-2">
                                <ExternalLink className="h-4 w-4" />
                                İçeriği Gör
                            </Button>
                        </Link>

                        {!readonly && (
                            <>
                                <Button variant="secondary" size="sm" onClick={onDismiss} className="w-full gap-2">
                                    <XCircle className="h-4 w-4" />
                                    Yoksay
                                </Button>
                                <Button variant="default" size="sm" onClick={onResolve} className="w-full gap-2 bg-green-600 hover:bg-green-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Çözüldü
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="w-full gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            İçeriği Sil
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>İçeriği silmek istediğine emin misin?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Bu işlem geri alınamaz ve raporu 'resolved' olarak işaretler.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>İptal</AlertDialogCancel>
                                            <AlertDialogAction onClick={onDeleteContent} className="bg-destructive text-destructive-foreground">
                                                Sil
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
