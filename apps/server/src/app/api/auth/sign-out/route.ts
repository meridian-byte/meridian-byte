/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { signOut } from '@/services/api/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function POST() {
  try {
    const result = await signOut();

    return NextResponse.json(
      { result },
      { status: 200, statusText: 'Signed Out' }
    );
  } catch (error) {
    console.error('---> route handler error (sign out):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
