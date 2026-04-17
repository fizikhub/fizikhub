import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Zaman Tüneli | Fizikhub',
    robots: {
        index: false,
        follow: false,
    },
};

export default function ProfilLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
