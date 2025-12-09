import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

/**
 * Admin client for server-side operations that need to bypass RLS
 * Use this ONLY in server actions where you've already verified permissions
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing Supabase admin credentials')
    }

    return createSupabaseClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
