import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Parolayı Sıfırla | Fizikhub',
    robots: {
        index: false,
        follow: false,
    },
};

export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
