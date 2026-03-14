"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

interface ReportButtonProps {
    contentType: "question" | "answer" | "article" | "comment";
    contentId: number;
    variant?: "ghost" | "outline" | "default";
    size?: "sm" | "default";
}

const REPORT_REASONS = [
    { value: "spam", label: "Spam veya reklam" },
    { value: "offensive", label: "Hakaret veya saldırgan içerik" },
    { value: "misinformation", label: "Yanlış bilgi" },
    { value: "duplicate", label: "Tekrar eden içerik" },
    { value: "other", label: "Diğer" },
];

export function ReportButton({ contentType, contentId, variant = "ghost", size = "sm" }: ReportButtonProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Fix: Initialize supabase client once
    const [supabase] = useState(() => createClient());

    const handleSubmit = async () => {
        if (!reason) {
            toast.error("Lütfen bir sebep seçin");
            return;
        }

        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("Rapor göndermek için giriş yapmalısınız");
                setIsSubmitting(false);
                return;
            }

            const { error } = await supabase
                .from("reports")
                .insert({
                    reporter_id: user.id,
                    content_type: contentType,
                    content_id: contentId,
                    reason: reason,
                    description: description || null
                });

            if (error) throw error;

            toast.success("Raporunuz alındı. İnceleme yapılacak.");
            setOpen(false);
            setReason("");
            setDescription("");
        } catch (error: any) {
            console.error("Report error:", error);
            toast.error("Bir hata oluştu");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} size={size} className="gap-1.5 h-9 px-3 rounded-lg border-[2px] border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-zinc-300 font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)] hover:bg-neo-pink hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all">
                    <Flag className="h-3.5 w-3.5 stroke-[2.5px]" />
                    <span className="hidden sm:inline">Rapor</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_rgba(255,255,255,0.06)] bg-white dark:bg-[#1e1e21]">
                <DialogHeader>
                    <DialogTitle>İçeriği Rapor Et</DialogTitle>
                    <DialogDescription>
                        Bu içeriği bildirmenizin sebebi nedir?
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <RadioGroup value={reason} onValueChange={setReason}>
                        {REPORT_REASONS.map((r) => (
                            <div key={r.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={r.value} id={r.value} />
                                <Label htmlFor={r.value} className="cursor-pointer">
                                    {r.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <div className="space-y-2">
                        <Label htmlFor="description">Ek açıklama (opsiyonel)</Label>
                        <Textarea
                            id="description"
                            placeholder="Daha fazla detay ekleyin..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} className="border-[2px] border-black dark:border-zinc-600 rounded-lg font-bold shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)]">
                        İptal
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !reason} className="bg-[#FFBD2E] text-black hover:bg-[#FFD268] border-[2px] border-black dark:border-zinc-600 rounded-lg font-bold shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all">
                        {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
