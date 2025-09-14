/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // PWA and SEO optimizations (disabled for export mode)
  // async headers() {
  //   return [
  //     {
  //       source: '/sw.js',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=0, must-revalidate',
  //         },
  //         {
  //           key: 'Service-Worker-Allowed',
  //           value: '/',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/manifest.json',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/assets/images/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         {
  //           key: 'X-XSS-Protection',
  //           value: '1; mode=block',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'origin-when-cross-origin',
  //         },
  //       ],
  //     },
  //   ];
  // },
  // Generate sitemap (disabled for export mode)
  // async rewrites() {
  //   return [
  //     {
  //       source: '/sitemap.xml',
  //       destination: '/sitemap.xml',
  //     },
  //     {
  //       source: '/robots.txt',
  //       destination: '/robots.txt',
  //     },
  //   ];
  // },
}

module.exports = nextConfig
