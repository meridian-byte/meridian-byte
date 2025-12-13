/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  // // Add security check (e.g., API key validation)
  // const authHeader = request.headers.get('authorization');

  // if (authHeader !== `Bearer ${process.env.REVALIDATION_TOKEN}`) {
  //   return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  // }

  try {
    // Revalidate the sitemap
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}
