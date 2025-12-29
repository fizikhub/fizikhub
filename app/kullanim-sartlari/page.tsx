import { Metadata } from "next";
import { ShieldCheck, ScrollText, Users, AlertTriangle, Gavel } from "lucide-react";

export const metadata: Metadata = {
    title: "Kullanım Şartları (Veya: Birbirimizi Kırmayalım) | Fizikhub",
    description: "Kurallar sıkıcı olabilir ama kaos daha kötüdür.",
};

export default function TermsOfUsePage() {
    return (
        <div className="container max-w-4xl py-12 px-4 md:px-6">
            <div className="space-y-4 text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-4 ring-1 ring-purple-500/20">
                    <Gavel className="w-10 h-10 text-purple-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                    Kullanım Anayasası
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Fizikhub'a hoş geldiniz. Burası bir bilim arenasıdır, gladyatör dövüş alanı değil. Lütfen kılıçlarınızı kapıda bırakınız.
                </p>
            </div>

            <div className="grid gap-8 md:gap-12">
                {/* 1. Telif Hakları */}
                <section className="space-y-4 bg-muted/30 p-6 md:p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <ScrollText className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold">1. İçerik ve Telif Hakkı (Copy-Paste Yasası)</h2>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                        <p>
                            Fizikhub üzerinde paylaşılan içerikler, kullanıcılarımızın göz nurudur.
                        </p>
                        <ul className="grid gap-2 mt-4 list-none pl-0">
                            <li className="p-3 bg-black/20 rounded-lg border border-white/5">
                                <strong className="text-foreground block mb-1">Paylaşın, Çoğaltın:</strong> Bilgi paylaştıkça çoğalır. İçeriklerimizi kaynak göstererek paylaşabilirsiniz.
                            </li>
                            <li className="p-3 bg-black/20 rounded-lg border border-white/5">
                                <strong className="text-foreground block mb-1">Kaynak Gösterin:</strong> "Ctrl+C / Ctrl+V" yapıp kaynak göstermemek, akademik dünyada büyük bir günahtır. Fizikhub'da da öyledir.
                            </li>
                            <li className="p-3 bg-black/20 rounded-lg border border-white/5">
                                <strong className="text-foreground block mb-1">İzinsiz Alıntı:</strong> İzinsiz ve kaynak göstermeden içerik kopyalayanları, kara delik simülasyonuna hapsetme hakkımızı saklı tutuyoruz. (Şaka. Ama yasal işlem başlatabiliriz.)
                            </li>
                        </ul>
                    </div>
                </section>

                {/* 2. Topluluk Kuralları */}
                <section className="space-y-4 bg-muted/30 p-6 md:p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6 text-emerald-500" />
                        <h2 className="text-2xl font-bold">2. Topluluk Kuralları (Newton'un Nezaket Yasası)</h2>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                        <p>
                            Etki-tepki prensibi gereği, siz nazik olursanız başkaları da size nazik olur.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Saygı:</strong> Forum ve yorumlarda hakaret, nefret söylemi ve trollük yasaktır. Burası Instagram yorumları değil.</li>
                            <li><strong>Spam:</strong> Sürekli aynı şeyi yazmak entropiyi arttırır ve biz düzeni severiz. Spam yapmayın.</li>
                            <li><strong>Yasa Dışı İçerik:</strong> Türkiye Cumhuriyeti yasalarına aykırı hiçbir içerik paylaşılamaz. Schrödinger'in kedisi bile yasalara uymak zorundadır.</li>
                        </ul>
                    </div>
                </section>

                {/* 3. Sorumluluk Reddi */}
                <section className="space-y-4 bg-muted/30 p-6 md:p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                        <h2 className="text-2xl font-bold">3. Sorumluluk Reddi (Laboratuvar Kazaları)</h2>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                        <p>
                            Sitedeki bilgiler eğitim ve eğlence amaçlıdır.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Burada okuduğunuz bir deneyi evde denerken evi yakarsanız, sorumluluk kabul etmeyiz.</li>
                            <li>Yazarların şahsi görüşleri Fizikhub'ı bağlamaz, herkes kendi tezinden sorumludur.</li>
                            <li>Site "uptime" süresini %99.9 tutmaya çalışıyoruz ama bazen Murphy Kanunları devreye girebilir.</li>
                        </ul>
                    </div>
                </section>

                {/* 4. Hesap Güvenliği */}
                <section className="space-y-4 bg-muted/30 p-6 md:p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-6 h-6 text-red-500" />
                        <h2 className="text-2xl font-bold">4. Hesap Güvenliği</h2>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                        <p>
                            Hesabınızın güvenliği işbirliği gerektirir.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Şifrenizi "123456" veya "password" yaparsanız, hacklenmeniz an meselesidir.</li>
                            <li>Hesabınızı başkasıyla paylaşmayın. Kuantum dolanıklık hesaplar için geçerli değildir.</li>
                            <li>Şüpheli bir durum sezerseniz hemen bizimle iletişime geçin.</li>
                        </ul>
                    </div>
                </section>

                <div className="text-center pt-8 border-t border-white/10">
                    <p className="text-muted-foreground text-sm">
                        * Bu kuralları kabul ederek Fizikhub evrenine giriş yapmış sayılırsınız. İyi eğlenceler!
                    </p>
                </div>
            </div>
        </div>
    );
}
