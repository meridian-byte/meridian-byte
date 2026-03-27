/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ viewId: string }> }
) {
  try {
    const { viewId } = await params;

    const viewRecord = await prisma.view.findUnique({
      where: { id: viewId },
    });

    return NextResponse.json(
      { item: viewRecord },
      { status: 200, statusText: 'View Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get view):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
