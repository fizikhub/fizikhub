import { MessagingLayoutWrapper } from "@/components/messaging/layout-wrapper";
import { getConversations } from "./actions";

export default async function MessagingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch initial conversations on the server
    const conversations = await getConversations();

    return (
        <div className="h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
            <MessagingLayoutWrapper initialConversations={conversations}>
                {children}
            </MessagingLayoutWrapper>
        </div>
    );
}
