/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { PostRelations } from '@repo/types/models/post';
import { SyncStatus } from '@repo/types/models/enums';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET() {
  try {
    const postRecords = await prisma.post.findMany({
      include: {
        _count: { select: { comments: true } },

        category: true,
        profile: true,
      },

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
      posts: PostRelations[];
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
          image: post.image,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          allow_comments: post.allow_comments,
          view_count: post.view_count,
          status: post.status,
          profile_id: post.profile_id,
          category_id: post.category_id,
          updated_at: new Date(post.updated_at),
        },
        create: {
          id: post.id,
          image: post.image,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          allow_comments: post.allow_comments,
          view_count: post.view_count,
          status: post.status,
          profile_id: post.profile_id,
          category_id: post.category_id,
          created_at: new Date(post.created_at),
          updated_at: new Date(post.updated_at),
          sync_status: post.sync_status || SyncStatus.SYNCED,
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
