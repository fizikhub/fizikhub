import { Metadata } from "next";
import { ShieldCheck, ScrollText, Users, AlertTriangle, Gavel } from "lucide-react";
import { PolicyPageLayout, PolicySection } from "@/components/layout/policy-page-layout";

export const metadata: Metadata = {
    title: "Kullanım Şartları (Veya: Birbirimizi Kırmayalım) | Fizikhub",
    description: "Kurallar sıkıcı olabilir ama kaos daha kötüdür.",
};

export default function TermsOfUsePage() {
    return (
        <PolicyPageLayout
            title="Kullanım Anayasası"
            subtitle="Fizikhub'a hoş geldiniz. Burası bir bilim arenasıdır, gladyatör dövüş alanı değil. Lütfen kılıçlarınızı kapıda bırakınız."
            icon={<Gavel />}
            themeColor="purple"
        >
            {/* 1. Telif Hakları */}
            <PolicySection
                number="01"
                title="İçerik ve Telif Hakkı (Copy-Paste Yasası)"
                icon={<ScrollText className="w-6 h-6" />}
            >
                <p>
                    Fizikhub üzerinde paylaşılan içerikler, kullanıcılarımızın göz nurudur.
                </p>
                <div className="grid gap-4 mt-6">
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group/item">
                        <strong className="text-white block mb-2 text-sm uppercase tracking-wide group-hover/item:text-purple-300 transition-colors">Paylaşın, Çoğaltın:</strong>
                        <span className="text-sm opacity-80">Bilgi paylaştıkça çoğalır. İçeriklerimizi kaynak göstererek paylaşabilirsiniz.</span>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group/item">
                        <strong className="text-white block mb-2 text-sm uppercase tracking-wide group-hover/item:text-purple-300 transition-colors">Kaynak Gösterin:</strong>
                        <span className="text-sm opacity-80">"Ctrl+C / Ctrl+V" yapıp kaynak göstermemek, akademik dünyada büyük bir günahtır. Fizikhub'da da öyledir.</span>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group/item">
                        <strong className="text-white block mb-2 text-sm uppercase tracking-wide group-hover/item:text-purple-300 transition-colors">İzinsiz Alıntı:</strong>
                        <span className="text-sm opacity-80">İzinsiz ve kaynak göstermeden içerik kopyalayanları, kara delik simülasyonuna hapsetme hakkımızı saklı tutuyoruz. (Şaka. Ama yasal işlem başlatabiliriz.)</span>
                    </div>
                </div>
            </PolicySection>

            {/* 2. Topluluk Kuralları */}
            <PolicySection
                number="02"
                title="Topluluk Kuralları (Newton'un Nezaket Yasası)"
                icon={<Users className="w-6 h-6" />}
            >
                <p>
                    Etki-tepki prensibi gereği, siz nazik olursanız başkaları da size nazik olur.
                </p>
                <ul className="grid gap-3 mt-4 list-none">
                    <li className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                        <span className="text-sm"><strong className="text-white">Saygı:</strong> Hakaret, nefret söylemi ve trollük yasaktır. Burası Instagram yorumları değil.</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                        <span className="text-sm"><strong className="text-white">Spam:</strong> Sürekli aynı şeyi yazmak entropiyi arttırır ve biz düzeni severiz. Spam yapmayın.</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                        <span className="text-sm"><strong className="text-white">Yasal Uyumluluk:</strong> Türkiye Cumhuriyeti yasalarına aykırı hiçbir içerik paylaşılamaz. Schrödinger'in kedisi bile yasalara uymak zorundadır.</span>
                    </li>
                </ul>
            </PolicySection>

            {/* 3. Sorumluluk Reddi */}
            <PolicySection
                number="03"
                title="Sorumluluk Reddi (Laboratuvar Kazaları)"
                icon={<AlertTriangle className="w-6 h-6" />}
            >
                <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-xl text-orange-200/90 text-sm leading-relaxed">
                    <p className="mb-4">Sitedeki bilgiler eğitim ve eğlence amaçlıdır.</p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-orange-500">
                        <li>Burada okuduğunuz bir deneyi evde denerken evi yakarsanız, sorumluluk kabul etmeyiz.</li>
                        <li>Yazarların şahsi görüşleri Fizikhub'ı bağlamaz, herkes kendi tezinden sorumludur.</li>
                        <li>Site "uptime" süresini %99.9 tutmaya çalışıyoruz ama bazen Murphy Kanunları devreye girebilir.</li>
                    </ul>
                </div>
            </PolicySection>

            {/* 4. Hesap Güvenliği */}
            <PolicySection
                number="04"
                title="Hesap Güvenliği"
                icon={<ShieldCheck className="w-6 h-6" />}
            >
                <p>
                    Hesabınızın güvenliği işbirliği gerektirir.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-purple-500 text-sm">
                    <li>Şifrenizi "123456" veya "password" yaparsanız, hacklenmeniz an meselesidir.</li>
                    <li>Hesabınızı başkasıyla paylaşmayın. Kuantum dolanıklık hesaplar için geçerli değildir.</li>
                    <li>Şüpheli bir durum sezerseniz hemen bizimle iletişime geçin.</li>
                </ul>
            </PolicySection>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-white/5">
                <p className="text-zinc-500 text-xs tracking-widest uppercase">
                    * Bu kuralları kabul ederek Fizikhub evrenine giriş yapmış sayılırsınız. İyi eğlenceler!
                </p>
            </div>
        </PolicyPageLayout>
    );
}
