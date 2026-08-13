import { NextRequest } from 'next/server';
import { routeAuthCallbackEmail } from '@repo/handlers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return routeAuthCallbackEmail(request);
}
