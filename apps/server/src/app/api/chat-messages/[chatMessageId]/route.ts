/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatMessageId: string }> }
) {
  try {
    const { chatMessageId } = await params;

    const chatMessageRecord = await prisma.chatMessage.findUnique({
      where: { id: chatMessageId },
    });

    return NextResponse.json(
      { item: chatMessageRecord },
      { status: 200, statusText: 'ChatMessage Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get chatMessage):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
