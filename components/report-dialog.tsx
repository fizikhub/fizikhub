"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { createReport } from "@/app/actions/report";

interface ReportDialogProps {
    resourceId: string | number;
    resourceType: 'question' | 'answer' | 'comment' | 'user';
    trigger?: React.ReactNode;
}

export function ReportDialog({ resourceId, resourceType, trigger }: ReportDialogProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) {
            toast.error("Lütfen bir sebep seçin.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createReport({
                resourceId: resourceId.toString(),
                resourceType,
                reason,
                description
            });

            if (result.success) {
                toast.success("Şikayetiniz alındı. Teşekkürler.");
                setOpen(false);
                setReason("");
                setDescription("");
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                        <Flag className="h-4 w-4 mr-2" />
                        Bildir
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>İçeriği Bildir</DialogTitle>
                    <DialogDescription>
                        Bu içeriğin neden uygunsuz olduğunu düşünüyorsunuz?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Sebep</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Bir sebep seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="spam">Spam / Reklam</SelectItem>
                                <SelectItem value="harassment">Taciz / Zorbalık</SelectItem>
                                <SelectItem value="inappropriate">Uygunsuz İçerik</SelectItem>
                                <SelectItem value="misinformation">Yanlış Bilgi</SelectItem>
                                <SelectItem value="other">Diğer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama (İsteğe bağlı)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ek detaylar..."
                            className="resize-none"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            İptal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
