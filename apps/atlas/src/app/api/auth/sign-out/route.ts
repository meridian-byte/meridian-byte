import { routeAuthSignOut } from '@repo/handlers';

export const dynamic = 'force-dynamic';

export async function POST() {
  return routeAuthSignOut();
}
