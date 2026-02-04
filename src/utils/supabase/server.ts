import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const getSupabaseEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, publishableKey };
};

/**
 * Anon client for static generation. Does not use cookies; safe to use in
 * generateStaticParams, generateMetadata, and page render when you need
 * static/ISR. RLS applies as anonymous.
 */
export const createSupabaseAnonClient = (): Promise<SupabaseClient> => {
  const { url, publishableKey } = getSupabaseEnv();

  return Promise.resolve(
    createClient(url, publishableKey, { auth: { persistSession: false } }),
  );
};

/**
 * Server client with cookies (auth session). Use for WebStudio, auth callback,
 * and any route that needs the current user. Cannot be used during static
 * generation.
 */
export const createSupabaseServerClient = async (): Promise<SupabaseClient> => {
  const { url, publishableKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // ignore in Server Components
        }
      },
    },
  });
};
