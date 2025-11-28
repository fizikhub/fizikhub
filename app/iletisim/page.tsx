import { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "İletişim | Fizikhub",
    description: "Bizimle iletişime geçin.",
};

export default function ContactPage() {
    return (
        <div className="container max-w-4xl py-10">
            <h1 className="mb-6 text-3xl font-bold">İletişim</h1>
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <p className="mb-4 text-muted-foreground">
                        Her türlü soru, görüş ve öneriniz için bizimle iletişime geçebilirsiniz.
                        Size en kısa sürede dönüş yapmaya çalışacağız.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-primary" />
                            <a href="mailto:iletisim@fizikhub.com" className="hover:underline">iletisim@fizikhub.com</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-primary" />
                            <span>İstanbul, Türkiye</span>
                        </div>
                    </div>
                </div>
                {/* Buraya ileride bir iletişim formu eklenebilir */}
            </div>
        </div>
    );
}
