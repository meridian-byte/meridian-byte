/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ChatGet } from '@repo/types/models/chat';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const chatRecords = await prisma.chat.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: chatRecords },
      { status: 200, statusText: 'Chats Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get chats):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      chats,
      deletedIds,
    }: {
      chats: ChatGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.chat.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = chats.map((chat) =>
      prisma.chat.upsert({
        where: { id: chat.id },
        update: {
          ...chat,
          updated_at: new Date(chat.updated_at),
        },
        create: {
          ...chat,
          created_at: new Date(chat.created_at),
          updated_at: new Date(chat.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateChats = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateChats },
      { status: 200, statusText: 'Chats Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update chats):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
