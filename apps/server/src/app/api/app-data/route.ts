/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { SyncStatus } from '@repo/types/models/enums';
import { STORE_NAME } from '@repo/constants/names';

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
      [STORE_NAME.CATEGORIES]: () =>
        prisma.category.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      [STORE_NAME.WORKSPACES]: () =>
        prisma.workspace.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      [STORE_NAME.NOTES]: () =>
        prisma.note.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      [STORE_NAME.TASKS]: () =>
        prisma.task.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      [STORE_NAME.REMINDERS]: () =>
        prisma.reminder.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      [STORE_NAME.RECURRING_RULES]: () =>
        prisma.recurringRule.findMany({
          where: { profile_id: userId },
          orderBy: { created_at: 'desc' },
        }),
      [STORE_NAME.VIEWS]: () =>
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
      statusText: 'App Data Fetched',
    });
  } catch (error) {
    console.error('---> route handler error (get app data):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

const PRISMA_MODEL_MAP: Record<string, any> = {
  [STORE_NAME.CATEGORIES]: prisma.category,
  [STORE_NAME.WORKSPACES]: prisma.workspace,
  [STORE_NAME.VIEWS]: prisma.view,
  [STORE_NAME.NOTES]: prisma.note,
  [STORE_NAME.TASKS]: prisma.task,
  [STORE_NAME.REMINDERS]: prisma.reminder,
  [STORE_NAME.RECURRING_RULES]: prisma.recurringRule,
};

const SYNC_PRIORITY: Record<string, number> = {
  [STORE_NAME.WORKSPACES]: 1,
  [STORE_NAME.CATEGORIES]: 2,
  [STORE_NAME.VIEWS]: 3,
  [STORE_NAME.NOTES]: 4,
  [STORE_NAME.TASKS]: 5,
  [STORE_NAME.REMINDERS]: 6,
  [STORE_NAME.RECURRING_RULES]: 7,
};

export async function POST(request: NextRequest) {
  try {
    const storesParam = request.nextUrl.searchParams.get('stores');
    // Parse the requested stores into an array
    const rawStores = storesParam ? storesParam.split(',') : [];

    // SORT HERE: Ensure the API dictates the execution order
    const requestedStores = rawStores.sort((a, b) => {
      return (SYNC_PRIORITY[a] || 99) - (SYNC_PRIORITY[b] || 99);
    });

    // Parse the body ONCE
    const fullPayload = await request.json();

    const allOperations: any[] = [];
    const storeRanges: Record<string, { start: number; end: number }> = {};

    // Build a single flat array of Prisma promises
    requestedStores.forEach((key) => {
      const model = PRISMA_MODEL_MAP[key]; // Get the correct model accessor
      const data = fullPayload[key];
      const { upserts: itemsToUpsert = [], deletedIds = [] } = data;

      if (!data || !model) {
        console.error(`No model found for key: ${key}`);
        return;
      }

      const startIdx = allOperations.length;

      // Handle Soft Deletions
      if (deletedIds?.length) {
        allOperations.push(
          model.updateMany({
            where: { id: { in: deletedIds } },
            data: {
              sync_status: SyncStatus.DELETED, // Ensure this matches your SyncStatus enum string
              updated_at: new Date(), // Critical: must be "now" to override other devices
            },
          })
        );
      }

      // Handle Upserts
      const upserts = (itemsToUpsert || []).map((item: any) =>
        model.upsert({
          where: { id: item.id },
          update: {
            ...item,
            updated_at: new Date(item.updated_at),
          },
          create: {
            ...item,
            created_at: new Date(item.created_at),
            updated_at: new Date(item.updated_at),
          },
        })
      );

      allOperations.push(...upserts);
      storeRanges[key] = { start: startIdx, end: allOperations.length };
    });

    // Execute everything in ONE transaction
    const flatResults = await prisma.$transaction(allOperations);

    // Map the flat results back to the store keys
    const responsePayload = requestedStores.reduce(
      (acc, key) => {
        const range = storeRanges[key];
        if (range) {
          const rawResults = flatResults.slice(range.start, range.end);
          // Filter out the 'updateMany' result (which is usually { count: x })
          // and keep the upsert results
          acc[key] = rawResults.filter(
            (res) =>
              res && typeof res === 'object' && !res.hasOwnProperty('count')
          );
        }
        return acc;
      },
      {} as Record<string, any>
    );

    return NextResponse.json(
      { items: responsePayload },
      {
        status: 200,
        statusText: 'App Data Updated',
      }
    );
  } catch (error) {
    console.error('---> route handler error (update app data):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
