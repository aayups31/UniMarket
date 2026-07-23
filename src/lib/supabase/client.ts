import { createBrowserClient } from '@supabase/ssr';

import { SUPABASE_COOKIE_OPTIONS } from './cookie-options';
import type { Database } from './database.types';
import { getPublicSupabaseConfig } from './env';

export function createClient() {
  const { publishableKey, url } = getPublicSupabaseConfig();

  return createBrowserClient<Database>(url, publishableKey, {
    cookieOptions: SUPABASE_COOKIE_OPTIONS,
  });
}
