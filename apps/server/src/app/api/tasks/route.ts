/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { TaskGet } from '@repo/types/models/task';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const taskRecords = await prisma.task.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: taskRecords },
      { status: 200, statusText: 'Tasks Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get tasks):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      tasks,
      deletedIds,
    }: {
      tasks: TaskGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.task.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = tasks.map((task) =>
      prisma.task.upsert({
        where: { id: task.id },
        update: {
          ...task,
          updated_at: new Date(task.updated_at),
        },
        create: {
          ...task,
          created_at: new Date(task.created_at),
          updated_at: new Date(task.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateTasks = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateTasks },
      { status: 200, statusText: 'Tasks Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update tasks):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
