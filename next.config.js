/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {protocol:'https',hostname:'kisszoltan.com',pathname:'/images/**'},
      {protocol:'https',hostname:'www.kisszoltan.com',pathname:'/images/**'},
      {protocol:'https',hostname:'ot.ingatlancdn.com',pathname:'/**'}
    ],
  },
  async headers(){return [
    {source:'/:path*',headers:[
      {key:'Strict-Transport-Security',value:'max-age=31536000'},
      {key:'X-Content-Type-Options',value:'nosniff'},
      {key:'X-Frame-Options',value:'DENY'},
      {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
      {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
      // Enforce only stable, non-breaking directives; review script/style restrictions separately.
      {key:'Content-Security-Policy',value:"frame-ancestors 'none'; object-src 'none'; base-uri 'self'"}
    ]},
    {source:'/admin/:path*',headers:[{key:'Cache-Control',value:'private, no-store'},{key:'X-Robots-Tag',value:'noindex, nofollow'}]},
    {source:'/auth/:path*',headers:[{key:'Cache-Control',value:'private, no-store'},{key:'X-Robots-Tag',value:'noindex, nofollow'}]},
    {source:'/api/admin/:path*',headers:[{key:'Cache-Control',value:'private, no-store'}]},
    {source:'/images/:path*',headers:[{key:'Cache-Control',value:'public, max-age=2592000, stale-while-revalidate=86400'}]}
  ]},
  // Preserve existing incoming property links when the new site replaces the old domain.
  async redirects() {
    return [
      {source:'/blog',destination:'/tudastar',permanent:true},
      {source:'/ingatlanjaim/budapest-ii-kerulet',destination:'/ingatlan/torokvesz-exkluziv-rezidencia',permanent:true},
      {source:'/ingatlanjaim/budapest-ii-kerulet-2',destination:'/ingatlan/torokvesz-luxus-penthouse',permanent:true},
      {source:'/ingatlanjaim/xxi-kerulet-feherrozsa-utca',destination:'/ingatlan/feherrozsa-privat-villa',permanent:true},
      {source:'/ingatlanjaim/ii-kerulet-himes-utca',destination:'/ingatlan/himes-utca-nagymeretu-villa',permanent:true},
      {source:'/ingatlanjaim/rozmaring-utca-biatorbagy',destination:'/ingatlan/rozmaring-utca-biatorbagy',permanent:true},
      {source:'/ingatlanjaim/csomad-zahora-utca',destination:'/ingatlan/csomad-zahora-utca',permanent:true}
    ];
  },
};
module.exports = nextConfig;
