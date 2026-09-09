'use server';

/// <reference types="node" />

import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key');
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      async setAll(cookiesToSet) {
        const host = (await headers()).get('host') ?? '';
        const isLocalhost = host.includes('localhost');
        const isProdDomain = host.endsWith('meridianbyte.com');

        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...options,
              domain: isProdDomain ? '.meridianbyte.com' : undefined,
              secure: !isLocalhost,
              sameSite: 'lax',
              path: '/',
            }),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
