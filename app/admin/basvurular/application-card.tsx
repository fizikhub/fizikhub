"use client";

import { useState } from "react";
import { approveApplication, rejectApplication } from "./actions";
import { Button } from "@/components/ui/button";
import { Check, X, Coffee, GraduationCap, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function AdminApplicationCard({ application }: { application: any }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleApprove() {
        if (!confirm("Bu kullanıcıya Yazar yetkisi verilecek. Emin misin?")) return;
        setIsLoading(true);
        const res = await approveApplication(application.id, application.user_id);
        setIsLoading(false);
        if (res.error) toast.error(res.error);
        else toast.success("Başvuru onaylandı ve yetki verildi.");
    }

    async function handleReject() {
        if (!confirm("Başvuru reddedilecek. Emin misin?")) return;
        setIsLoading(true);
        const res = await rejectApplication(application.id);
        setIsLoading(false);
        if (res.error) toast.error(res.error);
        else toast.success("Başvuru reddedildi.");
    }

    const isPending = application.status === 'pending';

    return (
        <div className={`relative p-6 rounded-3xl border transition-all ${application.status === 'approved' ? 'bg-emerald-500/5 border-emerald-500/20' :
                application.status === 'rejected' ? 'bg-red-500/5 border-red-500/20' :
                    'bg-card border-border hover:shadow-lg'
            }`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center font-bold text-xl text-primary">
                        {application.full_name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-none mb-1">{application.full_name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="w-3 h-3" /> {application.email}
                        </p>
                    </div>
                </div>
                <Badge variant={
                    application.status === 'approved' ? 'default' : // default usually primary/black
                        application.status === 'rejected' ? 'destructive' :
                            'outline'
                } className={
                    application.status === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' : ''
                }>
                    {application.status === 'pending' ? 'Bekliyor' :
                        application.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                </Badge>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                        <GraduationCap className="w-3 h-3" /> Üniversite
                    </span>
                    <p className="font-medium">{application.university || "-"}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                        <Phone className="w-3 h-3" /> Telefon
                    </span>
                    <p className="font-medium">{application.phone || "-"}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                        <Clock className="w-3 h-3" /> Deneyim
                    </span>
                    <p className="font-medium">{application.experience || "-"}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                        <Coffee className="w-3 h-3" /> Menemen
                    </span>
                    <p className="font-medium capitalize text-amber-600 dark:text-amber-500">
                        {application.menemen_preference === 'soganli' ? 'Soğanlı 🧅' : 'Soğansız 🍳'}
                    </p>
                </div>
            </div>

            {/* Application Text */}
            <div className="bg-secondary/20 p-4 rounded-2xl mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Hakkında & Motivasyon</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{application.about}</p>
            </div>

            <div className="text-xs text-muted-foreground mb-6">
                Başvuru Tarihi: {formatDistanceToNow(new Date(application.created_at), { addSuffix: true, locale: tr })}
            </div>

            {/* Actions */}
            {isPending && (
                <div className="flex gap-3">
                    <Button
                        onClick={handleApprove}
                        disabled={isLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Check className="w-4 h-4 mr-2" /> Onayla & Yazar Yap
                    </Button>
                    <Button
                        onClick={handleReject}
                        disabled={isLoading}
                        variant="destructive"
                        className="flex-1"
                    >
                        <X className="w-4 h-4 mr-2" /> Reddet
                    </Button>
                </div>
            )}
        </div>
    );
}
