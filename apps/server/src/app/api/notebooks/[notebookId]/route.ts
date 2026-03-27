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
  { params }: { params: Promise<{ notebookId: string }> }
) {
  try {
    const { notebookId } = await params;

    const notebookRecord = await prisma.notebook.findUnique({
      where: { id: notebookId },

      include: {
        _count: { select: { notes: true } },
      },
    });

    return NextResponse.json(
      { item: notebookRecord },
      { status: 200, statusText: 'Notebook Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get notebook):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
