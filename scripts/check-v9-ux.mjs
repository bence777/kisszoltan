import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const land=read('pages/[slug].jsx'),article=read('pages/tudastar/[slug].jsx'),heros=read('components/IntentDesign.jsx'),editorial=read('components/EditorialLayout.jsx');
function test(ok,text){if(!ok)throw new Error('FAIL '+text);console.log('PASS '+text)}
test(!land.includes('kz-landing-contact')&&!article.includes('kz-landing-contact'),'Nincs kettőzött, footer előtti generikus CTA');
test(!land.includes('kz-editorial-position'),'Nincs azonos köztes konzultációs doboz minden szolgáltatásoldalon');
test(land.includes("slug==='luxusingatlan-ertekbecsles'&&<ValueExplorer/>"),'Csak az értékbecslési landingen jelenik meg a teljes kalkulátor');
test(!editorial.includes('kz-reading-aside-contact'),'Nincs ismétlődő oldalsávbeli konzultációs panel');
for(const kind of ['Masthead-valuation','Masthead-privacy','Masthead-process','Masthead-plan','Masthead-seller'])test(heros.toLowerCase().includes(kind.toLowerCase()),`Célzott masthead: ${kind}`);
test(heros.includes('articleModes')&&heros.includes('documents')&&heros.includes('buyers')&&heros.includes('price'),'Cikkenként eltérő tartalomvizuál');
test(read('components/GlobalUI.jsx').includes('/luxusingatlan-ertekbecsles#ertekbecsles'),'Globális CTA a tényleges eszközre vezet');
const dir=path.join(root,'previews');const previews=fs.readdirSync(dir).filter(x=>x.endsWith('.html'));
test(previews.length>=16,'Legalább 16 statikus HTML ellenőrzőnézet');
for(const file of previews.filter(x=>/^(eladni|diszkret|premium|standard|exclusive|luxusvillak|penthouse|ingatlan-ertekesites|luxusingatlan-ertekbecsles|tudastar|cikk-)/.test(x))){
 const html=fs.readFileSync(path.join(dir,file),'utf8');
 test((html.match(/<h1\b/g)||[]).length===1,`${file}: egy H1`);
 test((html.match(/<footer\b/g)||[]).length===1,`${file}: egy footer`);
 test(!html.includes('class=\"kz-landing-contact\"'),`${file}: nincs ál-footer`);
}
