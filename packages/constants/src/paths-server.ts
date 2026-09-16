'use server';

import { headers } from 'next/headers';
import { resolveHost, getUrlPrefix, SHARED_VERCEL_SUBSTRING } from './paths-client';

export async function getBaseUrl() {
  let hostHeader: string | null = null;

  try {
    // Attempt to read headers (works in Dynamic Server Components & Route Handlers)
    const headersList = await headers();
    hostHeader = headersList.get('x-forwarded-host') || headersList.get('host');
  } catch {
    // Silently caught during static generation (e.g. force-static, generateStaticParams)
    hostHeader = null;
  }

  const hostApi = resolveHost(
    process.env.NEXT_PUBLIC_HOST_API_PROD,
    process.env.NEXT_PUBLIC_HOST_API_DEV,
    `${SHARED_VERCEL_SUBSTRING}-api`,
    hostHeader,
  );

  const hostWeb = resolveHost(
    process.env.NEXT_PUBLIC_HOST_WEB_PROD,
    process.env.NEXT_PUBLIC_HOST_WEB_DEV,
    `${SHARED_VERCEL_SUBSTRING}-web`,
    hostHeader,
  );

  const hostAtlas = resolveHost(
    process.env.NEXT_PUBLIC_HOST_ATLAS_PROD,
    process.env.NEXT_PUBLIC_HOST_ATLAS_DEV,
    `${SHARED_VERCEL_SUBSTRING}-atlas`,
    hostHeader,
  );

  return {
    API: `${getUrlPrefix(hostApi)}${hostApi}`,
    WEB: `${getUrlPrefix(hostWeb)}${hostWeb}`,
    ATLAS: `${getUrlPrefix(hostAtlas)}${hostAtlas}`,
  };
}

export const getApiUrl = async () => `${(await getBaseUrl()).API}/api`;
