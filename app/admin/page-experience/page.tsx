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
import { formatWebVitalValue, isWebVitalName, WEB_VITAL_THRESHOLDS, webVitalPriorityScore } from "@/lib/web-vitals-thresholds";

export const revalidate = 0; // Disable cache to always get fresh data for admin

type PageExperienceMetric = {
    pathname: string | null;
    metric_name: string | null;
    average_value: number | string | null;
    p75_value?: number | string | null;
    event_count: number | null;
    poor_count: number | null;
    needs_improvement_count: number | null;
    good_count: number | null;
};

type LcpElementMetric = {
    pathname: string | null;
    lcp_element: string | null;
    resource_url: string | null;
    event_count: number | null;
    p75_value: number | string | null;
    poor_count: number | null;
    needs_improvement_count: number | null;
};

const metricOrder = ["LCP", "INP", "CLS", "FCP", "TTFB"] as const;

function metricPriority(row: PageExperienceMetric) {
    const metricName = row.metric_name || "";
    if (!isWebVitalName(metricName)) return 0;
    return webVitalPriorityScore(
        metricName,
        Number(row.poor_count || 0),
        Number(row.needs_improvement_count || 0),
    );
}

export default async function PageExperienceDashboard() {
    const supabase = await createClient();

    // Fetch from our new view
    const [metricsResult, lcpElementsResult] = await Promise.all([
        supabase
            .from("view_page_experience_metrics")
            .select("*")
            .order("poor_count", { ascending: false })
            .order("event_count", { ascending: false }),
        supabase
            .from("view_lcp_element_metrics")
            .select("*")
            .order("poor_count", { ascending: false })
            .order("p75_value", { ascending: false })
            .limit(30),
    ]);

    const { data: metrics, error } = metricsResult;
    const lcpElements = (lcpElementsResult.data || []) as LcpElementMetric[];
    const lcpAttributionError = lcpElementsResult.error;

    const typedMetrics = (metrics || []) as PageExperienceMetric[];
    const sortedMetrics = [...typedMetrics].sort((a, b) =>
        metricPriority(b) - metricPriority(a) ||
        Number(b.poor_count || 0) - Number(a.poor_count || 0) ||
        Number(b.event_count || 0) - Number(a.event_count || 0)
    );

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
                <h1 className="text-3xl font-bold tracking-tight">Sayfa Deneyimi (LCP/INP/CLS)</h1>
                <p className="text-muted-foreground mt-2">
                    Kullanıcılardan toplanan Core Web Vitals verilerinin rota bazında ortalamaları, eşik durumu ve SEO öncelik sırası.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
                {metricOrder.map((name) => {
                    const threshold = WEB_VITAL_THRESHOLDS[name];
                    return (
                        <Card key={name}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{name}</CardTitle>
                                <CardDescription>{threshold.seoImpact}</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <p>
                                    İyi: {formatWebVitalValue(name, threshold.good)}
                                </p>
                                <p>
                                    Kötü: {formatWebVitalValue(name, threshold.poor)} ve üzeri
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rota Bazlı Performans</CardTitle>
                    <CardDescription>LCP ve INP sorunları daha yüksek ağırlıkla önceliklendirilir.</CardDescription>
                </CardHeader>
                <CardContent>
                    {sortedMetrics.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rota (Pathname)</TableHead>
                                        <TableHead>Metrik</TableHead>
                                        <TableHead className="text-right">Öncelik</TableHead>
                                        <TableHead className="text-right">P75</TableHead>
                                        <TableHead className="text-right">Ortalama Değer</TableHead>
                                        <TableHead className="text-right">İstek Sayısı</TableHead>
                                        <TableHead className="text-right">Kötü (Poor)</TableHead>
                                        <TableHead className="text-right">Geliştirilmeli</TableHead>
                                        <TableHead className="text-right">İyi (Good)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedMetrics.map((row, idx) => {
                                        const rawMetricName = row.metric_name || "";
                                        const metricName = isWebVitalName(rawMetricName) ? rawMetricName : null;
                                        const isPoor = Number(row.poor_count || 0) > 0;
                                        const needsImprovementCount = Number(row.needs_improvement_count || 0);
                                        const priority = metricPriority(row);
                                        
                                        return (
                                            <TableRow key={`${row.pathname}-${row.metric_name}-${idx}`}>
                                                <TableCell className="font-medium max-w-[200px] truncate" title={row.pathname || undefined}>
                                                    {row.pathname || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{row.metric_name}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {priority > 0 ? (
                                                        <Badge variant={priority >= 9 ? "destructive" : "secondary"}>{priority}</Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">0</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {metricName ? formatWebVitalValue(metricName, row.p75_value) : row.p75_value || "-"}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-muted-foreground">
                                                    {metricName ? formatWebVitalValue(metricName, row.average_value) : row.average_value}
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
                                                    {needsImprovementCount > 0 ? (
                                                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 dark:text-yellow-400">
                                                            {needsImprovementCount}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">{needsImprovementCount}</span>
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

            <Card>
                <CardHeader>
                    <CardTitle>LCP Elemanı ve Görsel Kaynağı</CardTitle>
                    <CardDescription>
                        Priority/fetchPriority yalnızca burada gerçek LCP olarak doğrulanan, ilk ekrandaki görsellere verilmeli.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {lcpAttributionError && (
                        <div className="mb-4 rounded-md border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-300">
                            LCP attribution view henüz production veritabanında yok: ilgili Supabase migration uygulanmalı.
                        </div>
                    )}
                    {lcpElements.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rota</TableHead>
                                        <TableHead>LCP elemanı</TableHead>
                                        <TableHead>Kaynak</TableHead>
                                        <TableHead className="text-right">P75</TableHead>
                                        <TableHead className="text-right">Örnek</TableHead>
                                        <TableHead className="text-right">Sorunlu</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lcpElements.map((row) => (
                                        <TableRow key={`${row.pathname}-${row.lcp_element}-${row.resource_url}`}>
                                            <TableCell className="max-w-[220px] truncate font-medium" title={row.pathname || undefined}>
                                                {row.pathname || "-"}
                                            </TableCell>
                                            <TableCell className="max-w-[280px] truncate font-mono text-xs" title={row.lcp_element || undefined}>
                                                {row.lcp_element || "(unknown)"}
                                            </TableCell>
                                            <TableCell className="max-w-[280px] truncate text-xs text-muted-foreground" title={row.resource_url || undefined}>
                                                {row.resource_url || "metin / bilinmiyor"}
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {formatWebVitalValue("LCP", row.p75_value)}
                                            </TableCell>
                                            <TableCell className="text-right">{row.event_count || 0}</TableCell>
                                            <TableCell className="text-right">
                                                {Number(row.poor_count || 0) + Number(row.needs_improvement_count || 0)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex h-[140px] items-center justify-center rounded-md border px-6 text-center text-muted-foreground">
                            Yeni attribution örnekleri henüz gelmedi. Migration sonrası production trafikle bu tablo dolacak.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
