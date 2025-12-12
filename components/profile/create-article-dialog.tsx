"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenSquare, Loader2 } from "lucide-react";
import { createArticle } from "@/app/profil/article-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateArticleDialogProps {
    trigger?: React.ReactNode;
}

const categories = [
    "Kuantum Fiziği",
    "Astrofizik",
    "Termodinamik",
    "Mekanik",
    "Elektromanyetizma",
    "Genel Görelilik",
    "Parçacık Fiziği",
    "Genel"
];

export function CreateArticleDialog({ trigger }: CreateArticleDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await createArticle(formData);

            if (result.success) {
                toast.success("Makale başarıyla oluşturuldu!");
                setOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Bir hata oluştu");
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        className="gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <PenSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Makale Yaz</span>
                        <span className="sm:hidden">Yaz</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Yeni Makale Oluştur</DialogTitle>
                    <DialogDescription>
                        Bilim topluluğuyla bilgini paylaş. Markdown desteği var.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold">
                            Başlık <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Kuantum Dolanıklığı Nedir?"
                            required
                            className="text-lg"
                        />
                    </div>

                    {/* Category & Cover URL Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-semibold">
                                Kategori
                            </Label>
                            <Select name="category" defaultValue="Genel">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cover_url" className="text-sm font-semibold">
                                Kapak Resmi URL (opsiyonel)
                            </Label>
                            <Input
                                id="cover_url"
                                name="cover_url"
                                type="url"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-sm font-semibold">
                            Özet (opsiyonel)
                        </Label>
                        <Textarea
                            id="excerpt"
                            name="excerpt"
                            placeholder="Makalenin kısa bir özetini yazın..."
                            rows={2}
                            className="resize-none"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-sm font-semibold">
                            İçerik <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="Markdown formatında yazabilirsiniz...&#10;&#10;## Alt Başlık&#10;**Kalın metin** ve *italik metin*"
                            required
                            rows={12}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Markdown desteği: **kalın**, *italik*, ## başlık, [link](url)
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            name="status"
                            value="draft"
                            variant="secondary"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Taslak Olarak Kaydet
                        </Button>
                        <Button
                            type="submit"
                            name="status"
                            value="published"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-cyan-600 to-cyan-500"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Yayınla
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
