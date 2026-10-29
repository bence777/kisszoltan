import assert from 'node:assert/strict';
import {landings} from '../data/landings.js';
import {articles} from '../data/articles.js';
import {editorialServices} from '../data/editorialServices.js';
import {editorialArticles} from '../data/editorialArticles.js';
const serviceSlugs=Object.entries(landings).filter(([,v])=>v.kind==='service').map(([k])=>k);
const editorialSlugs=Object.keys(editorialServices);
assert.deepEqual(serviceSlugs.slice().sort(),editorialSlugs.slice().sort(),'All service URLs must have editorial content.');
assert.deepEqual(articles.map(a=>a.slug).sort(),Object.keys(editorialArticles).sort(),'All articles must have editorial content.');
for(const [slug,content] of Object.entries(editorialServices)){
 assert.ok(content.sections.length>=2,`Service must have chapters: ${slug}`);
 assert.ok(content.synopsis.length>120,`Service needs unique intro: ${slug}`);
 assert.ok(content.checklist?.length>=3,`Service missing checklist: ${slug}`);
 assert.ok(content.faqs?.length>=2,`Service missing FAQ: ${slug}`);
 for(const related of content.featureLinks||[])assert.ok(landings[related],`Invalid link ${slug} -> ${related}`);
}
for(const [slug,content] of Object.entries(editorialArticles)){
 assert.ok(content.sections.length>=5,`Article needs chapters: ${slug}`);
 assert.ok(content.sections.every(s=>s.paragraphs?.length>=1),`Article missing paragraphs: ${slug}`);
 assert.ok(content.answer.length>125,`Article needs takeaway: ${slug}`);
 assert.ok(content.checklist.length>=3,`Article needs checklist: ${slug}`);
}
for(const article of articles)for(const slug of article.related||[])assert.ok(landings[slug],`Invalid article link ${article.slug} -> ${slug}`);
console.log(`PASS: ${serviceSlugs.length} editorial services, ${articles.length} articles, FAQ/checklists, related routes and chapter structure.`);
