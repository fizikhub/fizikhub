import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kullanım Şartları | Fizikhub",
    description: "Fizikhub kullanım şartları.",
};

export default function TermsOfUsePage() {
    return (
        <div className="container max-w-4xl py-10">
            <h1 className="mb-6 text-3xl font-bold">Kullanım Şartları</h1>
            <div className="prose dark:prose-invert">
                <p>Son güncelleme: 28 Kasım 2025</p>
                <p>
                    Fizikhub'ı kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
                </p>
                <h3>İçerik Kullanımı</h3>
                <p>
                    Sitedeki içerikler bilgilendirme amaçlıdır. İzinsiz kopyalanması ve ticari amaçla
                    kullanılması yasaktır. "İzinsiz alıntı yapanı kara deliğe atarız" şakamız bir yana,
                    emek hırsızlığına karşıyız.
                </p>
                <h3>Kullanıcı Davranışları</h3>
                <p>
                    Forum ve yorum alanlarında saygılı bir dil kullanılması zorunludur. Hakaret,
                    nefret söylemi ve yasa dışı içerik paylaşımı yasaktır.
                </p>
                {/* Buraya daha detaylı yasal metin eklenebilir */}
            </div>
        </div>
    );
}
