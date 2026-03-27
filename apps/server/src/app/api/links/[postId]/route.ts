/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await params;

    const linkRecord = await prisma.link.findUnique({
      where: { id: linkId },
    });

    return NextResponse.json(
      { item: linkRecord },
      { status: 200, statusText: 'Link Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get link):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
