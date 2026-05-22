"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RealtimeProvider() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    if (!userId) return;

    // 3. Subscribe to notifications table
    const channel = supabase
      .channel("user-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new;
          
          // Show toast notification
          toast("Yeni Bildirim!", {
            description: "Biri seninle etkileşime geçti. İncelemek için tıkla.",
            action: {
              label: "Görüntüle",
              onClick: () => router.push("/notifications"),
            },
          });
          
          // Optionally trigger a router refresh to update the notification counter in the header
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, router]);

  return null;
}
