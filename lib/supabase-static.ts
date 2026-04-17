import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Static client for use in sitemaps, metadata generation, and other places
// where reading cookies would bail out of Static Generation (ISR)
export const createStaticClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
