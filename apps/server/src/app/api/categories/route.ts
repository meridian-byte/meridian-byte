/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { CategoryRelations } from '@repo/types/models/category';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const categoryRecords = await prisma.category.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: categoryRecords },
      { status: 200, statusText: 'Categories Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get categories):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      categories,
      deletedIds,
    }: {
      categories: CategoryRelations[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.category.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = categories.map((category) =>
      prisma.category.upsert({
        where: { id: category.id },
        update: {
          ...category,
          updated_at: new Date(category.updated_at),
        },
        create: {
          ...category,
          created_at: new Date(category.created_at),
          updated_at: new Date(category.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateCategories = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateCategories },
      { status: 200, statusText: 'Categories Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update categories):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
