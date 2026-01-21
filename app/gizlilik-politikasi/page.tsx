import { Metadata } from "next";
import { ShieldCheck, Lock, Eye, Cookie, Server } from "lucide-react";
import { PolicyPageLayout, PolicySection } from "@/components/layout/policy-page-layout";

export const metadata: Metadata = {
    title: "Gizlilik Politikası (Ciddili) | Fizikhub",
    description: "Verileriniz bizimle güvende. Cidden.",
};

export default function PrivacyPolicyPage() {
    return (
        <PolicyPageLayout
            title="Gizlilik Manifestosu"
            subtitle="Verileriniz bizim için Schrödinger'in kedisi gibidir: Kutuyu açıp bakmayız, orada olduklarını biliriz ama onları rahatsız etmeyiz."
            icon={<ShieldCheck />}
            themeColor="emerald"
        >
            {/* 1. Veri Toplama */}
            <PolicySection
                number="01"
                title="Hangi Verileri Neden Topluyoruz?"
                icon={<Eye className="w-6 h-6" />}
            >
                <p>
                    Fizikhub olarak, "büyük veri" (big data) toplama gibi bir derdimiz yok. Ancak sitenin çalışması için bazı temel bilgilere ihtiyacımız var:
                </p>
                <div className="grid gap-3 mt-4">
                    <div className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="bg-blue-500/20 text-blue-300 font-mono text-xs px-2 py-1 rounded border border-blue-500/20 whitespace-nowrap">E-posta & Kullanıcı Adı</span>
                        <span className="text-sm">Sizi diğer fizikseverlerden ayırt etmek ve "Hoş geldin şampiyon" diyebilmek için. Ayrıca şifrenizi unutursanız kurtarmanız için şart.</span>
                    </div>
                    <div className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="bg-purple-500/20 text-purple-300 font-mono text-xs px-2 py-1 rounded border border-purple-500/20 whitespace-nowrap">Profil Bilgileri</span>
                        <span className="text-sm">Avatarınız, bionuz ve sosyal medya linkleriniz. Tamamen sizin kontrolünüzde, hava atmanız için var.</span>
                    </div>
                    <div className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="bg-orange-500/20 text-orange-300 font-mono text-xs px-2 py-1 rounded border border-orange-500/20 whitespace-nowrap">İçerik Etkileşimleri</span>
                        <span className="text-sm">Hangi makaleyi beğendiğiniz, hangi soruya cevap verdiğiniz. Bunu size özel puanlar ve rozetler vermek için tutuyoruz.</span>
                    </div>
                </div>
            </PolicySection>

            {/* 2. Çerezler (Cookies) */}
            <PolicySection
                number="02"
                title="Çerezler (Ama yenmeyen cinsten)"
                icon={<Cookie className="w-6 h-6" />}
            >
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl mb-4 text-amber-200">
                    <strong>Özetle:</strong> Verinizde gözümüz yok. Çerezleri sizi takip edip size airfryer reklamı göstermek için DEĞİL, sadece giriş yapıp yapmadığınızı hatırlamak için kullanıyoruz.
                </div>
                <p>
                    Sitemizde sadece <strong>Zorunlu Çerezler (Essential Cookies)</strong> kullanılmaktadır:
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
                    <li>
                        <strong className="text-white">Oturum Çerezleri:</strong> Sayfalar arası geçiş yaparken "Bu kimdi ya?" dememek ve sizi sistemden atmamak için.
                    </li>
                    <li>
                        <strong className="text-white">Güvenlik Çerezleri:</strong> CSRF (Cross-Site Request Forgery) gibi havalı isimli ama kötü niyetli saldırılardan sizi korumak için.
                    </li>
                    <li>
                        <strong className="text-white">Tercih Çerezleri:</strong> Karanlık mod/aydınlık mod tercihinizi hatırlamak için (Gözleriniz bizim için önemli).
                    </li>
                </ul>
                <p className="mt-4 text-sm opacity-60 italic">
                    Not: Üçüncü taraf reklam çerezleri kullanmıyoruz çünkü sitemizde reklam yok. Evet, vizyon.
                </p>
            </PolicySection>

            {/* 3. Teknik Güvenlik */}
            <PolicySection
                number="03"
                title="Verileriniz Ne Kadar Güvende?"
                icon={<Lock className="w-6 h-6" />}
            >
                <p>
                    Sitenin güvenliğini sağlamak için paranoyak düzeyde önlemler aldık. İşte kaputun altındaki teknik detaylar:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                        <h4 className="flex items-center gap-2 font-bold text-white mb-2 text-sm uppercase tracking-wider">
                            <Server className="w-4 h-4 text-emerald-400" /> Supabase Altyapısı
                        </h4>
                        <p className="text-xs text-zinc-400">Veritabanımız Enterprise-grade güvenliğe sahip Supabase üzerinde barınıyor. Doğrudan veritabanına erişim kapalı.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                        <h4 className="flex items-center gap-2 font-bold text-white mb-2 text-sm uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> RLS (Row Level Security)
                        </h4>
                        <p className="text-xs text-zinc-400">PostgreSQL seviyesinde güvenlik. Kimse başkasının verisini sorgulayamaz, istese bile veritabanı "Hop kardeşim" der.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                        <h4 className="flex items-center gap-2 font-bold text-white mb-2 text-sm uppercase tracking-wider">
                            <Lock className="w-4 h-4 text-emerald-400" /> Şifreleme
                        </h4>
                        <p className="text-xs text-zinc-400">Şifreleriniz asla "123456" gibi açık halde saklanmaz. Bcrypt algoritması ile tuzlanarak (salted) ve hashlenerek saklanır.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                        <h4 className="flex items-center gap-2 font-bold text-white mb-2 text-sm uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> SSL/TLS & HSTS
                        </h4>
                        <p className="text-xs text-zinc-400">Tüm veri trafiği 256-bit SSL şifreleme ile korunur. Tarayıcınız ve sunucumuz arasında kimse araya giremez.</p>
                    </div>
                </div>
            </PolicySection>

            {/* Footer Quote */}
            <div className="text-center pt-8 border-t border-white/5">
                <p className="text-zinc-400 italic text-lg font-light">
                    "Bilim gerçeğin şiiridir, biz de verilerinizin bekçisiyiz." <br />
                    <span className="text-sm not-italic mt-2 block opacity-50 font-mono text-emerald-400">- Fizikhub Ekibi (Muhtemelen)</span>
                </p>
                <p className="text-[10px] text-zinc-600 mt-6 uppercase tracking-widest opacity-60">
                    Not: Bu metin bilgilendirme amaçlıdır, hukuki tavsiye niteliği taşımaz. Ama elimizden gelenin en iyisini yaptık.
                </p>
            </div>
        </PolicyPageLayout>
    );
}
