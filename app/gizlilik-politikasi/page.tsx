import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gizlilik Politikası | Fizikhub",
    description: "Fizikhub gizlilik politikası.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container max-w-4xl py-10">
            <h1 className="mb-6 text-3xl font-bold">Gizlilik Politikası</h1>
            <div className="prose dark:prose-invert">
                <p>Son güncelleme: 28 Kasım 2025</p>
                <p>
                    Fizikhub olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu Gizlilik Politikası,
                    sitemizi kullandığınızda hangi verileri topladığımızı ve nasıl kullandığımızı açıklar.
                </p>
                <h3>Toplanan Veriler</h3>
                <p>
                    Kayıt olduğunuzda adınız, e-posta adresiniz ve profil bilgileriniz toplanabilir.
                    Ayrıca site kullanım istatistikleri için çerezler kullanılabilir.
                </p>
                <h3>Verilerin Kullanımı</h3>
                <p>
                    Toplanan veriler, size daha iyi bir deneyim sunmak, siteyi geliştirmek ve
                    yasal yükümlülükleri yerine getirmek için kullanılır.
                </p>
                {/* Buraya daha detaylı yasal metin eklenebilir */}
            </div>
        </div>
    );
}
