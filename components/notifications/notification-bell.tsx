"use client";

import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "@/app/notifications/actions";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Notification {
    id: number;
    type: 'like' | 'comment' | 'follow' | 'reply' | 'welcome' | 'report';
    content: string;
    is_read: boolean;
    created_at: string;
    resource_id: string;
    resource_type: string;
    actor: {
        username: string;
        full_name: string | null;
        avatar_url: string | null;
    };
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const fetchNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data as any);
        const count = await getUnreadCount();
        setUnreadCount(count);
    };

    useEffect(() => {
        fetchNotifications();

        const channel = supabase
            .channel('notifications-bell')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                (payload) => {
                    // Only increment if it's for the current user (RLS should handle this but good to be safe if logic changes)
                    // Actually client-side subscription receives all events allowed by RLS.
                    // Since we have RLS "Users can view their own notifications", we should only receive ours.
                    setUnreadCount(prev => prev + 1);
                    fetchNotifications(); // Refresh list to show new item
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleMarkAsRead = async (id: number) => {
        await markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    const getNotificationLink = (notification: Notification) => {
        switch (notification.type) {
            case 'follow':
                return `/kullanici/${notification.actor.username}`;
            case 'like':
            case 'comment':
            case 'reply':
                if (notification.resource_type === 'question') return `/forum/soru/${notification.resource_id}`;
                if (notification.resource_type === 'article') return `/blog/${notification.resource_id}`; // Assuming slug or id
                return '#';
            case 'welcome':
                return '/profil';
            case 'report':
                return '/admin?tab=reports';
            default:
                return '#';
        }
    };

    const getNotificationText = (notification: Notification) => {
        const name = notification.actor.full_name || notification.actor.username;
        switch (notification.type) {
            case 'follow':
                return <><span className="font-semibold">{name}</span> seni takip etmeye başladı.</>;
            case 'like':
                return <><span className="font-semibold">{name}</span> gönderini beğendi.</>;
            case 'comment':
                return <><span className="font-semibold">{name}</span> gönderine yorum yaptı.</>;
            case 'reply':
                return <><span className="font-semibold">{name}</span> yorumuna yanıt verdi.</>;
            case 'welcome':
                return "Fizikhub'a hoş geldin! 🚀";
            case 'report':
                return <><span className="font-semibold">{name}</span> bir içerik bildirdi.</>;
            default:
                return notification.content;
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96 max-h-[500px] overflow-y-auto">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="font-semibold text-sm">Bildirimler</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-0.5 text-xs text-muted-foreground hover:text-primary"
                            onClick={handleMarkAllRead}
                        >
                            Tümünü okundu işaretle
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-sm">
                        Henüz bildirim yok.
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 p-1">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex items-start gap-3 p-3 cursor-pointer focus:bg-muted/50",
                                    !notification.is_read && "bg-primary/5"
                                )}
                                onSelect={(e) => e.preventDefault()}
                            >
                                <div className="relative mt-1">
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarImage src={notification.actor?.avatar_url || ""} />
                                        <AvatarFallback>{notification.actor?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    {!notification.is_read && (
                                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1" onClick={() => {
                                    handleMarkAsRead(notification.id);
                                    router.push(getNotificationLink(notification));
                                    setIsOpen(false);
                                }}>
                                    <p className="text-sm leading-snug">
                                        {getNotificationText(notification)}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: tr })}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
