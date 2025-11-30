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
    const supabase = createClient();

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
                <Button variant={variant} size={size} className="gap-2">
                    <Flag className="h-4 w-4" />
                    <span className="hidden sm:inline">Rapor Et</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
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
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        İptal
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !reason}>
                        {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
