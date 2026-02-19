/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { NotebookGet } from '@repo/types/models/notebook';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET() {
  try {
    const notebookRecords = await prisma.notebook.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: notebookRecords },
      { status: 200, statusText: 'Notebooks Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get notebooks):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      notebooks,
      deletedIds,
    }: {
      notebooks: NotebookGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.notebook.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = notebooks.map((notebook) =>
      prisma.notebook.upsert({
        where: { id: notebook.id },
        update: {
          ...notebook,
          updated_at: new Date(notebook.updated_at),
        },
        create: {
          ...notebook,
          created_at: new Date(notebook.created_at),
          updated_at: new Date(notebook.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateNotebooks = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateNotebooks },
      { status: 200, statusText: 'Notebooks Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update notebooks):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
