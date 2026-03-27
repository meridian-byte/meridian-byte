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
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;

    const chatRecord = await prisma.chat.findUnique({
      where: { id: chatId },

      include: {
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json(
      { item: chatRecord },
      { status: 200, statusText: 'Chat Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get chat):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
