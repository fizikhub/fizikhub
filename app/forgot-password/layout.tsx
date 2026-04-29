import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Şifremi Unuttum | Fizikhub",
    description: "Fizikhub hesabın için şifre sıfırlama bağlantısı iste.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
    return children;
}
