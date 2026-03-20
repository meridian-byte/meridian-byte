/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { RecurringRuleGet } from '@repo/types/models/recurring-rule';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const recurringRuleRecords = await prisma.recurringRule.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: recurringRuleRecords },
      { status: 200, statusText: 'RecurringRules Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get recurringRules):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      recurringRules,
      deletedIds,
    }: {
      recurringRules: RecurringRuleGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.recurringRule.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = recurringRules.map((recurringRule) =>
      prisma.recurringRule.upsert({
        where: { id: recurringRule.id },
        update: {
          ...recurringRule,
          updated_at: new Date(recurringRule.updated_at),
        },
        create: {
          ...recurringRule,
          created_at: new Date(recurringRule.created_at),
          updated_at: new Date(recurringRule.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateRecurringRules = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateRecurringRules },
      { status: 200, statusText: 'RecurringRules Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update recurringRules):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
