"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sendBroadcastNotification } from "@/app/admin/actions";
import { toast } from "sonner";
import { Send, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AdminBroadcastForm() {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) {
            toast.error("Lütfen bir mesaj girin.");
            return;
        }

        if (!confirm("Bu mesajı TÜM kullanıcılara göndermek istediğinize emin misiniz?")) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await sendBroadcastNotification(message);
            if (result.success) {
                toast.success(`Bildirim ${result.count} kullanıcıya gönderildi.`);
                setMessage("");
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Beklenmedik bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Toplu Bildirim Gönder (Broadcast)</CardTitle>
                <CardDescription>
                    Tüm kayıtlı kullanıcılara bildirim gönderir. Bu işlem geri alınamaz.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Dikkat</AlertTitle>
                    <AlertDescription>
                        Bu özellik tüm kullanıcılara bildirim gönderir. Lütfen gereksiz yere kullanmayın.
                    </AlertDescription>
                </Alert>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                        Bildirim Mesajı
                    </label>
                    <Textarea
                        id="message"
                        placeholder="Kullanıcılara göndermek istediğiniz mesajı yazın..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                    />
                </div>

                <Button
                    onClick={handleSend}
                    disabled={isLoading || !message.trim()}
                    className="w-full sm:w-auto"
                >
                    {isLoading ? (
                        "Gönderiliyor..."
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Herkese Gönder
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
