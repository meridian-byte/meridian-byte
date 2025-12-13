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
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    const categoryRecord = await prisma.category.findUnique({
      where: { id: categoryId },

      include: {
        _count: { select: { posts: true } },

        posts: {
          include: {
            _count: { select: { comments: true } },

            category: true,
            profile: true,
          },

          orderBy: { created_at: 'desc' },
        },
      },
    });

    return NextResponse.json(
      { item: categoryRecord },
      { status: 200, statusText: 'Category Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get category):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
