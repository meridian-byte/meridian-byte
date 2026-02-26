/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ChatMessageGet } from '@repo/types/models/chat-message';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const chatMessageRecords = await prisma.chatMessage.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: chatMessageRecords },
      { status: 200, statusText: 'ChatMessages Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get chatMessages):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      chatMessages,
      deletedIds,
    }: {
      chatMessages: ChatMessageGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.chatMessage.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = chatMessages.map((chatMessage) =>
      prisma.chatMessage.upsert({
        where: { id: chatMessage.id },
        update: {
          ...chatMessage,
          updated_at: new Date(chatMessage.updated_at),
        },
        create: {
          ...chatMessage,
          created_at: new Date(chatMessage.created_at),
          updated_at: new Date(chatMessage.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateChatMessages = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateChatMessages },
      { status: 200, statusText: 'ChatMessages Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update chatMessages):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
