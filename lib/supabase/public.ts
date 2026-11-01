import { createClient } from "@supabase/supabase-js";

// Anon client without cookies, for public pages that should be statically
// rendered and cached (ISR). Reading cookies forces a page to be dynamic.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
