import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StaticPageJsonLd, buildStaticPageMetadata } from "@/lib/static-page-seo";

const description = "Fizikhub KVKK ve gizlilik açıklaması: kişisel verilerin hangi amaçlarla işlendiği, güvenlik önlemleri ve kullanıcı hakları.";

export const metadata: Metadata = buildStaticPageMetadata({
    path: "/kvkk",
    title: "KVKK ve Gizlilik",
    description,
    keywords: ["Fizikhub KVKK", "kişisel veriler", "gizlilik", "veri güvenliği", "kullanıcı hakları"],
});

export default function KvkkLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <StaticPageJsonLd
                path="/kvkk"
                name="Fizikhub KVKK ve Gizlilik"
                description={description}
                breadcrumbName="KVKK"
                type="WebPage"
                mainEntity={{
                    "@type": "CreativeWork",
                    name: "Fizikhub kişisel veri bilgilendirmesi",
                    about: ["kişisel veriler", "veri güvenliği", "kullanıcı hakları"],
                    inLanguage: "tr-TR",
                }}
            />
            {children}
        </>
    );
}
