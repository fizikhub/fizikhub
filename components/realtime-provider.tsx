"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RealtimeProvider() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | undefined;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const setupAuth = async () => {
      const { createClient } = await import("@/lib/supabase");
      if (!isMounted) return;

      const supabase = createClient();

      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (isMounted) setUserId(session?.user?.id || null);
      });

      // 2. Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (isMounted) setUserId(session?.user?.id || null);
      });

      cleanup = () => subscription.unsubscribe();
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(setupAuth, { timeout: 5000 });
    } else {
      timeoutId = setTimeout(setupAuth, 3000);
    }

    return () => {
      isMounted = false;
      cleanup?.();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    let cleanup: (() => void) | undefined;

    const setupNotifications = async () => {
      const { createClient } = await import("@/lib/supabase");
      if (!isMounted) return;

      const supabase = createClient();

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
          () => {
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

      cleanup = () => {
        supabase.removeChannel(channel);
      };
    };

    setupNotifications();

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [userId, router]);

  return null;
}
