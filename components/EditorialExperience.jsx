import React from 'react';
import Link from 'next/link';
import Icon from './Icons';
import {properties} from '../data/properties';
import {districtSources} from '../data/kshBudapest';

// Valós képek az eredeti, nyilvános Kiss Zoltán ingatlanhirdetésekből.
// A fotók itt szekcióillusztrációk, nem az adott cikkben szereplő referenciák.
const scenes={
 'eladni-szeretnek':0,
 'diszkret-ingatlanertekesites':3,
 'luxusingatlan-ertekbecsles':0,
 'ingatlan-ertekesites-folyamata':4,
 'standard':2,
 'premium-csomag':1,
 'exclusive-csomag':0,
 'luxusvillak-budapest':0,
 'penthouse-budapest':1,
 'luxusingatlanok-budapest-ii-kerulet':3,
 'ingatlanjaim':0,
 'hogyan-zajlik-egy-milliardos-ingatlan-ertekesitese':0,
 'mitol-fugg-egy-budai-luxusvilla-erteke':3,
 'miert-nem-eleg-az-atlagos-negyzetmeterar-luxusvilla':0,
 'mire-figyeljek-luxusingatlan-eladasakor':2,
 'diszkret-luxusingatlan-ertekesites':1,
 'budapesti-luxusingatlan-piac':1
};
export const sceneFor=slug=>properties[scenes[slug]??(slug.length%properties.length)]||properties[0];

export function EditorialHeroMedia({slug,article=false}){
 const scene=sceneFor(slug);
 return <figure className={`kz-v8-cover ${article?'kz-v8-cover-article':''}`}>
 <img src={scene.images?.[0]} alt={`Kiss Zoltán nyilvános kínálatából: ${scene.title}`} loading="eager"/>
 <figcaption className="kz-v8-cover-caption"><div><span>01 / SZERKESZTŐI FOTÓ</span><strong>{scene.location}</strong></div><Link href={`/ingatlan/${scene.slug}`} aria-label={`${scene.title} adatlapjának megnyitása`}><Icon name="arrow" size={20}/></Link></figcaption>
 <span className="kz-v8-cover-vertical">KISS ZOLTÁN · INGATLANOK</span>
 </figure>;
}

export function EditorialPhotoInterlude({content,slug,position=1,variant='article'}){
 const base=sceneFor(slug);
 const scene=properties[(properties.indexOf(base)+position+2)%properties.length];
 const section=content?.sections?.[position]||content?.sections?.[0];
 if(!section)return null;
 return <div className={`kz-v8-interlude kz-v8-interlude-${variant}`}><div className="kz-v8-interlude-photo">
 <img src={scene.images?.[0]} loading="lazy" alt={`Kiss Zoltán nyilvános kínálatából: ${scene.title}`}/>
 <span>VALÓDI INGATLANFOTÓ · {scene.location}</span></div>
 <div className="kz-v8-interlude-copy"><span>GONDOLATÉBRESZTŐ / {String(position+1).padStart(2,'0')}</span><h3>{section.title}</h3><p>{section?.points?.[0]||section?.paragraphs?.[0]}</p><Link href={`/ingatlan/${scene.slug}`}>Ingatlan megtekintése <Icon name="arrow" size={16}/></Link></div></div>;
}

export function MarketFactStrip({compact=false}){
 return <section className={`kz-v8-fact-strip ${compact?'kz-v8-fact-strip-compact':''}`} aria-label="Hivatalos ingatlanpiaci adat"><div className="kz-v8-fact-title"><span>PIACI KONTEXTUS / KSH 2026. I. NEGYEDÉV</span><strong>1,2 millió Ft/m²</strong><p>Budapesti használt lakások átlagos adásvételi négyzetméterára.</p></div><div><span>MIT JELENT EZ EGY LUXUSINGATLANNÁL?</span><p>A fővárosi átlag önmagában nem alkalmas egyedi villa, penthouse vagy különleges rezidencia árazására. A kerületi, épülettípusonkénti és műszaki eltéréseket külön kell megvizsgálni.</p><a href={districtSources.latest} target="_blank" rel="noopener noreferrer">Hivatalos KSH-jelentés <Icon name="arrow" size={16}/></a></div></section>;
}

export function ServiceSignature({slug,sections=[]}){
 if(slug==='eladni-szeretnek')return <section className="kz-v8-signature kz-v8-steps"><div><span className="eyebrow">A DÖNTÉS ÚTVONALA</span><h2>Az első kérdéstől<br/><em>a megbízásig.</em></h2><p>Nem az ingatlan adataival kezdődik minden. Először azt érdemes tisztázni, mit szeretne elérni a tulajdonos, és milyen feltételekkel.</p></div><div className="kz-v8-step-rows">{[['01','Cél és időzítés','Mikor, milyen keretek között szeretne értékesíteni?'],['02','Ingatlan és dokumentáció','Mely adatok ellenőrzöttek, melyeket kell pontosítani?'],['03','Ár és bemutatás','Milyen közönséghez, milyen információkkal szólunk?'],['04','Személyes egyeztetés','A konkrét stratégia az ingatlan ismeretében áll össze.']].map(([n,t,d])=><div key={n}><span>{n}</span><strong>{t}</strong><p>{d}</p></div>)}</div></section>;
 if(slug==='diszkret-ingatlanertekesites')return <section className="kz-v8-signature kz-v8-discretion"><div className="eyebrow">DISZKRÉCIÓ · INFORMÁCIÓS RÉTEGEK</div><h2>Nem minden adat<br/><em>való a nyilvánosság elé.</em></h2><div className="kz-v8-discretion-levels">{[['01 / NYILVÁNOS','Általános elhelyezkedés, ellenőrzött alapadatok, előzetesen jóváhagyott képek.'],['02 / ÉRDEKLŐDÉS UTÁN','Részletes műszaki és területi információk, a tulajdonossal egyeztetett körben.'],['03 / SZEMÉLYESEN','Pontos cím, érzékeny dokumentumok és megtekintés feltételei, indokolt hozzáféréssel.']].map(([label,text])=><div key={label}><span>{label}</span><p>{text}</p></div>)}</div><small>Javasolt információkezelési modell, nem Kiss Zoltán valamennyi megbízására vonatkozó állítás.</small></section>;
 if(slug==='ingatlan-ertekesites-folyamata')return <section className="kz-v8-signature kz-v8-process"><span className="eyebrow">AZ ÉRTÉKESÍTÉS FÁZISAI</span><h2>A figyelem nem ér véget<br/><em>a hirdetés közzétételével.</em></h2><div className="kz-v8-process-track">{['Felmérés','Árpozíció','Prezentáció','Vevői kapcsolat','Tárgyalás','Lezárás'].map((s,i)=><div key={s}><span>{String(i+1).padStart(2,'0')}</span><strong>{s}</strong></div>)}</div></section>;
 if(slug==='luxusingatlan-ertekbecsles')return <MarketFactStrip/>;
 return null;
}

export function ArticleInsight({slug,article}){
 const showData=/negyzetmeterar|erteke|piac|milliardos/.test(slug);
 if(showData)return <MarketFactStrip compact/>;
 const question=article?.sections?.[0]?.points?.[0]||'Mely adatok és célok alapján érdemes döntést hozni?';
 return <aside className="kz-v8-article-insight"><span>AZ ELSŐ DÖNTÉSI KÉRDÉS</span><strong>{question}</strong><p>Az általános útmutató kereteit a konkrét ingatlan adottságai és az eladói célok határozzák meg.</p></aside>;
}

export function PropertyPriceContrast(){
 const villa=properties.find(p=>p.id==='KZ-004');
 const residence=properties.find(p=>p.id==='KZ-001');
 const kshPrice=1276;
 return <section className="kz-v8-contrast" aria-label="Hirdetési és adásvételi árak összevetése"><div className="kz-v8-contrast-head"><div><span className="eyebrow">GYAKORLATI PÉLDA · II. KERÜLET</span><h2>Ugyanaz a kerület.<br/><em>Három különböző szám.</em></h2></div><p>A KSH múltbeli lezárt adásvételeinek átlaga és a két aktuálisan meghirdetett ingatlan négyzetméterára nem azonos adat. A példa azt mutatja, miért kell gondosan választani a referenciákat.</p></div>
 <div className="kz-v8-contrast-grid"><div className="kz-v8-contrast-ksh"><span>KSH / 2024 / LEZÁRT ADÁSVÉTELEK</span><strong>{(kshPrice/1000).toLocaleString('hu-HU',{maximumFractionDigits:3})} M</strong><p>Ft/m² · Budapest II. kerület, összes lakástípus</p><a href={districtSources.historical} target="_blank" rel="noopener noreferrer">Forrás: KSH ↗</a></div>{[villa,residence].map(p=><div key={p.id} className="kz-v8-contrast-listing"><span>KISS ZOLTÁN / HIRDETÉSI ÁR</span><strong>{(p.price/p.size/1000000).toLocaleString('hu-HU',{maximumFractionDigits:2})} M</strong><p>Ft / listázott m² · {p.title}</p><Link href={`/ingatlan/${p.slug}`}>Adatlap <Icon name="arrow" size={14}/></Link></div>)}</div>
 <p className="kz-v8-contrast-note">Az eltérő időpontból és adatforrásból származó értékek <strong>nem közvetlenül összehasonlítható piaci értékbecslések.</strong> A hirdetési ár nem tényleges eladási ár, a luxusingatlanok átlagos kategória- és méretjellemzői eltérnek a kerületi adásvételek összességétől.</p></section>;
}
