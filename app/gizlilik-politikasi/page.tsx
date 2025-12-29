import { Metadata } from "next";
import { ShieldCheck, Lock, Eye, Cookie, Server, Scale } from "lucide-react";

export const metadata: Metadata = {
    title: "Gizlilik Politikası (Ciddili) | Fizikhub",
    description: "Verileriniz bizimle güvende. Cidden.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container max-w-4xl py-12 px-4 md:px-6">
            <div className="space-y-4 text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full mb-4 ring-1 ring-emerald-500/20">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                    Gizlilik Manifestosu
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Verileriniz bizim için Schrödinger'in kedisi gibidir: Kutuyu açıp bakmayız, orada olduklarını biliriz ama onları rahatsız etmeyiz.
                </p>
            </div>

            <div className="grid gap-8 md:gap-12">
                {/* 1. Veri Toplama */}
                <section className="space-y-4 bg-muted/30 p-6 md:p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Eye className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold">1. Hangi Verileri Neden Topluyoruz?</h2>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                        <p>
                            Fizikhub olarak, "büyük veri" (big data) toplama gibi bir derdimiz yok. Ancak sitenin çalışması için bazı temel bilgilere ihtiyacımız var:
                        </p>
                        <ul className="grid gap-2 mt-4 list-none pl-0">
                            <li className="flex gap-2">
                                <span className="bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded text-sm h-fit">E-posta & Kullanıcı Adı</span>
                                <span>Sizi diğer fizikseverlerden ayırt etmek ve "Hoş geldin şampiyon" diyebilmek için. Ayrıca şifrenizi unutursanız kurtarmanız için şart.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-purple-500/10 text-purple-400 font-mono px-2 py-0.5 rounded text-sm h-fit">Profil Bilgileri</span>
                                <span>Avatarınız, bionuz ve sosyal medya linkleriniz. Tamamen sizin kontrolünüzde, hava atmanız için var.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-orange-500/10 text-orange-400 font-mono px-2 py-0.5 rounded text-sm h-fit">İçerik Etkileşimleri</span>
                                <span>Hangi makaleyi beğendiğiniz, hangi soruya cevap verdiğiniz. Bunu size özel puanlar ve rozetler vermek için tutuyoruz.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-red-500/10 text-red-400 font-mono px-2 py-0.5 rounded text-sm h-fit">IP Adresi</span>
                                <span>Sadece güvenlik duvarımız (Rate Limiting) kötü niyetli botları engellemek için geçici olarak işler.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* 2. Çerezler (Cookies) */}
                <section className="space-y-4 bg-muted/30 p-6 md:p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Cookie className="w-6 h-6 text-amber-500" />
                        <h2 className="text-2xl font-bold">2. Çerezler (Ama yenmeyen cinsten)</h2>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl mb-4 text-amber-200">
                            <strong>Özetle:</strong> Verinizde gözümüz yok. Çerezleri sizi takip edip size airfryer reklamı göstermek için DEĞİL, sadece giriş yapıp yapmadığınızı hatırlamak için kullanıyoruz.
                        </div>
                        <p>
                            Sitemizde sadece <strong>Zorunlu Çerezler (Essential Cookies)</strong> kullanılmaktadır:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong className="text-foreground">Oturum Çerezleri:</strong> Sayfalar arası geçiş yaparken "Bu kimdi ya?" dememek ve sizi sistemden atmamak için.
                            </li>
                            <li>
                                <strong className="text-foreground">Güvenlik Çerezleri:</strong> CSRF (Cross-Site Request Forgery) gibi havalı isimli ama kötü niyetli saldırılardan sizi korumak için.
                            </li>
                            <li>
                                <strong className="text-foreground">Tercih Çerezleri:</strong> Karanlık mod/aydınlık mod tercihinizi hatırlamak için (Gözleriniz bizim için önemli).
                            </li>
                        </ul>
                        <p className="mt-4 text-sm opacity-70">
                            Not: Üçüncü taraf reklam çerezleri kullanmıyoruz çünkü sitemizde reklam yok. Evet, vizyon.
                        </p>
                    </div>
                </section>

                {/* 3. Teknik Güvenlik */}
                <section className="space-y-4 bg-muted/30 p-6 md:p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="w-6 h-6 text-red-500" />
                        <h2 className="text-2xl font-bold">3. Verileriniz Ne Kadar Güvende?</h2>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                        <p>
                            Sitenin güvenliğini sağlamak için paranoyak düzeyde önlemler aldık. İşte kaputun altındaki teknik detaylar:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                <h4 className="flex items-center gap-2 font-bold text-foreground mb-2">
                                    <Server className="w-4 h-4 text-green-400" /> Supabase Altyapısı
                                </h4>
                                <p className="text-sm">Veritabanımız Enterprise-grade güvenliğe sahip Supabase üzerinde barınıyor. Doğrudan veritabanına erişim kapalı.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                <h4 className="flex items-center gap-2 font-bold text-foreground mb-2">
                                    <ShieldCheck className="w-4 h-4 text-green-400" /> RLS (Row Level Security)
                                </h4>
                                <p className="text-sm">PostgreSQL seviyesinde güvenlik. Kimse başkasının verisini sorgulayamaz, istese bile veritabanı "Hop kardeşim" der.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                <h4 className="flex items-center gap-2 font-bold text-foreground mb-2">
                                    <Lock className="w-4 h-4 text-green-400" /> Şifreleme
                                </h4>
                                <p className="text-sm">Şifreleriniz asla "123456" gibi açık halde saklanmaz. Bcrypt algoritması ile tuzlanarak (salted) ve hashlenerek saklanır.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                <h4 className="flex items-center gap-2 font-bold text-foreground mb-2">
                                    <ShieldCheck className="w-4 h-4 text-green-400" /> SSL/TLS & HSTS
                                </h4>
                                <p className="text-sm">Tüm veri trafiği 256-bit SSL şifreleme ile korunur. Tarayıcınız ve sunucumuz arasında kimse araya giremez.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center pt-8 border-t border-white/10">
                    <p className="text-muted-foreground italic">
                        "Bilim gerçeğin şiiridir, biz de verilerinizin bekçisiyiz." <br />
                        <span className="text-sm not-italic mt-2 block opacity-50">- Fizikhub Ekibi (Muhtemelen)</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-4 opacity-40">
                        Not: Bu metin bilgilendirme amaçlıdır, hukuki tavsiye niteliği taşımaz. Ama elimizden gelenin en iyisini yaptık.
                    </p>
                </div>
            </div>
        </div>
    );
}
