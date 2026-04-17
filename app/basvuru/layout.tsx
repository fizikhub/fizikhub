import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Başvuru | Fizikhub',
    robots: {
        index: false,
        follow: false,
    },
};

export default function BasvuruLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
