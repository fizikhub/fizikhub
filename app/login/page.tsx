import { ModernLogin } from "@/components/auth/modern-login";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Giriş Yap | Fizikhub",
    description: "Fizikhub hesabına giriş yap.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function LoginPage() {
    return <ModernLogin />;
}
