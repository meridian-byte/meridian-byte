/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { NoteGet } from '@repo/types/models/note';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET() {
  try {
    const noteRecords = await prisma.note.findMany({
      include: {
        _count: { select: { links_from: true, links_to: true } },
      },

      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: noteRecords },
      { status: 200, statusText: 'Notes Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get notes):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      notes,
      deletedIds,
    }: {
      notes: NoteGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.note.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = notes.map((note) =>
      prisma.note.upsert({
        where: { id: note.id },
        update: {
          ...note,
          updated_at: new Date(note.updated_at),
        },
        create: {
          ...note,
          created_at: new Date(note.created_at),
          updated_at: new Date(note.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateNotes = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateNotes },
      { status: 200, statusText: 'Notes Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update notes):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
