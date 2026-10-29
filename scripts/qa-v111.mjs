/** Run with `node scripts/qa-v111.mjs` on Node 22+. Does not require Next dependencies. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {landings} from '../data/landings.js';
import {articles} from '../data/articles.js';
import {properties} from '../data/properties.js';
import {editorialServices} from '../data/editorialServices.js';
import {isPublicationApproved} from '../data/propertyQuality.js';
import {isArticleApproved,isServiceApproved} from '../lib/publication.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=fs.readdirSync(path.join(root,'previews')).filter(f=>f.endsWith('.html'));
assert.equal(files.length,19,'Nineteen V11.1 fresh previews expected.');
const valid=new Set(['/','/rolam','/kapcsolat','/adatkezeles','/referenciak','/tudastar',...Object.keys(landings).map(s=>`/${s}`),...articles.map(a=>`/tudastar/${a.slug}`),...properties.map(p=>`/ingatlan/${p.slug}`)]);
const problems=[];let anchors=0,hrefs=0;
for(const f of files){const html=fs.readFileSync(path.join(root,'previews',f),'utf8');
 const ids=new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]));
 if((html.match(/<h1\b/g)||[]).length!==1)problems.push(`${f} H1 count`);
 if((html.match(/<footer\b/g)||[]).length!==1)problems.push(`${f} footer count`);
 if(!html.includes('decision-v111')&&!html.includes('kz111-'))problems.push(`${f} missing editorial stylesheet`);
 for(const match of html.matchAll(/\shref="([^"]+)"/g)){
  let href=match[1].replace(/&amp;/g,'&');hrefs++;
  if(href.startsWith('#')){if(!ids.has(href.slice(1)))problems.push(`${f}: missing ${href}`);else anchors++;}
  if(href.startsWith('/')){const clean=href.split(/[?#]/)[0];if(!valid.has(clean))problems.push(`${f}: unknown route ${clean}`);
   const fragment=href.split('#')[1];if(fragment&&clean==='/'&&f==='fooldal-bemutato.html'&&!ids.has(fragment))problems.push(`${f}: missing /#${fragment}`);
  }
 }
}
assert.equal(properties.filter(isPublicationApproved).length,0,'Demo properties must remain unpublished until owner approvals.');
assert.equal(articles.filter(isArticleApproved).length,0,'Article approvals must not be inferred.');
assert.equal(Object.values(editorialServices).filter(isServiceApproved).length,0,'Package commitments must not be considered approved.');
const text=fs.readFileSync(path.join(root,'pages/sitemap.xml.jsx'),'utf8');
assert.match(text,/filter\(isArticleApproved\)/);
assert.match(text,/isServiceApproved\(editorialServices\[slug\]\)/);
assert.match(fs.readFileSync(path.join(root,'components/LeadStatus.jsx'),'utf8'),/delivery|kézbesítése késik/);
console.log(`V11.1 QA: ${files.length} previews, ${hrefs} links, ${anchors} verified same-page anchors.`);
if(problems.length){console.log('ISSUES:',problems.length,'\n'+problems.slice(0,50).join('\n'));process.exit(1)}
console.log('PASS: markup hierarchy, local links, anchor destinations, publication gates.');
