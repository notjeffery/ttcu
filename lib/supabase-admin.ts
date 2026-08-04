import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY client using the service role key — bypasses RLS.
// Never import this in a Client Component or expose it to the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
