import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import type { Database } from './database.types';
import { getPublicSupabaseConfig } from './env';

export async function createClient() {
  const cookieStore = await cookies();
  const { publishableKey, url } = getPublicSupabaseConfig();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The root proxy refreshes the
          // session and writes any updated cookies to the response instead.
        }
      },
    },
  });
}
