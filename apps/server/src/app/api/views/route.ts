/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ViewGet } from '@repo/types/models/view';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const viewRecords = await prisma.view.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: viewRecords },
      { status: 200, statusText: 'Views Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get views):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      views,
      deletedIds,
    }: {
      views: ViewGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.view.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = views.map((view) =>
      prisma.view.upsert({
        where: { id: view.id },
        update: {
          ...view,
          updated_at: new Date(view.updated_at),
        },
        create: {
          ...view,
          created_at: new Date(view.created_at),
          updated_at: new Date(view.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateViews = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateViews },
      { status: 200, statusText: 'Views Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update views):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
