/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@repo/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { CustomizationGet } from '@repo/types/models/customization';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const customizationRecords = await prisma.customization.findMany({
      where: !userId ? undefined : { profile_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: customizationRecords },
      { status: 200, statusText: 'Customizations Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get customizations):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      customizations,
      deletedIds,
    }: {
      customizations: CustomizationGet[];
      deletedIds?: string[];
    } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.customization.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = customizations.map((customization) =>
      prisma.customization.upsert({
        where: { id: customization.id },
        update: {
          ...customization,
          updated_at: new Date(customization.updated_at),
        },
        create: {
          ...customization,
          created_at: new Date(customization.created_at),
          updated_at: new Date(customization.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateCustomizations = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateCustomizations },
      { status: 200, statusText: 'Customizations Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update customizations):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
