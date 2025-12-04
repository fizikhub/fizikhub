"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, MessageCircle, Star, Award } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Notification {
    id: number;
    type: string;
    content: string;
    is_read: boolean;
    created_at: string;
    resource_id: string;
    resource_type: string;
}

export function NotificationsList({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    // Fix: Initialize supabase client once
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('recipient_id', userId)
                .order('created_at', { ascending: false });

            if (data) {
                setNotifications(data);
            }
            setLoading(false);
        };

        fetchNotifications();

        // Subscribe to new notifications
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${userId}`
                },
                (payload) => {
                    setNotifications(prev => [payload.new as Notification, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'new_answer':
            case 'new_comment_reply':
            case 'reply':
            case 'comment':
                return <MessageCircle className="h-5 w-5 text-blue-500" />;
            case 'badge_earned':
                return <Award className="h-5 w-5 text-yellow-500" />;
            case 'new_vote':
            case 'like':
                return <Star className="h-5 w-5 text-orange-500" />;
            case 'report':
                return <Bell className="h-5 w-5 text-red-500" />;
            default:
                return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    const getNotificationLink = (notification: Notification) => {
        switch (notification.type) {
            case 'follow':
                // We might need actor username here, but if we don't have it joined, we can link to profile root or handle it.
                // For now, let's assume resource_id might be the username or id.
                // If resource_type is profile, resource_id is likely the user id.
                // Without a join, we can't easily get the username. 
                // Let's fallback to /profil for now or if resource_id is username.
                return `/profil`;
            case 'like':
            case 'comment':
            case 'reply':
            case 'new_answer':
            case 'new_comment_reply':
            case 'new_vote':
                if (notification.resource_type === 'question') return `/forum/${notification.resource_id}`;
                if (notification.resource_type === 'article') return `/blog/${notification.resource_id}`;
                return '#';
            case 'welcome':
                return '/profil';
            case 'report':
                return '/admin?tab=reports';
            default:
                return '#';
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-muted-foreground">Bildirimler yükleniyor...</div>;
    }

    if (notifications.length === 0) {
        return (
            <div className="text-center py-12 border rounded-xl bg-muted/10 border-dashed">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
                <p className="text-muted-foreground">Henüz bildiriminiz yok.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notifications.map((notification) => (
                <Link href={getNotificationLink(notification)} key={notification.id} className="block">
                    <Card className={cn(
                        "transition-colors hover:bg-muted/50",
                        !notification.is_read && "bg-primary/5 border-primary/20"
                    )}>
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="mt-1 bg-background p-2 rounded-full border shadow-sm">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium leading-none mb-1.5">
                                    {notification.content}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: tr })}
                                </p>
                            </div>
                            {!notification.is_read && (
                                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                            )}
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
