// app/robots.txt/route.ts
import { NextResponse } from 'next/server';
import { HOSTED_BASE_URL } from '@repo/constants/paths';

export const dynamic = 'force-static';

export async function GET() {
  const content = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /*?ref=*
Disallow: /*?utm_*

Sitemap: ${HOSTED_BASE_URL.CLIENT_WEB}/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
