/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { NextResponse } from 'next/server';
import { signIn } from '@/services/api/auth';
import { SignIn } from '@repo/types/auth';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function POST(request: Request) {
  try {
    const body: SignIn = await request.json();
    const { redirect } = await signIn(body);

    return NextResponse.json(
      { redirect },
      { status: 200, statusText: 'Signed In' }
    );
  } catch (error) {
    console.error('---> route handler error (sign in):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
