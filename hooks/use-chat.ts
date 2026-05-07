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
import { createClient } from "@/lib/supabase";

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
    const [supabase] = useState(() => createClient());
    const messageIdsRef = useRef(new Set(initialMessages.map((message) => message.id)));

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
    }, [scrollToBottom]);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.sender_id === currentUserId) {
                scrollToBottom();
            }
        }
    }, [currentUserId, messages, scrollToBottom]);

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
                const newMsg = payload.new as unknown as Message;
                setMessages(prev => {
                    if (prev.find(m => m.id === newMsg.id)) return prev;
                    messageIdsRef.current.add(newMsg.id);
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
                const updated = payload.new as unknown as Partial<Message>;
                setMessages(prev => prev.map(m =>
                    m.id === updated.id ? { ...m, content: updated.content ?? m.content, edited_at: updated.edited_at ?? m.edited_at } : m
                ));
            })
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                const deletedId = (payload.old as { id: number }).id;
                messageIdsRef.current.delete(deletedId);
                setMessages(prev => prev.filter(m => m.id !== deletedId));
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [conversationId, scrollToBottom, supabase]);

    // Realtime: reactions
    useEffect(() => {
        const channel = supabase
            .channel(`reactions:${conversationId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'message_reactions'
            }, async (payload) => {
                const row = (payload.new ?? payload.old) as { message_id?: number } | null;
                if (!row?.message_id || !messageIdsRef.current.has(row.message_id)) return;

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
        messageIdsRef.current.add(tempMessage.id);
        setReplyTo(null);

        const result = await sendMessage(conversationId, content, replyTo?.id);
        setSending(false);

        if (!result.success) {
            messageIdsRef.current.delete(tempMessage.id);
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
        } else if (result.message) {
            const savedMessage = {
                ...result.message,
                message_type: result.message.message_type || 'text',
                reply_to: tempMessage.reply_to,
                sender: null,
            } as Message;

            messageIdsRef.current.delete(tempMessage.id);
            messageIdsRef.current.add(savedMessage.id);
            setMessages(prev => prev.map(m => m.id === tempMessage.id ? savedMessage : m));
        }
    }, [conversationId, currentUserId, replyTo, sending]);

    // Delete
    const handleDelete = useCallback(async (messageId: number) => {
        let deletedMsg: Message | undefined;
        setMessages(prev => {
            deletedMsg = prev.find(m => m.id === messageId);
            messageIdsRef.current.delete(messageId);
            return prev.filter(m => m.id !== messageId);
        });
        
        const result = await deleteMessage(messageId);
        
        if (!result.success && deletedMsg) {
            messageIdsRef.current.add(messageId);
            // Rollback on failure
            setMessages(prev => [...prev, deletedMsg as Message].sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            ));
        }
    }, []);

    // Edit
    const handleEdit = useCallback(async (messageId: number, newContent: string) => {
        let oldContent: string | undefined;
        setMessages(prev => {
            const msg = prev.find(m => m.id === messageId);
            if (msg) oldContent = msg.content;
            return prev.map(m =>
                m.id === messageId ? { ...m, content: newContent, edited_at: new Date().toISOString() } : m
            );
        });
        setEditingMessage(null);

        const result = await editMessage(messageId, newContent);
        if (!result.success && oldContent !== undefined) {
             // Revert on failure
             setMessages(prev => prev.map(m =>
                 m.id === messageId ? { ...m, content: oldContent as string, edited_at: null } : m
             ));
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
