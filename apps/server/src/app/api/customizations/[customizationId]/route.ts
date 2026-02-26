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
  { params }: { params: Promise<{ customizationId: string }> }
) {
  try {
    const { customizationId } = await params;

    const customizationRecord = await prisma.customization.findUnique({
      where: { id: customizationId },
    });

    return NextResponse.json(
      { item: customizationRecord },
      { status: 200, statusText: 'Customization Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get customization):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
