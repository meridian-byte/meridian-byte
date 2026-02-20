/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { PostGet } from '@repo/types/models/post';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const postRecords = await prisma.post.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: postRecords },
      { status: 200, statusText: 'Posts Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get posts):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      posts,
      deletedIds,
    }: {
      posts: PostGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.post.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = posts.map((post) =>
      prisma.post.upsert({
        where: { id: post.id },
        update: {
          ...post,
          updated_at: new Date(post.updated_at),
        },
        create: {
          ...post,
          created_at: new Date(post.created_at),
          updated_at: new Date(post.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updatePosts = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updatePosts },
      { status: 200, statusText: 'Posts Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update posts):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
