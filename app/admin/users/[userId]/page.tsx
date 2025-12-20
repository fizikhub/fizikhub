import { createClient } from "@/lib/supabase-server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Calendar, Activity } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{
        userId: string;
    }>;
}

export default async function AdminUserDetailsPage({ params }: Props) {
    const { userId } = await params;
    const supabase = await createClient();

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (!profile) {
        notFound();
    }

    // 2. Fetch Email (requires internal usage or special rpc, but usually profiles might not have email if not synced.
    // However, we can try to fetch from auth.users via rpc if available, OR just rely on profile data if it has it.
    // Standard setup usually keeps email private in auth schema.
    // For now we show what we have in profiles.

    // 3. Fetch Activity Logs
    const { data: logs } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Detayı</h1>

            {/* User Info Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.username} className="h-full w-full rounded-full object-cover" />
                            ) : (
                                profile.username?.charAt(0).toUpperCase() || <Users />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{profile.username || "İsimsiz Kullanıcı"}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Badge variant={profile.role === 'admin' ? "destructive" : "secondary"}>
                                    {profile.role || 'user'}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono">{userId}</span>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Clock className="mr-2 h-4 w-4" /> Son Görülme
                        </div>
                        <div className="font-medium text-lg">
                            {profile.last_seen
                                ? format(new Date(profile.last_seen), "d MMMM yyyy HH:mm:ss", { locale: tr })
                                : "Bilinmiyor"}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Calendar className="mr-2 h-4 w-4" /> Kayıt Tarihi
                        </div>
                        <div className="font-medium text-lg">
                            {profile.created_at
                                ? format(new Date(profile.created_at), "d MMMM yyyy HH:mm", { locale: tr })
                                : "Bilinmiyor"}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Logs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Aktivite Geçmişi (Son 100)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Zaman</TableHead>
                                <TableHead>Eylem</TableHead>
                                <TableHead>Yol / Detay</TableHead>
                                <TableHead>Cihaz</TableHead>
                                <TableHead>IP</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs && logs.length > 0 ? (
                                logs.map((log) => {
                                    // Simple UA Parser
                                    const ua = log.user_agent || "";
                                    let device = "Bilinmiyor";
                                    let icon = "❓";

                                    if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) {
                                        device = "Mobil";
                                        icon = "📱";
                                    } else if (ua.includes("Windows") || ua.includes("Mac") || ua.includes("Linux")) {
                                        device = "Bilgisayar";
                                        icon = "💻";
                                    }

                                    return (
                                        <TableRow key={log.id}>
                                            <TableCell className="whitespace-nowrap font-mono text-xs">
                                                {format(new Date(log.created_at), "dd.MM.yyyy HH:mm:ss", { locale: tr })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-bold">
                                                    {log.action_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-md truncate" title={log.path}>
                                                <div className="font-medium text-sm">{log.path}</div>
                                                {log.details && Object.keys(log.details).length > 0 && (
                                                    <pre className="text-[10px] text-muted-foreground mt-1 overflow-hidden">
                                                        {JSON.stringify(log.details)}
                                                    </pre>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                <div className="flex items-center gap-2" title={ua}>
                                                    <span>{icon}</span>
                                                    <span>{device}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground font-mono">
                                                {log.ip_address}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Henüz aktivite kaydı yok.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
