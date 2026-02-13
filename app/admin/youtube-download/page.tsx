"use client";

import { useState } from "react";
import {
    Download,
    Link as LinkIcon,
    Youtube,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getYoutubeDownloadUrl } from "../actions";
import NextImage from "next/image";

export default function YoutubeDownloadPage() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [videoInfo, setVideoInfo] = useState<any>(null);

    const handleFetchInfo = async () => {
        if (!url) return toast.error("Lütfen bir URL girin");
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            return toast.error("Geçerli bir YouTube linki girin");
        }

        setIsLoading(true);
        try {
            const videoId = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop();

            setVideoInfo({
                title: "YouTube Video Hazır",
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                author: "FizikHub Kurumsal",
                duration: "HD Kalite",
                videoId: videoId
            });

            toast.success("Video kuyruğa eklendi!");
        } catch (error) {
            toast.error("Video bilgisi alınamadı");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!url) return;

        setIsDownloading(true);
        const toastId = toast.loading("Video işleniyor ve indirme bağlantısı oluşturuluyor...");

        try {
            const result = await getYoutubeDownloadUrl(url);

            if (result.success && result.url) {
                toast.success("İndirme başlıyor!", { id: toastId });
                // Direct browser download
                window.open(result.url, "_self");
            } else {
                toast.error(result.error || "İndirme başlatılamadı.", { id: toastId });
            }
        } catch (error) {
            toast.error("Bir hata oluştu.", { id: toastId });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                    <Youtube className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">YouTube Video İndirici</h1>
                    <p className="text-sm text-muted-foreground">Kanalınız veya sosyal medya için hızlıca video indirin.</p>
                </div>
            </div>

            <Card className="border-2 border-black dark:border-white/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                <CardHeader>
                    <CardTitle className="text-lg">Video Linkini Yapıştırın</CardTitle>
                    <CardDescription>Desteklenen formatlar: YouTube Video, Shorts, Canlı Yayın Kaydı</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="pl-10 h-10 border-black/20 focus-visible:ring-red-500"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handleFetchInfo}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Info className="w-4 h-4 mr-2" />}
                            Bilgi Getir
                        </Button>
                    </div>

                    {videoInfo && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 rounded-xl border-2 border-black/10 dark:border-white/5 bg-muted/40 flex flex-col md:flex-row gap-6"
                        >
                            <div className="relative aspect-video w-full md:w-64 rounded-lg overflow-hidden border border-black/10">
                                <NextImage
                                    src={videoInfo.thumbnail}
                                    alt="Thumbnail"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    {videoInfo.duration}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
                                        {videoInfo.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold">FH</div>
                                        <span>FizikHub Kurumsal</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                        className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90 font-bold"
                                    >
                                        {isDownloading ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4 mr-2" />
                                        )}
                                        Videoyu İndir (MP4)
                                    </Button>
                                    <Button variant="outline" className="border-black/20">
                                        Sadece Ses (MP3)
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
                <CardFooter className="bg-muted/30 border-t flex items-center gap-2 py-3">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">
                        Not: İndirilen videolar telif hakları dahilinde kullanılmalıdır.
                    </span>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                    { title: "Hızlı İşlem", desc: "Saniyeler içinde indirme linki hazırlar.", icon: CheckCircle2 },
                    { title: "HD Kalite", desc: "Mümkün olan en yüksek çözünürlüğü destekler.", icon: CheckCircle2 },
                    { title: "Reklamsız", desc: "Admin paneline özel temiz arayüz.", icon: CheckCircle2 }
                ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border border-black/5 bg-white shadow-sm flex items-start gap-3">
                        <item.icon className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

