/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/libraries/supabase/server';
import { profileCreate } from '@/services/database/profile';
import { segmentFullName } from '@repo/utilities/string';
import { AUTH_URLS } from '@/data/constants';
import { emailSendOnboardSignUp } from '@/libraries/wrappers/email';
import { emailContactAdd } from '@/services/api/email/contacts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // const state = searchParams.get('state');
    // console.log('state', state);

    if (!code) {
      throw new Error('The link is broken');
    }

    const supabase = await createClient();

    const { error: exchangeError, data } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) throw exchangeError;

    // create profile if doesn't exist
    const { profile, existed } = await profileCreate({
      id: data.user?.id,
      first_name: segmentFullName(data.user.user_metadata.name || '').first,
      last_name: segmentFullName(data.user.user_metadata.name || '').last,
      phone: data.user.phone || '',
      avatar: data.user.user_metadata.avatar_url || '',
    });

    const name =
      `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();

    // update user
    const {
      data: { user: userData },
      error: updateError,
    } = await supabase.auth.updateUser({
      data: {
        name,
        full_name: name,
        picture: profile?.avatar,
        avatar_url: profile?.avatar,
        userName: profile?.user_name,
      },
    });

    if (updateError) throw updateError;

    if (!existed && userData && userData.email) {
      await emailSendOnboardSignUp({
        to: userData.email,
        userName:
          segmentFullName(userData?.user_metadata.name).first || userData.email,
      });

      await emailContactAdd(
        { email: userData.email, name: userData.user_metadata.name },
        false
      );
    }

    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? AUTH_URLS.REDIRECT.DEFAULT;
    const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development';

    if (isLocalEnv) {
      // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } catch (error) {
    return NextResponse.redirect(
      `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`
    );
  }
}
