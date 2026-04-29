import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Şifre Sıfırla | Fizikhub",
    description: "Fizikhub hesabın için yeni şifre belirle.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function ResetPasswordLayout({ children }: { children: ReactNode }) {
    return children;
}
