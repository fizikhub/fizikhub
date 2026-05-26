import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Book, MessageSquare, Users, Database, Activity, ShieldAlert, Sparkles, AlertTriangle, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch stats
    const { count: articlesCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    const { count: termsCount } = await supabase.from('dictionary_terms').select('*', { count: 'exact', head: true });
    const { count: questionsCount } = await supabase.from('questions').select('*', { count: 'exact', head: true });
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    // Fetch recent questions
    const { data: recentQuestions } = await supabase
        .from('questions')
        .select(`
            *,
            profiles (
                username
            )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch recent users
    const { data: recentUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch DB Health gracefully
    const { data: dbHealth, error: dbHealthError } = await supabase
        .from('database_health_status')
        .select('*')
        .order('table_name', { ascending: true })
        .limit(12);

    // Fetch SEO & GEO Health gracefully
    const adminClient = createAdminClient();
    let seoLowValueContent: any[] = [];
    let seoUnsyncedContent: any[] = [];
    let seoPanelError: any = null;

    try {
        const [lowValueRes, syncStatusRes] = await Promise.all([
            adminClient.rpc('get_seo_low_value_content').limit(8),
            adminClient.rpc('get_seo_sync_status').limit(8)
        ]);

        if (lowValueRes.error) {
            console.warn("Low value RPC failed:", lowValueRes.error);
            throw new Error(lowValueRes.error.message || "get_seo_low_value_content RPC error");
        }
        if (syncStatusRes.error) {
            console.warn("Sync status RPC failed:", syncStatusRes.error);
            throw new Error(syncStatusRes.error.message || "get_seo_sync_status RPC error");
        }

        seoLowValueContent = lowValueRes.data || [];
        seoUnsyncedContent = syncStatusRes.data || [];
    } catch (err: any) {
        console.error("SEO/GEO RPC Fetch Error:", err);
        seoPanelError = err.message || String(err);
    }

    // Fetch Web Vitals data gracefully
    let webVitalsStats: any[] = [];
    let webVitalsSummary: any = null;
    let webVitalsError: any = null;

    try {
        // Get overall averages from the daily summary
        const { data: dailySummary, error: summaryErr } = await adminClient
            .from('web_vitals_daily_summary')
            .select('*')
            .order('day', { ascending: false })
            .limit(7);

        if (summaryErr) {
            console.warn("Summary fetch failed:", summaryErr);
            throw summaryErr;
        }

        // Get aggregate values by pathname for the last 30 days to spot performance issues
        const { data: routeMetrics, error: metricsErr } = await adminClient
            .from('web_vitals_events')
            .select('pathname, name, value, rating')
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        if (metricsErr) {
            console.warn("Route metrics fetch failed:", metricsErr);
            throw metricsErr;
        }

        // Process routeMetrics to group by pathname and calculate averages for key metrics
        if (routeMetrics && routeMetrics.length > 0) {
            const pathGroups: Record<string, Record<string, { sum: number; count: number; ratings: Record<string, number> }>> = {};
            
            routeMetrics.forEach(event => {
                const { pathname, name, value, rating } = event;
                if (!pathname) return;
                
                if (!pathGroups[pathname]) {
                    pathGroups[pathname] = {};
                }
                if (!pathGroups[pathname][name]) {
                    pathGroups[pathname][name] = { sum: 0, count: 0, ratings: { good: 0, 'needs-improvement': 0, poor: 0 } };
                }
                
                pathGroups[pathname][name].sum += value;
                pathGroups[pathname][name].count += 1;
                if (rating) {
                    pathGroups[pathname][name].ratings[rating] = (pathGroups[pathname][name].ratings[rating] || 0) + 1;
                }
            });

            // Flatten and map to path experience scores
            webVitalsStats = Object.entries(pathGroups).map(([pathname, metrics]) => {
                const lcp = metrics['LCP'] ? (metrics['LCP'].sum / metrics['LCP'].count) : null;
                const cls = metrics['CLS'] ? (metrics['CLS'].sum / metrics['CLS'].count) : null;
                const inp = metrics['INP'] ? (metrics['INP'].sum / metrics['INP'].count) : null;
                const ttfb = metrics['TTFB'] ? (metrics['TTFB'].sum / metrics['TTFB'].count) : null;
                
                // Determine dominant rating / status
                let totalPoor = 0;
                let totalNeedsImprovement = 0;
                let totalGood = 0;
                
                Object.values(metrics).forEach(m => {
                    totalPoor += m.ratings.poor || 0;
                    totalNeedsImprovement += m.ratings['needs-improvement'] || 0;
                    totalGood += m.ratings.good || 0;
                });
                
                let rating = 'good';
                if (totalPoor > 0) rating = 'poor';
                else if (totalNeedsImprovement > 0) rating = 'needs-improvement';

                return {
                    pathname,
                    lcp,
                    cls,
                    inp,
                    ttfb,
                    rating,
                    totalEvents: totalPoor + totalNeedsImprovement + totalGood
                };
            })
            // Sort by LCP or poor rating first
            .sort((a, b) => {
                if (a.rating === 'poor' && b.rating !== 'poor') return -1;
                if (b.rating === 'poor' && a.rating !== 'poor') return 1;
                return (b.lcp || 0) - (a.lcp || 0);
            })
            .slice(0, 5); // top 5 slowest/worst paths
        }

        // Calculate current 7-day average metrics
        if (dailySummary && dailySummary.length > 0) {
            let lcpSum = 0, clsSum = 0, inpSum = 0, ttfbSum = 0;
            let lcpCount = 0, clsCount = 0, inpCount = 0, ttfbCount = 0;
            
            dailySummary.forEach(day => {
                if (day.lcp_count > 0) { lcpSum += day.lcp_avg; lcpCount++; }
                if (day.cls_count > 0) { clsSum += day.cls_avg; clsCount++; }
                if (day.inp_count > 0) { inpSum += day.inp_avg; inpCount++; }
                if (day.ttfb_count > 0) { ttfbSum += day.ttfb_avg; ttfbCount++; }
            });

            webVitalsSummary = {
                lcp: lcpCount > 0 ? (lcpSum / lcpCount) : null,
                cls: clsCount > 0 ? (clsSum / clsCount) : null,
                inp: inpCount > 0 ? (inpSum / inpCount) : null,
                ttfb: ttfbCount > 0 ? (ttfbSum / ttfbCount) : null,
                count: dailySummary.reduce((acc, curr) => acc + (curr.total_events || 0), 0)
            };
        }
    } catch (err: any) {
        console.error("Web Vitals Fetch Error:", err);
        webVitalsError = err.message || String(err);
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Genel Bakış</h1>
                <p className="text-muted-foreground">
                    Sitenin güncel durumunu, içerikleri ve veritabanı sağlığını buradan takip edebilirsin.
                </p>
            </div>

            {/* General Counts Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Makale</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{articlesCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sözlük Terimi</CardTitle>
                        <Book className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{termsCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Forum Sorusu</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{questionsCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kullanıcı</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersCount || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Questions & Users Split Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Son Sorular</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentQuestions?.map((question) => (
                                <div key={question.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <Link prefetch={false} href={`/forum/${question.id}`} className="font-medium hover:underline line-clamp-1">
                                            {question.title}
                                        </Link>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span>{question.profiles?.username || "Anonim"}</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs font-medium bg-muted px-2 py-1 rounded">
                                        {question.category}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Son Üyeler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers?.map((user) => (
                                <div key={user.id} className="flex items-center gap-4 border-b pb-2 last:border-0 last:pb-0">
                                    <div className="relative h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                        {user.avatar_url ? (
                                            <Image src={user.avatar_url} alt={user.username || ""} fill sizes="32px" className="object-cover" />
                                        ) : (
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.username || "İsimsiz"}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: tr })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SEO & GEO Health Section */}
            <Card className="w-full border-[3px] border-black bg-white dark:bg-[#18181b] shadow-[6px_6px_0px_0px_#000] overflow-hidden rounded-none transition-all">
                <CardHeader className="flex flex-row items-center justify-between border-b-[3px] border-black bg-[#FFE500] text-black py-4 px-6">
                    <div>
                        <CardTitle className="text-xl font-extrabold flex items-center gap-2 tracking-tight">
                            <Sparkles className="h-5.5 w-5.5 stroke-[2.5px] fill-current animate-pulse text-black" />
                            SEO & GEO Sağlık ve Arama Görünürlüğü
                        </CardTitle>
                        <p className="text-[10px] font-black uppercase opacity-90 mt-1 tracking-wider">
                            Yapay Zeka Motorları (GEO) ve Klasik Arama (SEO) Optimizasyon Telemetrileri
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase rounded border border-black shadow-[2px_2px_0px_#000]">
                        <Activity className="h-3.5 w-3.5 animate-pulse text-[#FFE500]" />
                        GEO Aktif
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {seoPanelError ? (
                        <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border-[3px] border-black shadow-[4px_4px_0px_#000] rounded-none flex items-start gap-4">
                            <ShieldAlert className="h-7 w-7 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-black text-black dark:text-amber-400 text-sm uppercase tracking-wider">SEO/GEO Analiz Görünümü Aktif Değil</h3>
                                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-2 leading-relaxed">
                                    Yapay zeka arama motorları görünürlüğü ve zayıf içerik analizlerini görebilmek için veritabanınızda gerekli RPC fonksiyonlarını tanımlayın.
                                    <br />
                                    <strong>Hata Detayı:</strong> <code className="bg-amber-100 dark:bg-amber-950/40 px-1 py-0.5 rounded font-mono text-[11px]">{seoPanelError}</code>
                                </p>
                                <div className="mt-4 p-3 bg-zinc-900 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 border-2 border-black font-mono text-[10px] whitespace-pre-wrap overflow-x-auto shadow-[3px_3px_0px_#000]">
                                    {`-- Çözüm: supabase/migrations/20260526193000_public_seo_rpc.sql dosyasındaki komutları
-- Supabase Dashboard > SQL Editor sekmesinde çalıştırın.`}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Column 1: Low Value Content Warnings (Thin pages) */}
                            <div className="border-[3px] border-black bg-zinc-50 dark:bg-zinc-900/50 p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                                <div>
                                    <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 border-b-2 border-black pb-2 mb-4 text-black dark:text-white">
                                        <AlertTriangle className="h-4.5 w-4.5 text-amber-500 stroke-[2.5px]" />
                                        İçerik Hacmi Uyarıları (Kısa Sayfalar)
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Arama motorlarının zayıf içerik (thin content) olarak algıladığı, görünür metni çok kısa olan indexlenebilir sayfalar.
                                    </p>

                                    {seoLowValueContent.length === 0 ? (
                                        <div className="flex items-center gap-3 p-4 bg-green-100 dark:bg-green-950/20 border-2 border-black shadow-[3px_3px_0px_#000] text-green-800 dark:text-green-400 font-bold text-xs">
                                            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                                            Tebrikler! Düşük hacimli zayıf içerik tespit edilmedi.
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                            {seoLowValueContent.map((item: any) => (
                                                <div key={`${item.source_type}-${item.source_id}`} className="border-2 border-black bg-white dark:bg-zinc-900 p-3 flex flex-col justify-between gap-2 shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] transition-all">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="font-bold text-xs hover:underline truncate max-w-[200px] text-zinc-900 dark:text-zinc-100">
                                                            {item.title}
                                                        </span>
                                                        <span className="shrink-0 text-[10px] font-black bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                                                            {item.visible_text_length} Karakter
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                                                        <span className="font-mono text-[9px] truncate max-w-[220px]">{item.canonical_path}</span>
                                                        <Link 
                                                            href={item.canonical_path} 
                                                            target="_blank"
                                                            className="flex items-center gap-1 font-black text-black dark:text-[#FFE500] uppercase hover:underline"
                                                        >
                                                            İncele <ChevronRight className="h-3 w-3" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {seoLowValueContent.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-500 font-semibold italic">
                                        * Arama motorlarında üst sıralarda listelenmek ve yapay zeka tarafından taranmak için sayfadaki metni en az 300 kelimeye çıkarın.
                                    </div>
                                )}
                            </div>

                            {/* Column 2: Search Index Sync Status */}
                            <div className="border-[3px] border-black bg-zinc-50 dark:bg-zinc-900/50 p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                                <div>
                                    <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 border-b-2 border-black pb-2 mb-4 text-black dark:text-white">
                                        <RefreshCw className="h-4.5 w-4.5 text-blue-500 stroke-[2.5px]" />
                                        Arama İndeksi Eşitleme Durumu
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Yayınlanan ancak semantik ve hibrit arama dizinine (public.documents) aktarılmamış, yapay zeka arama botlarının göremediği sayfalar.
                                    </p>

                                    {seoUnsyncedContent.length === 0 ? (
                                        <div className="flex items-center gap-3 p-4 bg-green-100 dark:bg-green-950/20 border-2 border-black shadow-[3px_3px_0px_#000] text-green-800 dark:text-green-400 font-bold text-xs">
                                            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                                            Harika! Tüm yayınlanmış sayfalar vektör diziniyle tamamen senkronize.
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                            {seoUnsyncedContent.map((item: any) => (
                                                <div key={`${item.source_type}-${item.source_id}`} className="border-2 border-black bg-white dark:bg-zinc-900 p-3 flex flex-col justify-between gap-2 shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] transition-all">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="font-bold text-xs truncate max-w-[200px] text-zinc-900 dark:text-zinc-100">
                                                            {item.title}
                                                        </span>
                                                        <span className="shrink-0 text-[10px] font-black bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                                                            İndeks Eksik
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-semibold">
                                                        <span className="font-mono text-[9px] truncate max-w-[220px]">{item.expected_path}</span>
                                                        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[8px] font-bold border border-zinc-200 dark:border-zinc-700 uppercase tracking-wider">
                                                            {item.source_type}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {seoUnsyncedContent.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                                        <span className="text-[10px] text-zinc-500 font-semibold italic">
                                            * ChatGPT Search & Perplexity için bu sayfaların indekslenmesi zorunludur.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Core Web Vitals & Page Experience Section */}
            <Card className="w-full border-[3px] border-black bg-white dark:bg-[#18181b] shadow-[6px_6px_0px_0px_#000] overflow-hidden rounded-none transition-all">
                <CardHeader className="flex flex-row items-center justify-between border-b-[3px] border-black bg-[#FFE500] text-black py-4 px-6">
                    <div>
                        <CardTitle className="text-xl font-extrabold flex items-center gap-2 tracking-tight">
                            <Activity className="h-5.5 w-5.5 stroke-[2.5px] text-black animate-pulse" />
                            Kullanıcı Deneyimi ve Sayfa Hızı (Core Web Vitals)
                        </CardTitle>
                        <p className="text-[10px] font-black uppercase opacity-90 mt-1 tracking-wider">
                            Gerçek Kullanıcı Ölçümleri (RUM) ve SEO Hız Kriterleri Telemetrisi (Son 30 Gün)
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase rounded border border-black shadow-[2px_2px_0px_#000]">
                        <Activity className="h-3.5 w-3.5 animate-pulse text-[#FFE500]" />
                        RUM Aktif
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {webVitalsError ? (
                        <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border-[3px] border-black shadow-[4px_4px_0px_#000] rounded-none flex items-start gap-4">
                            <ShieldAlert className="h-7 w-7 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-black text-black dark:text-amber-400 text-sm uppercase tracking-wider">Web Vitals Telemetrisi Aktif Değil</h3>
                                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-2 leading-relaxed">
                                    Gerçek kullanıcı performans verilerini ve yavaş yüklenen rotaları görebilmek için veritabanınızda gerekli telemetri tablolarının ve özetlerinin kurulu olduğundan emin olun.
                                    <br />
                                    <strong>Hata Detayı:</strong> <code className="bg-amber-100 dark:bg-amber-950/40 px-1 py-0.5 rounded font-mono text-[11px]">{webVitalsError}</code>
                                </p>
                                <div className="mt-4 p-3 bg-zinc-900 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 border-2 border-black font-mono text-[10px] whitespace-pre-wrap overflow-x-auto shadow-[3px_3px_0px_#000]">
                                    {`-- Çözüm: supabase/migrations/20260523000500_web_vitals_cleanup_and_aggregation.sql
-- dosyasındaki bakım komutlarını Supabase SQL Editor'de çalıştırarak başlangıç verisini doldurun.`}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Overall Stats Cards */}
                            {webVitalsSummary ? (
                                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                                    {/* LCP */}
                                    <div className="border-[3px] border-black bg-white dark:bg-zinc-900 p-4 shadow-[3px_3px_0px_#000] flex flex-col justify-between hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] transition-all">
                                        <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">LCP (Largest Contentful Paint)</div>
                                        <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                                            {webVitalsSummary.lcp ? `${(webVitalsSummary.lcp / 1000).toFixed(2)}s` : '---'}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-muted-foreground">Hedef: &lt; 2.5s</span>
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase border border-black shadow-[1px_1px_0px_#000] ${
                                                !webVitalsSummary.lcp ? 'bg-zinc-100 text-zinc-500' :
                                                webVitalsSummary.lcp < 2500 ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                                                webVitalsSummary.lcp < 4000 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                            }`}>
                                                {!webVitalsSummary.lcp ? 'Veri Yok' : webVitalsSummary.lcp < 2500 ? 'İyi' : webVitalsSummary.lcp < 4000 ? 'Geliştirilmeli' : 'Kötü'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CLS */}
                                    <div className="border-[3px] border-black bg-white dark:bg-zinc-900 p-4 shadow-[3px_3px_0px_#000] flex flex-col justify-between hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] transition-all">
                                        <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">CLS (Cumulative Layout Shift)</div>
                                        <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                                            {webVitalsSummary.cls ? webVitalsSummary.cls.toFixed(3) : '---'}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-muted-foreground">Hedef: &lt; 0.1</span>
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase border border-black shadow-[1px_1px_0px_#000] ${
                                                !webVitalsSummary.cls ? 'bg-zinc-100 text-zinc-500' :
                                                webVitalsSummary.cls < 0.1 ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                                                webVitalsSummary.cls < 0.25 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                            }`}>
                                                {!webVitalsSummary.cls ? 'Veri Yok' : webVitalsSummary.cls < 0.1 ? 'İyi' : webVitalsSummary.cls < 0.25 ? 'Geliştirilmeli' : 'Kötü'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* INP */}
                                    <div className="border-[3px] border-black bg-white dark:bg-zinc-900 p-4 shadow-[3px_3px_0px_#000] flex flex-col justify-between hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] transition-all">
                                        <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">INP (Interaction to Next Paint)</div>
                                        <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                                            {webVitalsSummary.inp ? `${webVitalsSummary.inp.toFixed(0)}ms` : '---'}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-muted-foreground">Hedef: &lt; 200ms</span>
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase border border-black shadow-[1px_1px_0px_#000] ${
                                                !webVitalsSummary.inp ? 'bg-zinc-100 text-zinc-500' :
                                                webVitalsSummary.inp < 200 ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                                                webVitalsSummary.inp < 500 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                            }`}>
                                                {!webVitalsSummary.inp ? 'Veri Yok' : webVitalsSummary.inp < 200 ? 'İyi' : webVitalsSummary.inp < 500 ? 'Geliştirilmeli' : 'Kötü'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* TTFB */}
                                    <div className="border-[3px] border-black bg-white dark:bg-zinc-900 p-4 shadow-[3px_3px_0px_#000] flex flex-col justify-between hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] transition-all">
                                        <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">TTFB (Time to First Byte)</div>
                                        <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                                            {webVitalsSummary.ttfb ? `${webVitalsSummary.ttfb.toFixed(0)}ms` : '---'}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-muted-foreground">Hedef: &lt; 800ms</span>
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase border border-black shadow-[1px_1px_0px_#000] ${
                                                !webVitalsSummary.ttfb ? 'bg-zinc-100 text-zinc-500' :
                                                webVitalsSummary.ttfb < 800 ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                                                webVitalsSummary.ttfb < 1800 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                            }`}>
                                                {!webVitalsSummary.ttfb ? 'Veri Yok' : webVitalsSummary.ttfb < 800 ? 'İyi' : webVitalsSummary.ttfb < 1800 ? 'Geliştirilmeli' : 'Kötü'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-black shadow-[3px_3px_0px_#000] text-zinc-600 dark:text-zinc-400 font-bold text-xs">
                                    <AlertTriangle className="h-5 w-5 shrink-0" />
                                    Son 7 gün için yeterli Core Web Vitals ölçümü birikmedi. Kullanıcı etkileşimleri bekleniyor.
                                </div>
                            )}

                            {/* Top Poorest Performing Routes */}
                            <div className="border-[3px] border-black bg-zinc-50 dark:bg-zinc-900/50 p-5 shadow-[4px_4px_0px_#000]">
                                <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 border-b-2 border-black pb-2 mb-4 text-black dark:text-white">
                                    <AlertTriangle className="h-4.5 w-4.5 text-red-500 stroke-[2.5px]" />
                                    Yavaş Yüklenen Rotalar (Performans Regresyonları)
                                </h3>
                                <p className="text-xs text-muted-foreground mb-4">
                                    LCP değerlerine ve hata oranlarına göre en çok gecikme yaşayan ve arama/GEO robotları taranabilirliğini olumsuz etkileyen ilk 5 sayfa rotası.
                                </p>

                                {webVitalsStats.length === 0 ? (
                                    <div className="flex items-center gap-3 p-4 bg-green-100 dark:bg-green-950/20 border-2 border-black shadow-[3px_3px_0px_#000] text-green-800 dark:text-green-400 font-bold text-xs">
                                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                                        Tebrikler! Son 30 gün içinde yavaş yüklenen rota veya hız uyarısı tespit edilmedi.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-left text-xs">
                                            <thead>
                                                <tr className="border-b-2 border-black text-black dark:text-white font-bold uppercase text-[10px] tracking-wider pb-2">
                                                    <th className="pb-2">Sayfa Rotası (Pathname)</th>
                                                    <th className="pb-2 text-center">LCP (Yüklenme)</th>
                                                    <th className="pb-2 text-center">CLS (Düzen Kayması)</th>
                                                    <th className="pb-2 text-center">INP (Tepkisellik)</th>
                                                    <th className="pb-2 text-center">Deneyim Rating</th>
                                                    <th className="pb-2 text-right">Toplam Olay</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                                                {webVitalsStats.map((row: any) => (
                                                    <tr key={row.pathname} className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors">
                                                        <td className="py-3 font-bold text-foreground font-mono text-[11px] truncate max-w-[250px]">{row.pathname}</td>
                                                        <td className="py-3 text-center">
                                                            <span className={row.lcp > 4000 ? 'text-red-500 font-black' : row.lcp > 2500 ? 'text-amber-500 font-bold' : 'text-green-500 font-bold'}>
                                                                {row.lcp ? `${(row.lcp / 1000).toFixed(2)}s` : '---'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <span className={row.cls > 0.25 ? 'text-red-500 font-black' : row.cls > 0.1 ? 'text-amber-500 font-bold' : 'text-green-500 font-bold'}>
                                                                {row.cls ? row.cls.toFixed(3) : '---'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <span className={row.inp > 500 ? 'text-red-500 font-black' : row.inp > 200 ? 'text-amber-500 font-bold' : 'text-green-500 font-bold'}>
                                                                {row.inp ? `${row.inp.toFixed(0)}ms` : '---'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase border border-black shadow-[1px_1px_0px_#000] ${
                                                                row.rating === 'poor' ? 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400' :
                                                                row.rating === 'needs-improvement' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
                                                                'bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400'
                                                            }`}>
                                                                {row.rating === 'poor' ? 'Zayıf' : row.rating === 'needs-improvement' ? 'İyileştirilmeli' : 'İyi'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-right font-mono text-zinc-500 text-[10px]">{row.totalEvents} olay</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Database Health Section */}
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Database className="h-5 w-5 text-emerald-500 stroke-[2.5px]" />
                            Veritabanı Sağlık Durumu (PostgreSQL Telemetrisi)
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tablo boyutları, indeks kullanım oranları ve sequential scan sıklıkları.
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase rounded-lg border border-emerald-500/20">
                        <Activity className="h-3.5 w-3.5 animate-pulse" />
                        Aktif Analiz
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {dbHealthError || !dbHealth ? (
                        <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-500/20 rounded-xl flex items-start gap-4">
                            <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-amber-800 dark:text-amber-400 text-sm">Veritabanı Analiz Görünümü Aktif Değil</h3>
                                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                                    Tablo bazlı performans telemetrilerini burada görüntülemek için lütfen veritabanı şemanızda gerekli görünümü oluşturun.
                                    <br />
                                    <strong>Çözüm:</strong> Proje kök dizinindeki <code>supabase/migrations/20260523000200_advanced_database_insights.sql</code> dosyasının içerdiği SQL komutlarını Supabase Dashboard &gt; SQL Editor alanına yapıştırıp çalıştırın.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b-2 border-muted-foreground/10 text-muted-foreground font-bold uppercase text-[10px] tracking-wider pb-3">
                                        <th className="pb-3">Tablo Adı</th>
                                        <th className="pb-3">Toplam Boyut</th>
                                        <th className="pb-3">Tablo / İndeks</th>
                                        <th className="pb-3 text-center">İndeks İnceleme (Scan)</th>
                                        <th className="pb-3 text-center">İndeks Kullanım Oranı</th>
                                        <th className="pb-3 text-right">Yazma İşlemleri (I/U/D)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-muted-foreground/10 font-medium">
                                    {dbHealth.map((row: any) => {
                                        const usage = parseFloat(row.index_usage_rate || "0");
                                        const isLowUsage = usage < 50 && (row.sequential_scans || 0) > 100;
                                        
                                        return (
                                            <tr key={row.table_name} className="hover:bg-muted/50 transition-colors">
                                                <td className="py-3.5 font-bold text-foreground font-mono">{row.table_name}</td>
                                                <td className="py-3.5">{row.total_size}</td>
                                                <td className="py-3.5 text-muted-foreground">
                                                    {row.table_size} / {row.index_size}
                                                </td>
                                                <td className="py-3.5 text-center">
                                                    <span className="text-emerald-500 font-bold">{row.index_scans} idx</span>
                                                    <span className="text-muted-foreground mx-1.5">•</span>
                                                    <span className="text-amber-500 font-bold">{row.sequential_scans} seq</span>
                                                </td>
                                                <td className="py-3.5 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                        isLowUsage 
                                                            ? "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/20"
                                                            : usage >= 85
                                                                ? "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-500/20"
                                                                : "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                                    }`}>
                                                        {row.index_usage_rate}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 text-right font-mono text-muted-foreground">
                                                    {row.rows_inserted} / {row.rows_updated} / {row.rows_deleted}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
