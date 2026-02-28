"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    Message,
    sendMessage,
    deleteMessage,
    editMessage,
    reactToMessage,
    getReactions,
    markAsRead,
} from "@/app/mesajlar/actions";
import { createClient } from "@/lib/supabase-client";

interface UseChatOptions {
    conversationId: string;
    initialMessages: Message[];
    currentUserId: string;
    initialReactions?: Record<number, { reaction: string; count: number; myReaction: boolean }[]>;
}

export function useChat({
    conversationId,
    initialMessages,
    currentUserId,
    initialReactions = {},
}: UseChatOptions) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [reactions, setReactions] = useState(initialReactions);
    const [sending, setSending] = useState(false);
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Scroll to bottom
    const scrollToBottom = useCallback((smooth = true) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'instant'
            });
        }
    }, []);

    useEffect(() => {
        scrollToBottom(false);
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.sender_id === currentUserId) {
                scrollToBottom();
            }
        }
    }, [messages.length]);

    // Realtime: messages
    useEffect(() => {
        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                const newMsg = payload.new as any;
                setMessages(prev => {
                    if (prev.find(m => m.id === newMsg.id)) return prev;
                    return [...prev, {
                        ...newMsg,
                        message_type: newMsg.message_type || 'text',
                        reply_to: null,
                        sender: null,
                    }];
                });
                scrollToBottom();
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                const updated = payload.new as any;
                setMessages(prev => prev.map(m =>
                    m.id === updated.id ? { ...m, content: updated.content, edited_at: updated.edited_at } : m
                ));
            })
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                const deletedId = (payload.old as any).id;
                setMessages(prev => prev.filter(m => m.id !== deletedId));
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [conversationId, supabase]);

    // Realtime: reactions
    useEffect(() => {
        const channel = supabase
            .channel(`reactions:${conversationId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'message_reactions'
            }, async () => {
                const newReactions = await getReactions(conversationId);
                setReactions(newReactions);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [conversationId, supabase]);

    // Mark as read on mount and new messages
    useEffect(() => {
        markAsRead(conversationId);
    }, [conversationId, messages.length]);

    // Send
    const handleSend = useCallback(async (content: string) => {
        if (!content.trim() || sending) return;

        setSending(true);

        const tempMessage: Message = {
            id: Date.now(),
            conversation_id: conversationId,
            sender_id: currentUserId,
            content: content.trim(),
            is_read: false,
            created_at: new Date().toISOString(),
            message_type: 'text',
            edited_at: null,
            reply_to_id: replyTo?.id || null,
            reply_to: replyTo ? { id: replyTo.id, content: replyTo.content, sender_id: replyTo.sender_id } : null,
            sender: null,
        };

        setMessages(prev => [...prev, tempMessage]);
        setReplyTo(null);

        const result = await sendMessage(conversationId, content, replyTo?.id);
        setSending(false);

        if (!result.success) {
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
        }
    }, [conversationId, currentUserId, replyTo, sending]);

    // Delete
    const handleDelete = useCallback(async (messageId: number) => {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        await deleteMessage(messageId);
    }, []);

    // Edit
    const handleEdit = useCallback(async (messageId: number, newContent: string) => {
        setMessages(prev => prev.map(m =>
            m.id === messageId ? { ...m, content: newContent, edited_at: new Date().toISOString() } : m
        ));
        setEditingMessage(null);

        const result = await editMessage(messageId, newContent);
        if (!result.success) {
            // Revert on failure - refetch would be needed
        }
    }, []);

    // React
    const handleReact = useCallback(async (messageId: number, reaction: string) => {
        // Optimistic update
        setReactions(prev => {
            const existing = prev[messageId] || [];
            const existingReaction = existing.find(r => r.reaction === reaction);

            if (existingReaction?.myReaction) {
                // Remove
                const updated = existing.map(r =>
                    r.reaction === reaction
                        ? { ...r, count: r.count - 1, myReaction: false }
                        : r
                ).filter(r => r.count > 0);
                return { ...prev, [messageId]: updated };
            } else if (existingReaction) {
                // Add mine
                const updated = existing.map(r =>
                    r.reaction === reaction
                        ? { ...r, count: r.count + 1, myReaction: true }
                        : r
                );
                return { ...prev, [messageId]: updated };
            } else {
                // New reaction
                return { ...prev, [messageId]: [...existing, { reaction, count: 1, myReaction: true }] };
            }
        });

        await reactToMessage(messageId, reaction);
    }, []);

    return {
        messages,
        reactions,
        sending,
        replyTo,
        editingMessage,
        scrollRef,
        setReplyTo,
        setEditingMessage,
        handleSend,
        handleDelete,
        handleEdit,
        handleReact,
        scrollToBottom,
    };
}
