'use server';

import { isProduction } from '@repo/utilities/misc';
/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '',
    {
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
                sameSite: isProdDomain ? 'none' : 'lax',
                path: '/',
              })
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
