"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Search, Shield, PenTool, Eye } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { toggleWriterStatus } from "@/app/admin/actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Profile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    website: string | null;
    created_at: string;
    is_verified?: boolean;
    is_writer?: boolean;
    last_seen?: string | null;
}

interface AdminUsersListProps {
    initialUsers: Profile[];
}

export function AdminUsersList({ initialUsers }: AdminUsersListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState(initialUsers);
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const filteredUsers = users.filter(user =>
    (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleToggleWriter = async (userId: string, currentStatus: boolean) => {
        setIsLoading(userId);
        try {
            const result = await toggleWriterStatus(userId, !currentStatus);
            if (result.success) {
                toast.success(currentStatus ? "Yazar yetkisi alındı." : "Yazar yetkisi verildi.");
                setUsers(users.map(u => u.id === userId ? { ...u, is_writer: !currentStatus } : u));
            } else {
                toast.error(result.error || "İşlem başarısız.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Kullanıcı ara..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Kullanıcı</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Kayıt Tarihi</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Son Görülme</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Roller</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredUsers.length === 0 ? (
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td colSpan={5} className="p-4 align-middle [&:has([role=checkbox])]:pr-0 h-24 text-center">
                                        Kullanıcı bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.avatar_url || ""} />
                                                    <AvatarFallback>
                                                        {user.username?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium flex items-center gap-1">
                                                        {user.full_name || user.username}
                                                        {user.is_verified && (
                                                            <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                                                        )}
                                                        {user.username === 'barannnbozkurttb' && (
                                                            <Shield className="h-3.5 w-3.5 text-red-500 fill-red-500/10" />
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        @{user.username}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            {format(new Date(user.created_at), "d MMM yyyy", { locale: tr })}
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-muted-foreground">
                                            {user.last_seen ? format(new Date(user.last_seen), "d MMM HH:mm", { locale: tr }) : "-"}
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <div className="flex gap-1">
                                                {user.is_writer && (
                                                    <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-200">
                                                        <PenTool className="mr-1 h-3 w-3" />
                                                        Yazar
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant={user.is_writer ? "destructive" : "outline"}
                                                    size="sm"
                                                    onClick={() => handleToggleWriter(user.id, user.is_writer || false)}
                                                    disabled={isLoading === user.id}
                                                >
                                                    {user.is_writer ? "Yazarlığı Al" : "Yazar Yap"}
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        <Activity className="h-4 w-4 mr-1" /> Aktivite
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/profil/${user.username}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
                Toplam {filteredUsers.length} kullanıcı gösteriliyor
            </div>
        </div>
    );
}
