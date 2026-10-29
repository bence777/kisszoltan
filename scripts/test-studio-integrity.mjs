import fs from 'node:fs';import assert from 'node:assert/strict';import path from 'node:path';
const root=process.cwd();const read=x=>fs.readFileSync(path.join(root,x),'utf8');
const exists=x=>assert.ok(fs.existsSync(path.join(root,x)),`${x} missing`);
for(const file of ['components/blog/RichEditor.jsx','components/blog/MediaLibrary.jsx','components/blog/VisualImageEditor.jsx','components/blog/BlogRichContent.jsx','lib/mediaClient.js','lib/blogDocument.js','pages/admin/blog.jsx','pages/admin/fajlok.jsx','pages/admin/ingatlanok.jsx','pages/admin/analitika.jsx','pages/api/admin/blog.js','pages/api/admin/media.js','pages/api/admin/ingatlanok.js','pages/api/admin/analitika.js','pages/api/analytics.js','pages/tudastar/[slug].jsx','database/002_kz_studio.sql'])exists(file);
const blog=read('pages/api/admin/blog.js'),property=read('pages/api/admin/ingatlanok.js'),media=read('pages/api/admin/media.js'),sql=read('database/002_kz_studio.sql');
for(const code of [blog,property,media]){assert.match(code,/adminFromRequest/);assert.match(code,/no-store/);}
for(const table of ['kz_blog_posts','kz_blog_taxonomy','kz_blog_slug_redirects','kz_blog_revisions','kz_property_overrides','kz_analytics_events']){assert.ok(sql.includes(table));assert.match(sql,new RegExp('alter table public\\.'+table+' enable row level security'))}
assert.match(read('pages/tudastar/[slug].jsx'),/fallback:'blocking'/);assert.match(read('pages/tudastar/[slug].jsx'),/revalidate:120/);assert.match(blog,/res\.revalidate\(path\)/);assert.match(property,/res\.revalidate\(path\)/);
assert.match(read('pages/_app.jsx'),/sendAnalytics/);assert.match(read('lib/analytics-client.js'),/NEXT_PUBLIC_ANALYTICS_ENABLED/);assert.match(read('pages/api/analytics.js'),/ANALYTICS_ENABLED/);
assert.match(read('lib/mediaClient.js'),/kz-public-media/);assert.match(read('lib/mediaClient.js'),/kz-private-media/);
for(const file of ['pages/admin/blog.jsx','components/blog/RichEditor.jsx'])assert.ok(!read(file).includes('`/blog/${p.slug}`'),'Nora blog link remains');
assert.ok(!read('pages/api/admin/media.js').includes("'site-media'"),'Nora bucket reference remains');
assert.match(read('next.config.js'),/\/admin\/:path\*/);assert.match(read('next.config.js'),/Cache-Control/);
console.log('PASS: studio components, isolated tables/buckets, admin guards, ISR, analytics and migration');
