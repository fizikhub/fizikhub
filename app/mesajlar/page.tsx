import { EmptyState } from "@/components/messaging/empty-state";
import { ChatWindow } from "@/components/messaging/chat-window";

export default function MessagesPage({ searchParams }: { searchParams: { c?: string } }) {
    if (searchParams.c) {
        return <ChatWindow conversationId={searchParams.c} />;
    }

    return (
        <div className="hidden h-full w-full items-center justify-center md:flex">
            <EmptyState />
        </div>
    );
}
