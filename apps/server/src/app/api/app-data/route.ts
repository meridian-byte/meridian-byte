/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { SyncStatus } from '@repo/types/models/enums';

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
  categories: prisma.category,
  notes: prisma.note,
  tasks: prisma.task,
  reminders: prisma.reminder,
  recurringRules: prisma.recurringRule,
  views: prisma.view,
};

export async function POST(request: NextRequest) {
  try {
    const storesParam = request.nextUrl.searchParams.get('stores');
    // 1. Parse the requested stores into an array
    const requestedStores = storesParam ? storesParam.split(',') : [];

    // 1. Parse the body ONCE
    const fullPayload = await request.json();

    const allOperations: any[] = [];
    const storeRanges: Record<string, { start: number; end: number }> = {};

    // 2. Build a single flat array of Prisma promises
    requestedStores.forEach((key) => {
      const model = PRISMA_MODEL_MAP[key]; // Get the correct model accessor
      const data = fullPayload[key];

      if (!data || !model) {
        console.error(`No model found for key: ${key}`);
        return;
      }

      const startIdx = allOperations.length;

      // Handle Soft Deletions
      if (data.deletedIds?.length) {
        allOperations.push(
          model.updateMany({
            where: { id: { in: data.deletedIds } },
            data: {
              sync_status: SyncStatus.DELETED, // Ensure this matches your SyncStatus enum string
              updated_at: new Date(), // Critical: must be "now" to override other devices
            },
          })
        );
      }

      // Handle Upserts
      const upserts = data[key].map((item: any) =>
        model.upsert({
          where: { id: item.id },
          update: { ...item, updated_at: new Date(item.updated_at) },
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

    // 3. Execute everything in ONE transaction
    const flatResults = await prisma.$transaction(allOperations);

    // 4. Map the flat results back to the store keys
    const responsePayload = requestedStores.reduce(
      (acc, key) => {
        const range = storeRanges[key];
        if (range) {
          acc[key] = flatResults.slice(range.start, range.end);
        }
        return acc;
      },
      {} as Record<string, any>
    );

    return NextResponse.json(
      { items: responsePayload },
      { status: 200, statusText: 'App Data Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update app data):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
