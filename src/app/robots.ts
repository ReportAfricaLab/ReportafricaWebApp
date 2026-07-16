import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/profile/',
          '/notifications/',
          '/create-report/',
          '/payment/',
          '/auth/',
          '/google-callback/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot-News',
        allow: ['/report', '/feed', '/elections'],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'PerplexityBot', 'Bytespider'],
        allow: '/',
        disallow: ['/api/', '/profile/', '/notifications/', '/create-report/', '/payment/', '/auth/'],
      },
    ],
    sitemap: 'https://www.reportafrica.africa/sitemap.xml',
    host: 'https://www.reportafrica.africa',
  };
}
