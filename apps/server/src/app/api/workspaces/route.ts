/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { WorkspaceGet } from '@repo/types/models/workspace';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const workspaceRecords = await prisma.workspace.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: workspaceRecords },
      { status: 200, statusText: 'Workspaces Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get workspaces):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      workspaces,
      deletedIds,
    }: {
      workspaces: WorkspaceGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.workspace.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = workspaces.map((workspace) =>
      prisma.workspace.upsert({
        where: { id: workspace.id },
        update: {
          ...workspace,
          updated_at: new Date(workspace.updated_at),
        },
        create: {
          ...workspace,
          created_at: new Date(workspace.created_at),
          updated_at: new Date(workspace.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateWorkspaces = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateWorkspaces },
      { status: 200, statusText: 'Workspaces Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update workspaces):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
