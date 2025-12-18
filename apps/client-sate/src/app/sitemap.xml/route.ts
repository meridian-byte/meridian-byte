// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { HOSTED_BASE_URL } from '@repo/constants/paths';
import { sitemapRoutes } from '@/data/routes';

export const dynamic = 'force-static';

export async function GET() {
  const now = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    '', // homepage
    ...sitemapRoutes,
  ]
    .map(
      (route) => `
    <url>
      <loc>${HOSTED_BASE_URL.CLIENT_WEB}${route}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${route === '' ? 1 : 0.8}</priority>
    </url>
  `
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
