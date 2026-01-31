"use client";

import dynamic from "next/dynamic";

const NotesPage = dynamic(
    () => import("@/components/notes/notes-page").then((mod) => mod.NotesPage),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        ),
    }
);

export function NotesPageWrapper() {
    return <NotesPage />;
}
