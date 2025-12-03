import { createClient } from "jsr:@supabase/supabase-js@2";

export const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");

if (!GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is required");
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY");

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY environment variable is required");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
