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
  { params }: { params: Promise<{ reminderId: string }> }
) {
  try {
    const { reminderId } = await params;

    const reminderRecord = await prisma.reminder.findUnique({
      where: { id: reminderId },

      include: {
        task: true,
        profile: true,
      },
    });

    return NextResponse.json(
      { item: reminderRecord },
      { status: 200, statusText: 'Reminder Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get reminder):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
