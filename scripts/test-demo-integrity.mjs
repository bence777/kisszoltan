import assert from 'node:assert/strict';
import fs from 'node:fs';
import {properties} from '../data/properties.js';
import {landings} from '../data/landings.js';
const manifest=JSON.parse(fs.readFileSync(new URL('../SOURCE-MANIFEST.json',import.meta.url),'utf8'));
assert.equal(properties.length,6,'Six source-verified listings expected.');
assert.equal(manifest.photos.length,6);
for(const p of properties){
 const entry=manifest.photos.find(x=>x.code===p.code);
 assert.ok(entry,`Source missing ${p.code}`);
 assert.equal(p.images[0],entry.url,`Photo/source mismatch ${p.code}`);
 assert.equal(p.sourceUrl.replace(/^https:\/\/www\./,'https://'),entry.source_page,`Page/source mismatch ${p.code}`);
 assert.ok(p.price>1e8&&p.size>=150);
 assert.ok(p.images.every(url=>url.startsWith('https://kisszoltan.com/images/')),'Only actual source photos in demo.');
}
for(const slug of ['standard','premium-csomag','exclusive-csomag'])assert.ok(landings[slug],`Missing internal page ${slug}`);
const homepage=fs.readFileSync(new URL('../components/HomeSections.jsx',import.meta.url),'utf8');
assert.ok(!homepage.includes('images.unsplash.com'),'Stock photos must be replaced in method section.');
assert.ok(homepage.includes("'/premium-csomag'") && homepage.includes("'/exclusive-csomag'"));
const css=fs.readFileSync(new URL('../styles/demo-polish.css',import.meta.url),'utf8');
assert.ok(css.includes('@media(max-width:760px)'),'New UI must have mobile layout.');
console.log(`PASS: ${properties.length} verified image/source pairs, relevant internal package links, no stock photography in method, mobile CSS.`);
