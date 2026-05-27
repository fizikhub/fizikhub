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
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const revalidate = 0;

export default async function ContentQualityDashboard() {
    const supabase = await createClient();

    const [lowValueResult, violationsResult] = await Promise.all([
        supabase.from("view_low_value_indexable_content").select("*").limit(100),
        supabase.from("view_search_visibility_violations").select("*").limit(100)
    ]);

    const lowValueContent = lowValueResult.data || [];
    const violations = violationsResult.data || [];

    const getEditLink = (type: string, id: string) => {
        if (type === "article") return `/admin/articles/edit/${id}`;
        if (type === "question") return `/forum/${id}`;
        return "#";
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">İçerik Kalitesi (SEO)</h1>
                <p className="text-muted-foreground mt-2">
                    SEO teknik borcu oluşturan zayıf içerikler ve arama görünürlüğü ihlalleri.
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-destructive">Görünürlük İhlalleri</CardTitle>
                        <CardDescription>Eksik meta açıklaması veya kategorisi olmayan indekslenmiş içerikler.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {violations.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tür</TableHead>
                                            <TableHead>Başlık</TableHead>
                                            <TableHead>İhlal Sebebi</TableHead>
                                            <TableHead className="text-right">Aksiyon</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {violations.map((row, idx) => (
                                            <TableRow key={`v-${row.id}-${idx}`}>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{row.content_type}</Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {row.title}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-destructive font-medium">{row.violation_type}</span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={getEditLink(row.content_type, row.id)} className="inline-flex items-center text-sm text-primary hover:underline" target="_blank">
                                                        Düzenle <ExternalLink className="ml-1 h-3 w-3" />
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex h-[150px] items-center justify-center text-muted-foreground border rounded-md">
                                Tebrikler, görünürlük ihlali bulunmuyor.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-orange-600 dark:text-orange-400">Zayıf (Düşük Değerli) İçerikler</CardTitle>
                        <CardDescription>Google tarafından faydasız (thin content) olarak işaretlenebilecek indekslenmiş içerikler.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {lowValueContent.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tür</TableHead>
                                            <TableHead>Başlık</TableHead>
                                            <TableHead>Sebep</TableHead>
                                            <TableHead className="text-right">Aksiyon</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lowValueContent.map((row, idx) => (
                                            <TableRow key={`lw-${row.id}-${idx}`}>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{row.content_type}</Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {row.title}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-orange-600 dark:text-orange-400 font-medium">{row.issue_reason}</span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={getEditLink(row.content_type, row.id)} className="inline-flex items-center text-sm text-primary hover:underline" target="_blank">
                                                        İncele <ExternalLink className="ml-1 h-3 w-3" />
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex h-[150px] items-center justify-center text-muted-foreground border rounded-md">
                                Zayıf içerik tespit edilmedi.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
