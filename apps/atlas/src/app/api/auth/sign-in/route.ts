import { NextRequest, NextResponse } from 'next/server';
import { SignIn } from '@repo/types';
import { handlePreAuth } from '@repo/auth';
import { emailSendOtp } from '@repo/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { values }: SignIn = await request.json();

    const response = NextResponse.json(
      {
        message:
          "If an account with the provided email exists, you'll receive an email containing an OTP.",
      },
      { status: 200, statusText: 'Sign In Request Accepted' },
    );

    const { otpValue, response: authResponse } = await handlePreAuth(response, values);

    // send email containing OTP
    await emailSendOtp({ to: values.email, otp: otpValue });
    // console.log('OTP:', otpValue);

    return authResponse;
  } catch (error) {
    console.error('---> route handler error (sign in):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
