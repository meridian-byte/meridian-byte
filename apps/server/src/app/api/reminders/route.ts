/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ReminderGet } from '@repo/types/models/reminder';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const reminderRecords = await prisma.reminder.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: reminderRecords },
      { status: 200, statusText: 'Reminders Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get reminders):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      reminders,
      deletedIds,
    }: {
      reminders: ReminderGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.reminder.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = reminders.map((reminder) =>
      prisma.reminder.upsert({
        where: { id: reminder.id },
        update: {
          ...reminder,
          updated_at: new Date(reminder.updated_at),
        },
        create: {
          ...reminder,
          created_at: new Date(reminder.created_at),
          updated_at: new Date(reminder.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateReminders = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateReminders },
      { status: 200, statusText: 'Reminders Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update reminders):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
