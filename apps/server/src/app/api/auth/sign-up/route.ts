/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { NextResponse } from 'next/server';
import { signUp } from '@/services/api/auth';
import { SignUp } from '@repo/types/auth';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function POST(request: Request) {
  try {
    const body: SignUp = await request.json();
    const { redirect } = await signUp(body);

    return NextResponse.json(
      { redirect },
      { status: 200, statusText: 'Signed Up' }
    );
  } catch (error) {
    console.error('---> route handler error (sign up):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
