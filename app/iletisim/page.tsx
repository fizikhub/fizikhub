import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { ContactPageClient } from "./contact-client";

export const metadata: Metadata = {
    title: "İletişim | Fizikhub",
    description: "Fizikhub ekibiyle iletişime geçin. Soru, görüş ve önerileriniz için bize ulaşın.",
    openGraph: {
        title: "İletişim — Fizikhub",
        description: "Fizikhub ekibiyle iletişime geçin. Soru, görüş ve önerileriniz için bize ulaşın.",
        type: "website",
        url: "https://fizikhub.com/iletisim",
    },
    alternates: { canonical: "https://fizikhub.com/iletisim" },
};

export default function ContactPage() {
    return (
        <>
            <BreadcrumbJsonLd items={[{ name: 'İletişim', href: '/iletisim' }]} />
            <ContactPageClient />
        </>
    );
}
