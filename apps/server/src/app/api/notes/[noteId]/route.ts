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
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await params;

    const noteRecord = await prisma.note.findUnique({
      where: { id: noteId },

      include: {
        _count: { select: { links_from: true, links_to: true } },
      },
    });

    return NextResponse.json(
      { item: noteRecord },
      { status: 200, statusText: 'Note Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get note):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
