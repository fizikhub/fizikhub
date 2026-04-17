import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Yazar Paneli | Fizikhub',
    robots: {
        index: false,
        follow: false,
    },
};

export default function YazarPaneliLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
