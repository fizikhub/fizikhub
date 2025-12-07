import { MessageSquareDashed } from "lucide-react";
import { Button } from "../ui/button";

export function EmptyState() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                <MessageSquareDashed className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Mesajınız Seçilmedi</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
                Sol taraftaki listeden bir konuşma seçin veya yeni bir kişiyle sohbet başlatın.
            </p>
        </div>
    );
}
