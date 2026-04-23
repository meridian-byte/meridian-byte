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
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId } = await params;

    const workspaceRecord = await prisma.workspace.findUnique({
      where: { id: workspaceId },

      include: {
        _count: { select: { notes: true } },
      },
    });

    return NextResponse.json(
      { item: workspaceRecord },
      { status: 200, statusText: 'Workspace Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get workspace):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
