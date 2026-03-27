/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { LinkGet } from '@repo/types/models/link';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const linkRecords = await prisma.link.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: linkRecords },
      { status: 200, statusText: 'Links Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get links):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      links,
      deletedIds,
    }: {
      links: LinkGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.link.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = links.map((link) =>
      prisma.link.upsert({
        where: { id: link.id },
        update: {
          ...link,
          updated_at: new Date(link.updated_at),
        },
        create: {
          ...link,
          created_at: new Date(link.created_at),
          updated_at: new Date(link.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateLinks = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateLinks },
      { status: 200, statusText: 'Links Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update links):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
