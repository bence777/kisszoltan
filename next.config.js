/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async headers(){return [
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
