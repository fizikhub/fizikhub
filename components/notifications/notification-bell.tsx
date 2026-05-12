"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';
import { m as motion } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "@/app/notifications/actions";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export function NotificationBell({ className }: { className?: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // Fix: Initialize supabase client once
    const [supabase] = useState(() => createClient());
    const router = useRouter();

    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            if (process.env.NODE_ENV === 'development') {
                // console.log('[NotificationBell] Fetching notifications...');
            }

            const [data, count] = await Promise.all([
                getNotifications(),
                getUnreadCount()
            ]);

            if (process.env.NODE_ENV === 'development') {
                // console.log('[NotificationBell] Fetched:', { notificationCount: data?.length || 0, unreadCount: count });
            }

            const notificationData = (data || []) as unknown as Notification[];
            setNotifications(notificationData);
            setUnreadCount(count);

            // Check for special admin notification
            const hasAdminNotification = notificationData.some((n) =>
                !n.is_read && n.content === "hazreti yüce müce admin soruna cevap verdi"
            );

            if (hasAdminNotification) {
                confetti({ particleCount: 200, spread: 120, origin: { y: 0.3 } });
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('[NotificationBell] Error fetching notifications:', error);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        fetchNotifications();

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!active || !user) {
                return null;
            }

            return supabase
                .channel('notifications-bell')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `recipient_id=eq.${user.id}`,
                    },
                    () => {
                        if (process.env.NODE_ENV === 'development') {
                            // console.log('[NotificationBell] New notification received:', payload);
                        }
                        setUnreadCount(prev => prev + 1);
                        fetchNotifications();
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'notifications',
                        filter: `recipient_id=eq.${user.id}`,
                    },
                    () => {
                        if (process.env.NODE_ENV === 'development') {
                            // console.log('[NotificationBell] Notification updated:', payload);
                        }
                        fetchNotifications();
                    }
                )
                .subscribe();
        };

        let channel: ReturnType<typeof supabase.channel> | null = null;
        setupRealtime().then((createdChannel) => {
            channel = createdChannel;
        });

        return () => {
            active = false;
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [fetchNotifications, supabase]);

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
                if (notification.resource_type === 'question') return `/forum/${notification.resource_id}`;
                if (notification.resource_type === 'article') return `/makale/${notification.resource_id}`; // Assuming slug or id
                return '#';
            case 'welcome':
                if (notification.resource_type === 'system') return '#';
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
                if (notification.resource_type === 'system') {
                    return <span className="font-medium text-primary">{notification.content}</span>;
                }
                return "FizikHub'a hoş geldin! 🚀";
            case 'report':
                return <><span className="font-semibold">{name}</span> bir içerik bildirdi.</>;
            default:
                if (notification.content === "hazreti yüce müce admin soruna cevap verdi") {
                    return <span className="font-bold text-amber-500 animate-pulse">🚀 {notification.content} 🚀</span>;
                }
                return notification.content;
        }
    };

    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("relative rounded-xl h-10 w-10 hover:bg-primary/10 transition-all duration-300 group overflow-hidden", className)}
                        suppressHydrationWarning
                    >
                        {/* Glow effect behind the bell */}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />

                        <motion.div
                            animate={unreadCount > 0 ? {
                                rotate: [0, -15, 15, -15, 15, 0],
                                scale: [1, 1.1, 1],
                            } : {}}
                            transition={{ duration: 0.6, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
                        >
                            <Bell className="h-5 w-5" />
                        </motion.div>

                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-[1.5px] border-background shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-80 sm:w-96 max-h-[500px] overflow-y-auto glass-panel border-white/10 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl p-0"
                >
                    <div className="flex items-center justify-between px-4 py-3 bg-black/5 dark:bg-white/5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm tracking-wide">BİLDİRİMLER</span>
                            {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-bold border border-primary/30">
                                    {unreadCount} YENİ
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                onClick={handleMarkAllRead}
                            >
                                TÜMÜNÜ OKU
                            </Button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="py-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-3">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                            <span className="animate-pulse">Uzaydan veri çekiliyor...</span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-3">
                            <Bell className="h-8 w-8 opacity-20" />
                            <span>Hiç bildiriminiz yok.</span>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        "flex items-start gap-4 p-4 cursor-pointer border-b border-white/5 focus:bg-white/5 transition-all duration-200 group relative overflow-hidden",
                                        !notification.is_read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-white/5"
                                    )}
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={() => {
                                        handleMarkAsRead(notification.id);
                                        router.push(getNotificationLink(notification));
                                        setIsOpen(false);
                                    }}
                                >
                                    {!notification.is_read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    )}

                                    <div className="relative mt-1 shrink-0">
                                        <div className={cn(
                                            "rounded-full p-[1px] transition-all duration-300",
                                            !notification.is_read ? "bg-gradient-to-br from-primary to-transparent" : "bg-border"
                                        )}>
                                            <Avatar className="h-9 w-9 border-2 border-background">
                                                <AvatarImage src={notification.actor?.avatar_url || ""} />
                                                <AvatarFallback>{notification.actor?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-1.5 z-10">
                                        <p className="text-sm leading-snug text-foreground/90 group-hover:text-foreground transition-colors">
                                            {getNotificationText(notification)}
                                        </p>
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: tr })}
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu >
        </>
    );
}
