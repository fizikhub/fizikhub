"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddDictionaryTermPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        term: "",
        definition: "",
        category: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('dictionary_terms')
                .insert(formData);

            if (error) throw error;

            toast.success("Terim sözlüğe eklendi!");
            setFormData({ term: "", definition: "", category: "" }); // Reset form
            router.refresh();
        } catch (error: any) {
            toast.error("Hata: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Yeni Sözlük Terimi Ekle</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="term">Terim</Label>
                            <Input
                                id="term"
                                name="term"
                                placeholder="Örn: Entropi"
                                value={formData.term}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Input
                                id="category"
                                name="category"
                                placeholder="Örn: Termodinamik"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="definition">Tanım</Label>
                            <Textarea
                                id="definition"
                                name="definition"
                                placeholder="Terimin açıklaması..."
                                value={formData.definition}
                                onChange={handleChange}
                                required
                                className="h-32"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Ekleniyor..." : "Terimi Ekle"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
