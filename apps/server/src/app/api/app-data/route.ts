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

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const stores = request.nextUrl.searchParams.get('stores');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // 1. Parse the requested stores into an array
    const requestedStores = stores ? stores.split(',') : [];

    // 2. Define the Query Map
    // This maps the URL string to the actual Prisma call
    const queryMap: Record<string, () => any> = {
      categories: () =>
        prisma.category.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      notes: () =>
        prisma.note.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      tasks: () =>
        prisma.task.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      reminders: () =>
        prisma.reminder.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      recurringRules: () =>
        prisma.recurringRule.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      views: () =>
        prisma.view.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
    };

    // 3. Filter the map to only include requested stores
    const activeQueries = requestedStores
      .filter((key) => !!queryMap[key]) // Ignore invalid keys
      .map((key) => queryMap[key]());

    // 3. Execute the transaction
    const results = await prisma.$transaction(activeQueries);

    // 5. Format into a clean object: { tasks: [...], categories: [...] }
    // Map the results back to their keys
    const responsePayload = requestedStores.reduce(
      (acc, key, index) => {
        acc[key] = results[index];
        return acc;
      },
      {} as Record<string, any>
    );

    return NextResponse.json(responsePayload, {
      status: 200,
      statusText: 'App Data Synchronized',
    });
  } catch (error) {
    console.error('---> route handler error (get app data):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
