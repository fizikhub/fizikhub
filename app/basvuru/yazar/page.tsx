"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { writerApplicationSchema, WriterApplicationFormValues } from "./schema";
import { submitWriterApplication } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, PenTool } from "lucide-react";

export default function WriterApplicationPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<WriterApplicationFormValues>({
        resolver: zodResolver(writerApplicationSchema),
        defaultValues: {
            fullName: "",
            university: "",
            phone: "",
            interestArea: "",
            menemenPreference: undefined,
            email: "",
            experience: "",
            about: "",
        },
    });

    async function onSubmit(data: WriterApplicationFormValues) {
        setIsSubmitting(true);
        try {
            const response = await submitWriterApplication(data);
            if (response.error) {
                toast.error(response.error);
            } else {
                toast.success("Başvurun havaya fırlatıldı! 🚀 Adminlerimiz inceleyip dönecek.");
                form.reset();
                setTimeout(() => router.push("/"), 2000);
            }
        } catch (error) {
            toast.error("Bir şeyler ters gitti via.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-background py-10 px-4 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full bg-card border border-border/50 rounded-3xl p-6 md:p-10 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PenTool className="w-10 h-10 text-amber-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-3">Yazar Başvuru Formu</h1>
                    <p className="text-muted-foreground">
                        Bilimsel merakını, edebi yeteneğini ve menemen tercihini bizimle paylaş.
                        <br />
                        <span className="text-xs opacity-70">(Ciddiyiz, hepsini okuyoruz.)</span>
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adın Soyadın</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Albert Einstein" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-posta Adresin</FormLabel>
                                        <FormControl>
                                            <Input placeholder="albert@relativity.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="university"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Okuduğun / Mezun Olduğun Okul</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ETH Zürich" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefon Numaran (Opsiyonel)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0555..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="interestArea"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>İlgilendiğin Alanlar</FormLabel>
                                    <FormDescription>Fizik, Biyoloji, Teknoloji, Uzay...</FormDescription>
                                    <FormControl>
                                        <Input placeholder="Kuantum mekaniği ve kedi bakımı..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Daha önce bir yerde yazdın mı?</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Evet, kişisel blogumda evrenin genişlemesini anlattım..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="about"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bize biraz kendinden bahset</FormLabel>
                                    <FormDescription>Neden yazmak istiyorsun? Seni ne heyecanlandırır?</FormDescription>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Çocukluğumdan beri yıldızlara bakarım..."
                                            className="resize-none h-32"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="menemenPreference"
                            render={({ field }) => (
                                <FormItem className="space-y-3 bg-secondary/20 p-4 rounded-xl border border-secondary">
                                    <FormLabel className="text-lg font-bold">Kritik Soru: Menemen?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="soganli" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Soğanlı (Bilimsel olarak daha lezzetli) 🧅
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="sogansiz" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Soğansız (Sadeseverim) 🍳
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-lg h-12"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Gönderiliyor...
                                </>
                            ) : (
                                "Başvuruyu Tamamla"
                            )}
                        </Button>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
}
