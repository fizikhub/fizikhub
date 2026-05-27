import { createClient } from "@/lib/supabase-server";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 0; // Disable cache to always get fresh data for admin

export default async function PageExperienceDashboard() {
    const supabase = await createClient();

    // Fetch from our new view
    const { data: metrics, error } = await supabase
        .from("view_page_experience_metrics")
        .select("*")
        .order("poor_count", { ascending: false })
        .order("event_count", { ascending: false });

    if (error) {
        return (
            <div className="p-6">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Veri Alınamadı</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>SQL View çalıştırılmamış olabilir veya veritabanı bağlantı hatası: {error.message}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sayfa Deneyimi (LCP/CLS)</h1>
                <p className="text-muted-foreground mt-2">
                    Kullanıcılardan toplanan Core Web Vitals verilerinin rota bazında ortalamaları ve sorunlu istek (poor/needs-improvement) sayıları.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rota Bazlı Performans</CardTitle>
                    <CardDescription>Kötü deneyim sayısına (poor_count) göre sıralanmıştır.</CardDescription>
                </CardHeader>
                <CardContent>
                    {metrics && metrics.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rota (Pathname)</TableHead>
                                        <TableHead>Metrik</TableHead>
                                        <TableHead className="text-right">Ortalama Değer</TableHead>
                                        <TableHead className="text-right">İstek Sayısı</TableHead>
                                        <TableHead className="text-right">Kötü (Poor)</TableHead>
                                        <TableHead className="text-right">Geliştirilmeli</TableHead>
                                        <TableHead className="text-right">İyi (Good)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {metrics.map((row, idx) => {
                                        const isPoor = row.poor_count > 0;
                                        
                                        return (
                                            <TableRow key={`${row.pathname}-${row.metric_name}-${idx}`}>
                                                <TableCell className="font-medium max-w-[200px] truncate" title={row.pathname}>
                                                    {row.pathname}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{row.metric_name}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-muted-foreground">
                                                    {row.average_value}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {row.event_count}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isPoor ? (
                                                        <Badge variant="destructive">{row.poor_count}</Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">{row.poor_count}</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {row.needs_improvement_count > 0 ? (
                                                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 dark:text-yellow-400">
                                                            {row.needs_improvement_count}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">{row.needs_improvement_count}</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {row.good_count}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex h-[200px] items-center justify-center text-muted-foreground border rounded-md">
                            Henüz web vitals verisi toplanmamış veya SQL View oluşturulmamış.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
