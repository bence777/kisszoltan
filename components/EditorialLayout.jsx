import React from 'react';
import Link from 'next/link';
import Icon from './Icons';
import {landings} from '../data/landings';
import {EditorialPhotoInterlude} from './EditorialExperience';
import NarrativeExhibit from './NarrativeExhibit';

function slugId(text,index){return `fejezet-${index+1}`;}

export function EditorialReadingLayout({content,variant='service',cta=null,slug=''}){
 const items=content?.sections||[];
 return <div className="kz-editorial-reading">
   <aside className="kz-reading-aside"><div className="kz-sticky-aside">
     <span className="kz-aside-eyebrow">AZ OLDAL TARTALMA</span>
     <nav aria-label="Az oldal fejezetei">{items.map((s,i)=><a key={s.title} href={`#${slugId(s.title,i)}`}><span>{String(i+1).padStart(2,'0')}</span>{s.title}</a>)}</nav>

   </div></aside>
   <div className="kz-editorial-sections">{items.map((s,i)=><React.Fragment key={s.title}>
     <section className="kz-editorial-chapter" id={slugId(s.title,i)} aria-labelledby={`chapter-heading-${i}`}>
      <span className="kz-chapter-no">{String(i+1).padStart(2,'0')} <span> / {String(items.length).padStart(2,'0')}</span></span>
      <h2 id={`chapter-heading-${i}`}>{s.title}</h2>
      {(s.paragraphs||[]).map((p,j)=><p key={j}>{p}</p>)}
      {Boolean(s.points?.length)&&<ul className="kz-chapter-points">{s.points.map(p=><li key={p}><span aria-hidden="true"/> {p}</li>)}</ul>}
      {s.note&&<p className="kz-chapter-note">{s.note}</p>}
     </section>
     {i===1 && variant==='service' && <NarrativeExhibit slug={slug}/>}
     {i===1 && items.length>2 && variant==='article' && slug==='mitol-fugg-egy-budai-luxusvilla-erteke'&&<EditorialPhotoInterlude slug={slug} content={content} position={1} variant={variant}/>}
    </React.Fragment>)}</div>
 </div>;
}

export function EditorialChecklist({items=[],title='Ellenőrzőlista az első egyeztetés előtt'}){
 if(!items.length)return null;
 return <section className="kz-editorial-checklist" aria-label={title}>
  <div><div className="eyebrow">GYAKORLATI SEGÍTSÉG</div><h2>{title}</h2><p>Az alábbi kérdések végiggondolása segít abban, hogy az első beszélgetés konkrét döntésekről szóljon.</p></div>
  <ol>{items.map((item,i)=><li key={item}><span>{String(i+1).padStart(2,'0')}</span><p>{item}</p></li>)}</ol>
 </section>;
}

export function EditorialFaq({faqs=[]}){
 if(!faqs.length)return null;
 return <section className="kz-editorial-faq" aria-label="Gyakori kérdések">
  <div><div className="eyebrow">GYAKORI KÉRDÉSEK</div><h2>Amire érdemes<br/><em>előre választ kapni.</em></h2></div>
  <div className="kz-editorial-faq-list">{faqs.map(([q,a],i)=><details key={q}><summary><span>{String(i+1).padStart(2,'0')}</span><strong>{q}</strong><span className="kz-faq-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>
 </section>;
}

export function EditorialRelated({slugs=[],title='Kapcsolódó szolgáltatások',articles=[],activeSlug=null}){
 const seen=new Set();
 return <section className="kz-editorial-related"><div className="eyebrow">TOVÁBBI OLVASNIVALÓ</div><h2>{title}</h2><div className="kz-editorial-related-list">
  {slugs.filter(slug=>landings[slug]&&slug!==activeSlug&&!seen.has(slug)&&seen.add(slug)).map(slug=><Link href={`/${slug}`} key={slug}><span>ÚTMUTATÓ / SZOLGÁLTATÁS</span><strong>{landings[slug].title}</strong><Icon name="arrow" size={20}/></Link>)}
  {articles.map(a=><Link href={`/tudastar/${a.slug}`} key={a.slug}><span>TUDÁSTÁR</span><strong>{a.title}</strong><Icon name="arrow" size={20}/></Link>)}
 </div></section>;
}

const packages=[
 {name:'Standard',href:'/standard',rows:['Árjavaslat és alaprajz','Nem része a nyilvános leírásnak','Nem része a nyilvános leírásnak','Havi 1 telefonos egyeztetés','Határozatlan; pontos feltételek egyeztetéssel']},
 {name:'Prémium',href:'/premium-csomag',rows:['Árjavaslat, 3 forgatókönyv','Profi fotó és videó','Saját ingatlanoldal','Háromhetenkénti konzultáció','A nyilvános leírás szerint 6 hónap']},
 {name:'Exclusive',href:'/exclusive-csomag',rows:['3 stratégiai forgatókönyv','Profi fotó és egyedi videó','Saját oldal, brosúra és staging','Kéthetenkénti konzultáció, havi riport','Nyilvános leírás szerint 6–12 hónap']}
];
const labels=['Stratégia','Vizuális bemutatás','További bemutatási eszközök','Kapcsolattartás','Nyilvánosan szereplő megbízási idő'];
export function PackageComparison({active}){
 return <section id="csomagok-osszehasonlitasa" className="kz-package-comparison" aria-label="Csomagok összehasonlítása"><div className="eyebrow">SZOLGÁLTATÁSI SZINTEK</div><h2>Három eltérő együttműködési forma.</h2><p>Az összehasonlítás Kiss Zoltán nyilvános szolgáltatásleírásaira épül. A szolgáltatási kör és a megbízás pontos feltételei az adott ingatlanra szabott egyeztetés során rögzíthetők.</p><div className="kz-table-scroll"><table><thead><tr><th scope="col">Szempont</th>{packages.map(pkg=><th scope="col" key={pkg.name} className={pkg.href===`/${active}`?'kz-highlight':''}><Link href={pkg.href}>{pkg.name}</Link></th>)}</tr></thead><tbody>{labels.map((label,i)=><tr key={label}><th scope="row">{label}</th>{packages.map(pkg=><td key={pkg.name} className={pkg.href===`/${active}`?'kz-highlight':''}>{pkg.rows[i]}</td>)}</tr>)}</tbody></table></div>
 </section>;
}

// Purpose-built explanatory modules. They are not decorative card grids.
const reviewRows=[
 ['Terület', 'Kerületi átlag alapján egyetlen m²-adat', 'Nettó lakóterület, telek és kültéri területek külön'],
 ['Lokáció', 'Kerületi címkézés', 'Utca, tájolás, megközelítés, panoráma és privát szféra'],
 ['Műszaki állapot', 'Általános állapotleírás', 'Dokumentált gépészet, felújítások, energetika'],
 ['Ár', 'Automatikus szorzás', 'Valóban összehasonlítható adatok és forgatókönyvek']
];
const discreetLevels=[
 ['01','Nyilvános ismertető','Ingatlantípus, hozzávetőleges elhelyezkedés, fő adottságok és a megosztásra jóváhagyott képek.'],
 ['02','Személyes egyeztetés','A konkrét érdeklődés, a keresett ingatlanjellemzők és a bemutatás lehetőségeinek tisztázása.'],
 ['03','Ellenőrzött betekintés','Részletes dokumentáció, pontos helyszín és megtekintés az egyeztetett feltételek szerint.']
];
export function ServiceFramework({slug,page}){
 if(slug==='diszkret-ingatlanertekesites')return <section className="kz-framework"><div className="eyebrow">AZ INFORMÁCIÓ MEGOSZTÁSÁNAK SZINTJEI</div><h2>Nem mindent kell mindenkinek<br/><em>ugyanabban a pillanatban tudnia.</em></h2><div className="kz-framework-steps">{discreetLevels.map(([n,t,d])=><div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>;
 if(slug==='luxusingatlan-ertekbecsles')return <section className="kz-framework"><div className="eyebrow">ÖSSZEHASONLÍTÁSI MÓDSZER</div><h2>Átlagos adat helyett <em>értelmezhető elemzés.</em></h2><div className="kz-table-scroll"><table className="kz-framework-table"><thead><tr><th>Szempont</th><th>Egyszerűsített megközelítés</th><th>Egyedi ingatlannál vizsgálandó</th></tr></thead><tbody>{reviewRows.map(([n,a,b])=><tr key={n}><th scope="row">{n}</th><td>{a}</td><td>{b}</td></tr>)}</tbody></table></div></section>;
 if(slug==='ingatlan-ertekesites-folyamata')return <section className="kz-framework"><div className="eyebrow">A TELJES ÚT RÖVIDEN</div><h2>Nyolc lépés. <em>Egy követhető folyamat.</em></h2><div className="kz-framework-timeline">{(page.sections||[]).map(([t],i)=><div key={t}><span>{String(i+1).padStart(2,'0')}</span><strong>{t.replace(/^\d+\.\s*/, '')}</strong></div>)}</div><p className="kz-framework-note">Ez egy ajánlott folyamatmodell, nem minden ügyletben automatikusan követett vagy szerződésben vállalt munkarend.</p></section>;
 return null;
}
