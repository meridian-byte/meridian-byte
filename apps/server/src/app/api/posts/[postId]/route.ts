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
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    const postRecord = await prisma.post.findUnique({
      where: { id: postId },

      include: {
        _count: { select: { comments: true } },

        category: true,
        profile: true,
      },
    });

    return NextResponse.json(
      { item: postRecord },
      { status: 200, statusText: 'Post Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get post):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
