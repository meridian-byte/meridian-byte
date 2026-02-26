// app/robots.txt/route.ts
import { NextResponse } from 'next/server';
import { PRODUCTION_BASE_URL_CLIENT_WEB } from '@repo/constants/paths';

export const dynamic = 'force-static';

export async function GET() {
  const content = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /*?ref=*
Disallow: /*?utm_*

Sitemap: ${PRODUCTION_BASE_URL_CLIENT_WEB.DEFAULT}/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
