import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()
    const config = getSupabasePublicConfig();

    if (!config) {
        throw new Error("Missing Supabase public credentials (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY).");
    }

    return createServerClient(
        config.url,
        config.anonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

import { createClient as createStaticSupabaseClient } from '@supabase/supabase-js';

export function getSupabasePublicConfig() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!url || !anonKey) return null;

    return { url, anonKey };
}

export function hasSupabasePublicConfig() {
    return Boolean(getSupabasePublicConfig());
}

export function createStaticClient() {
    const config = getSupabasePublicConfig();

    if (!config) {
        throw new Error("Missing Supabase public credentials (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY).");
    }

    return createStaticSupabaseClient(config.url, config.anonKey);
}
