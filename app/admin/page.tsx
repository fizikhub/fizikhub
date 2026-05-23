import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Book, MessageSquare, Users, Database, Activity, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
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
