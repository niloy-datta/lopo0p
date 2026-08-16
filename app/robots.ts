import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sschscquiz.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard'],
    },
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
