import { db } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { SyncStatus } from '@repo/types';
import { STORE_NAME } from '@repo/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawAccountIds = searchParams.get('accountIds');

    // Split string into an array, filtering out empty strings
    const accountIds = rawAccountIds ? rawAccountIds.split(',').filter(Boolean) : [];

    if (!accountIds.length) {
      return NextResponse.json({ error: 'Account ID(s) required' }, { status: 400 });
    }

    const stores = searchParams.get('stores');
    const requestedStores = stores ? stores.split(',').filter(Boolean) : [];

    // Step 1: Fetch all workspaces matching any of the accountIds
    const workspaces = await db.workspace.findMany({
      where: { accountId: { in: accountIds } },
      orderBy: { createdAt: 'desc' },
    });

    const workspaceIds = workspaces.map((w) => w.id);

    // If no workspaces exist, return early or empty arrays for requested stores
    if (workspaceIds.length === 0) {
      const emptyResponse = requestedStores.reduce(
        (acc, key) => {
          acc[key] = [];
          return acc;
        },
        {} as Record<string, any[]>,
      );

      // Make sure workspaces key is present if requested
      if (requestedStores.includes(STORE_NAME.WORKSPACES)) {
        emptyResponse[STORE_NAME.WORKSPACES] = [];
      }

      return NextResponse.json(emptyResponse, { status: 200 });
    }

    // Step 2: Define the Query Map using the fetched workspaceIds (with `in`)
    const queryMap: Record<string, () => any> = {
      [STORE_NAME.ACCOUNTS]: () =>
        db.account.findMany({
          where: { id: { in: accountIds } },
          orderBy: { createdAt: 'desc' },
        }),

      [STORE_NAME.WORKSPACES]: () => Promise.resolve(workspaces), // Already fetched above

      [STORE_NAME.FOLDERS]: () =>
        db.folder.findMany({
          where: { workspaceId: { in: workspaceIds } },
          orderBy: { createdAt: 'desc' },
        }),
      [STORE_NAME.RECURRING_RULES]: () =>
        db.recurringRule.findMany({
          where: { workspaceId: { in: workspaceIds } },
          orderBy: { createdAt: 'desc' },
        }),
      [STORE_NAME.REMINDERS]: () =>
        db.reminder.findMany({
          where: { workspaceId: { in: workspaceIds } },
          orderBy: { createdAt: 'desc' },
        }),

      // Pave
      [STORE_NAME.CALENDARS]: () =>
        db.calendar.findMany({
          where: { workspaceId: { in: workspaceIds } },
          orderBy: { createdAt: 'desc' },
        }),
      [STORE_NAME.EVENTS]: () =>
        db.event.findMany({
          where: { workspaceId: { in: workspaceIds } },
          orderBy: { createdAt: 'desc' },
        }),

      // Jot
      [STORE_NAME.NOTES]: () =>
        db.note.findMany({
          where: { workspaceId: { in: workspaceIds } },
          orderBy: { createdAt: 'desc' },
        }),
      [STORE_NAME.LINKS]: () =>
        db.link.findMany({
          where: { workspaceId: { in: workspaceIds } },
          orderBy: { createdAt: 'desc' },
        }),

      // Stride
      [STORE_NAME.TASK_LISTS]: () =>
        db.taskList.findMany({
          where: { workspaceId: { in: workspaceIds } },
          orderBy: { createdAt: 'desc' },
        }),
      [STORE_NAME.TASKS]: () =>
        db.task.findMany({
          where: { workspaceId: { in: workspaceIds } },
          orderBy: { createdAt: 'desc' },
        }),
    };

    // Step 3: Filter queries that need database execution
    const validQueries = requestedStores.filter((key) => !!queryMap[key]);

    // Separate WORKSPACES (already resolved) from DB queries to avoid redundant DB hits in transaction
    const dbQueriesToRun = validQueries.filter((key) => key !== STORE_NAME.WORKSPACES);
    const activeDbPromises = dbQueriesToRun.map((key) => queryMap[key]());

    // Step 4: Execute active DB queries in a transaction (or Promise.all)
    const dbResults =
      activeDbPromises.length > 0
        ? await db.$transaction(activeDbPromises, { maxWait: 10000, timeout: 15000 })
        : [];

    // Step 5: Map results back into responsePayload
    let dbResultIndex = 0;
    const responsePayload = validQueries.reduce(
      (acc, key) => {
        if (key === STORE_NAME.WORKSPACES) {
          acc[key] = workspaces;
        } else {
          acc[key] = dbResults[dbResultIndex];
          dbResultIndex++;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return NextResponse.json(responsePayload, {
      status: 200,
      statusText: 'App Data Fetched',
    });
  } catch (error) {
    console.error('---> route handler error (get app data):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const PRISMA_MODEL_MAP: Record<string, any> = {
  [STORE_NAME.ACCOUNTS]: db.account,
  [STORE_NAME.WORKSPACES]: db.workspace,
  [STORE_NAME.FOLDERS]: db.folder,

  // Pave
  [STORE_NAME.CALENDARS]: db.calendar,
  [STORE_NAME.EVENTS]: db.event,

  // Jot
  [STORE_NAME.NOTES]: db.note,
  [STORE_NAME.LINKS]: db.link,

  // Stride
  [STORE_NAME.TASK_LISTS]: db.taskList,
  [STORE_NAME.RECURRING_RULES]: db.recurringRule,
  [STORE_NAME.TASKS]: db.task,
  [STORE_NAME.REMINDERS]: db.reminder,
};

const SYNC_PRIORITY: Record<string, number> = {
  [STORE_NAME.ACCOUNTS]: 1,
  [STORE_NAME.WORKSPACES]: 2,
  [STORE_NAME.FOLDERS]: 3,

  // Pave
  [STORE_NAME.CALENDARS]: 4,
  [STORE_NAME.EVENTS]: 5,

  // Jot
  [STORE_NAME.NOTES]: 6,
  [STORE_NAME.LINKS]: 7,

  // Stride
  [STORE_NAME.TASK_LISTS]: 8,
  [STORE_NAME.RECURRING_RULES]: 9,
  [STORE_NAME.TASKS]: 10,
  [STORE_NAME.REMINDERS]: 11,
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
              syncStatus: SyncStatus.DELETED, // Ensure this matches your SyncStatus enum string
              updatedAt: new Date(), // Critical: must be "now" to override other devices
            },
          }),
        );
      }

      // Handle Upserts
      const upserts = (itemsToUpsert || []).map((item: any) =>
        model.upsert({
          where: { id: item.id },
          update: {
            ...item,
            updatedAt: new Date(item.updatedAt),
          },
          create: {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          },
        }),
      );

      allOperations.push(...upserts);
      storeRanges[key] = { start: startIdx, end: allOperations.length };
    });

    // Execute everything in ONE transaction
    const flatResults = await db.$transaction(allOperations, {
      timeout: 30000, // adjust as needed
      maxWait: 5000, // max time to wait to acquire a connection from pool
    });

    // Map the flat results back to the store keys
    const responsePayload = requestedStores.reduce(
      (acc, key) => {
        const range = storeRanges[key];
        if (range) {
          const rawResults = flatResults.slice(range.start, range.end);
          // Filter out the 'updateMany' result (which is usually { count: x })
          // and keep the upsert results
          acc[key] = rawResults.filter(
            (res) => res && typeof res === 'object' && !res.hasOwnProperty('count'),
          );
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return NextResponse.json(
      { items: responsePayload },
      {
        status: 200,
        statusText: 'App Data Updated',
      },
    );
  } catch (error) {
    console.error('---> route handler error (update app data):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
