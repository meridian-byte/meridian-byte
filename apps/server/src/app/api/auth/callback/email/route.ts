/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/libraries/supabase/server';
import { AUTH_URLS } from '@/data/constants';
import { profileCreate } from '@/services/database/profile';
import { getEmailLocalPart } from '@repo/utilities/string';
import { emailSendOnboarding } from '@/libraries/wrappers/email';
import { segmentFullName } from '@repo/utilities/string';
import { emailContactAdd } from '@/services/api/email/contacts';
import { companyName } from '@repo/constants/app';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');
  const baseUrl = searchParams.get('baseUrl');
  const redirectUrl = searchParams.get('redirectUrl');

  try {
    if (!email) throw new Error('Email is required');
    if (!otp) throw new Error('OTP is required');
    if (!baseUrl) throw new Error('Base url is required');

    const supabase = await createClient();

    const { data: session, error: verifyError } = await supabase.auth.verifyOtp(
      { email, token: otp, type: 'email' }
    );

    if (verifyError) {
      if (verifyError.code == 'validation_failed') {
        return NextResponse.redirect(
          `${baseUrl + AUTH_URLS.ERROR}?error=${'Validation Failed'}&message=${verifyError.message}`
        );
      } else if (verifyError.code == 'otp_expired') {
        return NextResponse.redirect(
          `${baseUrl + AUTH_URLS.ERROR}?error=${'Invalid OTP'}&message=${verifyError.message}`
        );
      } else {
        throw verifyError;
      }
    }

    // create profile if doesn't exist
    const { profile, existed } = await profileCreate({
      id: session.user?.id || '',
      first_name: getEmailLocalPart(session.user?.email || ''),
    });

    const name = `${profile?.first_name} ${profile?.last_name || ''}`.trim();

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
      await emailSendOnboarding({
        to: userData.email,
        userName:
          segmentFullName(userData?.user_metadata.name).first || userData.email,
        appName: companyName,
      });

      await emailContactAdd(
        { email: userData.email, name: userData.user_metadata.name },
        false
      );
    }

    return NextResponse.redirect(baseUrl + `${redirectUrl || '/'}`);
  } catch (error) {
    console.error('---> route handler error (callback email):', error);

    return NextResponse.redirect(
      `${baseUrl + AUTH_URLS.ERROR}?error=${'Authentication Error'}&message=${encodeURIComponent((error as Error).message)}`
    );
  }
}
