import React from 'react';
import Link from 'next/link';
import Icon from './Icons';
import {properties} from '../data/properties';

const plans=[['standard','Standard','Önállóbb eladóknak'],['premium-csomag','Prémium','Részletesebb bemutatással'],['exclusive-csomag','Exclusive','Komplexebb értékesítési kerettel']];
const accents={
 'eladni-szeretnek':'ELADÓI NÉZŐPONT',
 'luxusingatlan-ertekbecsles':'ÁR ÉS ÉRTÉK',
 'diszkret-ingatlanertekesites':'BIZALMAS ÉRTÉKESÍTÉS',
 'ingatlan-ertekesites-folyamata':'A STRATÉGIÁTÓL AZ ADÁSVÉTELIG'
};
const photoFor=(slug,items=[])=>items[0]||properties[slug==='eladni-szeretnek'?4:slug==='penthouse-budapest'?1:slug==='luxusvillak-budapest'?2:3]||properties[0];

function PropertyVisual({p,tag='A NYILVÁNOS KÍNÁLATBÓL'}){
 if(!p)return null;
 return <figure className="kz9-property-image"><img src={p.images?.[0]} alt={`${p.title} – Kiss Zoltán nyilvános ingatlankínálatából`} loading="eager"/><figcaption><span>{tag}</span><strong>{p.location}</strong><Link href={`/ingatlan/${p.slug}`} aria-label={`${p.title} adatlapja`}><Icon name="arrow"/></Link></figcaption></figure>;
}
function IntentActions({slug,openContact}){
 switch(slug){
 case 'eladni-szeretnek':return <div className="kz9-actions"><Link className="btn btn-primary" href="/luxusingatlan-ertekbecsles#ertekbecsles">Online összehasonlítás <Icon name="arrow"/></Link><a className="kz9-link" href="#eladoi-lepesek">A folyamat megismerése ↓</a></div>;
 case 'luxusingatlan-ertekbecsles':return <div className="kz9-actions"><a className="btn btn-primary" href="#ertekbecsles">Értékiránytű kipróbálása <Icon name="arrow"/></a><a className="kz9-link" href="#fejezet-1">Hogyan értelmezze az adatokat? ↓</a></div>;
 case 'diszkret-ingatlanertekesites':return <div className="kz9-actions"><a className="kz9-link" href="#fejezet-1">Mikor indokolt a diszkréció? ↓</a></div>;
 case 'ingatlan-ertekesites-folyamata':return <div className="kz9-actions"><a className="kz9-link" href="#fejezet-1">A folyamat részletei ↓</a></div>;
 default:return <div className="kz9-actions"><a className="kz9-link" href="#csomagok-osszehasonlitasa">Csomagok összehasonlítása ↓</a><button className="kz9-link" type="button" onClick={openContact}>Kérdésem van a csomagról <Icon name="arrow" size={16}/></button></div>;
 }
}
function HeroCopy({page,slug,openContact}){return <div className="kz9-hero-copy"><span className="eyebrow">{accents[slug]||page.eyebrow}</span><h1>{page.title}</h1><p>{page.lead}</p><IntentActions slug={slug} openContact={openContact}/></div>}

export function ServiceMasthead({page,slug,openContact}){
 const isPackage=plans.some(x=>x[0]===slug);
 if(isPackage)return <section className="kz9-masthead kz9-masthead-plan"><HeroCopy page={page} slug={slug} openContact={openContact}/><div className="kz9-plan-panel"><span className="kz9-overline">AZ EGYÜTTMŰKÖDÉS FORMÁI</span><div className="kz9-plan-list">{plans.map(([key,title,sub],i)=><Link key={key} className={key===slug?'is-selected':''} href={`/${key}`} aria-current={key===slug?'page':undefined}><span>0{i+1}</span><strong>{title}</strong><small>{sub}</small><Icon name="arrow" size={16}/></Link>)}</div><p>Az egyes csomagok pontos tartalmát és feltételeit minden megbízás előtt egyeztetni szükséges.</p></div></section>;
 if(slug==='luxusingatlan-ertekbecsles')return <section className="kz9-masthead kz9-masthead-valuation"><HeroCopy page={page} slug={slug} openContact={openContact}/><div className="kz9-valuation-art"><span className="kz9-overline">MI HATÁROZZA MEG AZ ÉRTÉKET?</span><div className="kz9-valuations"><div><b>01</b><strong>Mikrolokáció</strong><span>Panoráma · hozzáférés · telek</span></div><div><b>02</b><strong>Épületminőség</strong><span>Állapot · gépészet · alaprajz</span></div><div><b>03</b><strong>Piaci helyzet</strong><span>Összehasonlítható kínálat és kereslet</span></div></div><div className="kz9-valuation-art-bottom"><strong>Ár ≠ érték</strong><small>A hirdetési négyzetméterár önmagában nem értékbecslés.</small></div></div></section>;
 if(slug==='diszkret-ingatlanertekesites')return <section className="kz9-masthead kz9-masthead-privacy"><HeroCopy page={page} slug={slug} openContact={openContact}/><div className="kz9-privacy-art"><span>MEGOSZTÁSI SZINTEK</span><div><b>01</b><strong>Nyilvános</strong><small>A jóváhagyott alapadatok</small></div><div><b>02</b><strong>Egyeztetés után</strong><small>Részletes műszaki információk</small></div><div><b>03</b><strong>Bizalmasan</strong><small>Cím és érzékeny dokumentumok</small></div><p>A fokozatok ajánlott keretet jelentenek, nem automatikus vállalást.</p></div></section>;
 if(slug==='ingatlan-ertekesites-folyamata')return <section className="kz9-masthead kz9-masthead-process"><HeroCopy page={page} slug={slug} openContact={openContact}/><div className="kz9-process-art"><span>AZ ÉRTÉKESÍTÉS MENETE</span>{[['01','Felkészülés'],['02','Stratégia'],['03','Bemutatás'],['04','Döntés']].map(([n,t])=><div key={n}><b>{n}</b><strong>{t}</strong></div>)}</div></section>;
 return <section className="kz9-masthead kz9-masthead-seller"><HeroCopy page={page} slug={slug} openContact={openContact}/><PropertyVisual p={photoFor(slug)} tag="KISS ZOLTÁN · NYILVÁNOS KÍNÁLAT"/></section>;
}

export function CategoryMasthead({page,slug,items=[]}){const p=photoFor(slug,items);return <section className={`kz9-category-masthead kz9-category-${slug}`}><div className="kz9-category-copy"><span className="eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.lead}</p><div className="kz9-category-meta"><b>{items.length.toString().padStart(2,'0')}</b><span>nyilvánosan bemutatott ingatlan ebben a válogatásban</span></div><a className="kz9-link" href="#kinalat">Ingatlanok áttekintése ↓</a></div><PropertyVisual p={p} tag="A VÁLOGATÁSBÓL"/></section>}

const articleModes={
 'hogyan-zajlik-egy-milliardos-ingatlan-ertekesitese':'strategy',
 'mitol-fugg-egy-budai-luxusvilla-erteke':'villa',
 'nyilvanos-vagy-diszkret-ingatlanertekesites':'privacy',
 'milyen-dokumentumok-kellenek-nagyerteku-ingatlan-eladasahoz':'documents',
 'hogyan-tortenik-a-premium-vevok-eloszurese':'buyers',
 'miert-nem-eleg-az-atlagos-negyzetmeterar-luxusvilla':'price'
};
function ArticleIllustration({mode}){
 switch(mode){
  case 'strategy':return <div className="kz9-article-visual kz9-article-strategy"><span>EGYEDI ÉRTÉKESÍTÉSI DÖNTÉSEK</span>{[['Árpozíció','Hogyan igazolható?'],['Nyilvánosság','Mennyi részlet publikus?'],['Hozzáférés','Ki mit tekinthet meg?']].map(([q,a],i)=><div key={q}><b>0{i+1}</b><strong>{q}</strong><small>{a}</small></div>)}<p>Három egymással összefüggő kérdés. Nem eladási eredmények.</p></div>;
  case 'villa':return <PropertyVisual p={properties[3]} tag="ÉPÍTÉSZET ÉS LOKÁCIÓ · PÉLDAINGATLAN"/>;
  case 'privacy':return <div className="kz9-article-visual kz9-article-privacy"><span>INFORMÁCIÓSTRATÉGIA</span><div><strong>Nyilvános</strong><small>Szélesebb elérés</small></div><div><strong>Diszkrét</strong><small>Kontrollált hozzáférés</small></div><p>Nem egymást kizáró, hanem mérlegelendő megközelítések.</p></div>;
  case 'documents':return <div className="kz9-article-visual kz9-article-docs"><span>DOKUMENTUMOK</span>{['Tulajdoni helyzet','Területek és alaprajzok','Műszaki és energetikai adatok','Engedélyek és szerződés'].map((x,i)=><div key={x}><b>0{i+1}</b><strong>{x}</strong><span aria-hidden="true">✓</span></div>)}</div>;
  case 'buyers':return <div className="kz9-article-visual kz9-article-buyers"><span>AZ ÉRDEKLŐDŐ ÚTJA</span>{['Első érdeklődés','Érdemi egyeztetés','Megtekintés','Következő döntés'].map((x,i)=><div key={x}><b>{String(i+1).padStart(2,'0')}</b><strong>{x}</strong></div>)}<p>Nem több személyes adat, hanem pontosabb következő lépések.</p></div>;
  case 'price':return <div className="kz9-article-visual kz9-article-price"><span>MIÉRT NEM EGYETLEN SZÁM?</span><strong>Ft/m²</strong><div><span>Kerületi átlag</span><b>≠</b><span>Egyedi villa ára</span></div><p>Az ingatlantípus, a telek, a műszaki minőség és az adatok időpontja is számít.</p></div>;
  default:return <div className="kz9-article-visual kz9-article-steps"><span>ÁTGONDOLT ÉRTÉKESÍTÉS</span>{['Felmérés','Stratégia','Bemutatás','Ajánlat'].map((x,i)=><div key={x}><b>0{i+1}</b><strong>{x}</strong></div>)}</div>;
 }
}
export function ArticleMasthead({article:a,rich}){const mode=articleModes[a.slug]||'steps';return <header className={`kz9-article-masthead kz9-article-mode-${mode}`}><div className="kz9-article-masthead-copy"><span className="eyebrow">{rich?.label||'INGATLANPIACI ÚTMUTATÓ'}</span><h1>{a.title}</h1><p>{a.intro}</p><div className="kz9-article-meta"><span>Szakmai útmutató · Tudástár</span><span aria-hidden="true">/</span><a href="#fejezet-1">Olvasás kezdete ↓</a></div></div><ArticleIllustration mode={mode}/></header>}

const serviceBridges={
 'eladni-szeretnek':{eyebrow:'ELSŐ LÉPÉS',title:'Milyen hirdetési árakból indulhatunk ki?',text:'Az online eszköz a nyilvánosan meghirdetett ingatlanok egyszerű összehasonlítását teszi lehetővé. Nem helyettesíti a személyes értékmeghatározást.',href:'/luxusingatlan-ertekbecsles#ertekbecsles',label:'Online értékiránytű'},
 'diszkret-ingatlanertekesites':{eyebrow:'KAPCSOLÓDÓ FOLYAMAT',title:'Hogyan illeszkedik a diszkréció az értékesítésbe?',text:'A nyilvánosságról és az adatok megosztásáról az árazás és a bemutatási terv kialakításával együtt érdemes dönteni.',href:'/ingatlan-ertekesites-folyamata',label:'Az értékesítés menete'},
 'ingatlan-ertekesites-folyamata':{eyebrow:'A FELKÉSZÜLÉSHEZ',title:'Induljon az ingatlan értékének megértésével.',text:'A megfelelő árstratégia nem egyetlen kerületi átlagból, hanem a konkrét ingatlan adottságaiból indul ki.',href:'/luxusingatlan-ertekbecsles',label:'Az értékbecslés szempontjai'}
};
export function ServiceBridge({slug,openContact}){if(slug==='luxusingatlan-ertekbecsles'||plans.some(x=>x[0]===slug))return null;const b=serviceBridges[slug];if(!b)return null;return <section className="kz9-service-bridge"><span>{b.eyebrow}</span><div><h2>{b.title}</h2><p>{b.text}</p></div><Link href={b.href}>{b.label} <Icon name="arrow" size={17}/></Link></section>}
