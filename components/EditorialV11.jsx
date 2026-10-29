import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from './Icons';
import {properties} from '../data/properties';

const visual = (index) => properties[index]?.images?.[0];
export function EditorialListingImage({src,alt,loading='lazy'}){
 const [mode,setMode]=React.useState('optimized');
 React.useEffect(()=>setMode('optimized'),[src]);
 return mode==='broken'||!src?<div className="kz11-image-unavailable" role="img" aria-label={`${alt} – fotó jelenleg nem elérhető`}><span>INGATLANFOTÓ</span><strong>A kép jelenleg nem érhető el.</strong></div>
  :mode==='optimized'&&/^https:\/\/(?:www\.)?kisszoltan\.com\/images\//.test(src)?<Image src={src} alt={alt} loading={loading} width={1200} height={800} sizes="(max-width: 768px) 100vw, 50vw" onError={()=>setMode('original')}/>
  :<img src={src} alt={alt} loading={loading} onError={()=>setMode('broken')}/>;
}

/**
 * The imagery here is from currently published listings, NOT purported before/after,
 * closed transactions, or documented deliverables of the Prémium package.
 */
export function PremiumShowcase({onContact}){
 const featured=properties[0];
 const second=properties[1];
 return <div className="kz11-premium">
  <section className="kz11-premium-lead"><div><span className="eyebrow">A PRÉMIUM CSOMAG LÉNYEGE</span><h2>Az ingatlant ne egyszerű hirdetésként, hanem <em>teljes történetként</em> mutassuk be.</h2></div><p>Az egyedi adottságoknak megfelelő képanyag, strukturált ingatlaninformáció és világos árstratégia együtt segítheti a vevő tájékozódását. A csomag tényleges tartalmát, a feladatok felelőseit és a költségeket a megbízás előtt kell rögzíteni.</p></section>
  <section className="kz11-showcase-hero" aria-label="Példa a részletgazdag ingatlanbemutatásra">
   <figure><EditorialListingImage src={visual(0)} alt={`${featured.title}, fotó Kiss Zoltán nyilvános kínálatából`}/><figcaption>A NYILVÁNOS INGATLAN-KÍNÁLATBÓL / NEM KORÁBBI CSOMAGTELJESÍTÉS</figcaption></figure>
   <div><span>01 / VIZUÁLIS BEMUTATÁS</span><h3>A kép nem díszlet. Információ.</h3><p>Az építészeti karakter, a természetes fény, a térkapcsolatok és a kültéri területek valódi előnyeit kell megmutatnia. A nyilvános csomagleírás profi fotót és videót említ; a konkrét felvételek és átadási formátumok egyeztetendők.</p><Link href={`/ingatlan/${featured.slug}`}>Példa a nyilvános ingatlanadatlapon <Icon name="arrow" size={17}/></Link></div>
  </section>
  <section className="kz11-package-materials" aria-labelledby="kz11-deliverables"><header><span className="eyebrow">MIT ÉRDEMES KÉZZELFOGHATÓAN KÉRNI?</span><h2 id="kz11-deliverables">Nem ígéretek listája.<br/><em>Egyeztethető átadandó anyagok.</em></h2><p>Az alábbiak az elérhető nyilvános csomagleírás alapján összeállított ellenőrzési pontok, nem kész, igazolt munkaminták.</p></header>
   <div className="kz11-materials-grid">
    <article className="kz11-material kz11-material-document"><span>02 / ÁRPOZÍCIÓ</span><h3>Három lehetséges árforgatókönyv</h3><div className="kz11-scenario"><div><b>Óvatos</b><small>Az időtáv elsődleges</small></div><div><b>Kiegyensúlyozott</b><small>Ár és kereslet együtt</small></div><div><b>Kiváró</b><small>Egyediség hangsúlya</small></div></div><p>A szcenáriók módszertani példák, nem számszerű árbecslések vagy Zoltán által jóváhagyott ajánlatok.</p></article>
    <article className="kz11-material kz11-material-photo"><EditorialListingImage src={visual(1)} alt={`${second.title}, nyilvános kínálati fotó`}/><div><span>03 / ÖNÁLLÓ INGATLANOLDAL</span><h3>Egy helyen a fontos válaszok.</h3><p>A területek, a helyszín, a technika és a bemutatás feltételei átláthatóan.</p><Link href={`/ingatlan/${second.slug}`}>Példa az adatlapra <Icon name="arrow" size={15}/></Link></div></article>
    <article className="kz11-material kz11-material-check"><span>04 / ELLENŐRZÉS</span><h3>Amit szerződés előtt tisztázni kell</h3><ul><li>Fotók, videó, alaprajz átadási köre</li><li>Hirdetési költségek és jóváhagyások</li><li>Érdeklődői visszajelzések rendje</li><li>A megbízás időtartama és feltételei</li></ul></article>
   </div>
  </section>
  <section className="kz11-premium-close"><div><span className="eyebrow">EGYEDI AJÁNLAT</span><h2>Milyen bemutatást érdemel az Ön ingatlana?</h2><p>A Prémium csomag akkor értékes, ha a pontos feladatokat az ingatlan adottságaihoz igazítják — nem pedig automatikusan minden eszközt ugyanúgy használnak.</p></div><button type="button" className="btn btn-primary" onClick={onContact}>Kérek személyes egyeztetést <Icon name="arrow" size={17}/></button></section>
 </div>;
}

const steps=[
 {phase:'Felkészülés',title:'A cél és az időzítés',question:'Mi a tulajdonos elsődleges érdeke?',detail:'Határidő, diszkréció, ár- és birtokbaadási elvárások. Ezeket célszerű a megbízás elején tisztázni.',outcome:'Tisztázott döntési szempontok'},
 {phase:'Felkészülés',title:'Az ingatlan és az adatok',question:'Mi igazolható a bemutatás előtt?',detail:'Tulajdoni, területi és műszaki dokumentációk. Az eltérő adatokat nem fedjük el szép képekkel.',outcome:'Ellenőrzendő adatok listája'},
 {phase:'Stratégia',title:'Piaci pozicionálás',question:'Milyen ajánlatokkal vethető össze?',detail:'A közvetlen összehasonlítás előbb ingatlantípust, mikrolokációt és állapotot vizsgál; az átlag csak kontextus.',outcome:'Értelmezhető árjavaslati keret'},
 {phase:'Stratégia',title:'Nyilvánossági döntés',question:'Mit szabad közzétenni?',detail:'A nyilvános hirdetés és a diszkrét bemutatás közti választás a tulajdonosi szempontokra épül.',outcome:'Egyeztetett információmegosztás'},
 {phase:'Bemutatás',title:'Ingatlanprezentáció',question:'Mitől érthető meg az ingatlan?',detail:'A fotó, a szöveg, az alaprajz és az ellenőrizhető adottságok együtt adnak támpontot a vásárláshoz.',outcome:'Jóváhagyásra kész bemutatási terv'},
 {phase:'Bemutatás',title:'Érdeklődők és megtekintés',question:'Ki milyen információt kap?',detail:'Érdemi kérdések, megtekintési egyeztetés és arányos hozzáférés, indokolatlan adatbekérés nélkül.',outcome:'Követhető megkeresések'},
 {phase:'Döntés',title:'Ajánlatok mérlegelése',question:'Csak a vételár számít?',detail:'A fizetési ütemezés, a birtokbaadás és a feltételek is alakíthatják a döntést.',outcome:'Összevethető ajánlati feltételek'},
 {phase:'Döntés',title:'Szerződés és átadás',question:'Mi szükséges a lezáráshoz?',detail:'Az adásvételi okiratok, jogi ellenőrzések és a teljesítési feltételek ügyvédi vagy más illetékes szakértői közreműködést igényelnek.',outcome:'Egyeztetett lezárási feladatok'}
];
export function ProcessJourney({onContact}){
 return <div className="kz11-journey">
  <header className="kz11-journey-intro"><span className="eyebrow">AZ ELADÓI ÚT</span><h2>Nyolc döntési pont.<br/><em>Nem nyolc kipipálandó feladat.</em></h2><p>Az ábra lehetséges szakmai folyamatot szemléltet. Nem állítja, hogy minden ügylet pontosan így zajlik, vagy hogy minden közreműködői feladat automatikusan része a megbízásnak.</p></header>
  {['Felkészülés','Stratégia','Bemutatás','Döntés'].map((phase,i)=><section className={`kz11-journey-phase kz11-phase-${i}`} key={phase}><div className="kz11-journey-phase-side"><span>0{i+1} / 04</span><h3>{phase}</h3><p>{['Mielőtt az ingatlan piacra kerül','Amikor az irányt választjuk ki','Amikor a vevő már döntésre készül','Amikor valódi ajánlat érkezik'][i]}</p>{i===1&&<Link href="/luxusingatlan-ertekbecsles">Hogyan alakul az árstratégia? <Icon name="arrow" size={16}/></Link>}{i===2&&<Link href="/diszkret-ingatlanertekesites">Mikor fontos a diszkréció? <Icon name="arrow" size={16}/></Link>}</div><div className="kz11-journey-cards">{steps.slice(i*2,i*2+2).map((step,j)=><article id={`fejezet-${i*2+j+1}`} key={step.title}><span className="kz11-journey-number">{String(i*2+j+1).padStart(2,'0')}</span><h4>{step.title}</h4><strong>{step.question}</strong><p>{step.detail}</p><div className="kz11-journey-output"><small>DÖNTÉSI KIMENET</small><span>{step.outcome}</span></div></article>)}</div></section>)}
  <section className="kz11-journey-close"><div><span>EGYEDI FOLYAMAT / SZEMÉLYES EGYEZTETÉS</span><h2>Az Ön ingatlanánál melyik lépés a legfontosabb?</h2></div><button type="button" className="btn btn-primary" onClick={onContact}>Beszéljünk róla <Icon name="arrow" size={16}/></button></section>
 </div>;
}

const accessRows=[
 ['Alapadatok','Típus, kerület, jóváhagyott méret','Igen, ellenőrzött formában','—'],
 ['Ingatlanfotók','Kiválasztott külső / belső képek','Tulajdonosi jóváhagyással','További képek egyeztetésre'],
 ['Pontos cím','Helyszín, bejárat és egyedi azonosítók','Indokoltan korlátozható','Megtekintési egyeztetéskor'],
 ['Műszaki dokumentáció','Alaprajz, részletes műszaki adatok','Összefoglaló közölhető','Részletek ellenőrzött érdeklődés után'],
 ['Jogi és személyes adatok','Tulajdonosi és érzékeny iratok','Nem általános hirdetési tartalom','Csak jogszerű, indokolt hozzáféréssel']
];
export function BillionSaleDeepDive(){
 return <div className="kz11-billions">
  <section className="kz11-decision-lead"><div><span className="eyebrow">STRATÉGIAI DÖNTÉSEK, NEM FOLYAMATLEÍRÁS</span><h2>A legnagyobb kérdés gyakran nem az, <em>hol hirdetünk.</em></h2></div><p>Egy milliárdos nagyságrendű ingatlannál külön mérlegelendő az árpozíció, a tulajdonosi magánszféra és a vevő számára átadott információ. Az alábbi példák lehetséges döntési helyzeteket szemléltetnek, nem lezárt Kiss Zoltán-ügyletek.</p></section>
  <section className="kz11-strategy-options"><h2>Három egymástól eltérő helyzet</h2><div><article><span>01 / SZÉLES ELÉRÉS</span><h3>A tulajdonos több érdeklődőt akar elérni.</h3><p>A publikus bemutatás segítheti a felfedezhetőséget, de csak a közzétehető adatokkal. A több megtekintés önmagában nem jelent jobb ajánlatot.</p></article><article><span>02 / KONTROLLÁLT MEGOSZTÁS</span><h3>A magánszféra fontosabb.</h3><p>Szűkebb nyilvános bemutató és lépcsőzetes hozzáférés lehet indokolt; mérlegelendő a csökkenő elérés következménye.</p></article><article><span>03 / EGYEDI ÁRPOZÍCIÓ</span><h3>Kevés közvetlenül hasonló ajánlat van.</h3><p>Az átlagos négyzetméterár helyett dokumentált adottságok és különböző, világosan feltételezett forgatókönyvek szükségesek.</p></article></div></section>
  <section className="kz111-billion-example" id="fejezet-1" aria-labelledby="billion-example-title"><div><span className="eyebrow">2026.10.29-I PUBLIKUS HIRDETÉSI PILLANATKÉP</span><h2 id="billion-example-title">A stratégia alapja nem a „milliárdos” jelző, hanem <em>az ellenőrizhető adottság.</em></h2><p>Az alábbi két aktív ajánlat a nyilvános kínálatból származik. Nem lezárt értékesítési referencia, nem vevői eredmény és nem bizonyíték egy konkrét értékesítési módszer sikerére.</p></div><div className="kz111-billion-example-rows">{[properties[0],properties[1]].map((p,i)=><article key={p.id}><span>0{i+1} / {p.code}</span><h3>{p.title}</h3><p>{p.location} · {p.size} m² listázott méret · {Number(p.price/1000000000).toLocaleString('hu-HU',{maximumFractionDigits:3})} Mrd Ft hirdetési ár.</p><p>{i===0?'Nagy alapterület, telek és összetett műszaki felszereltség: a dokumentált paraméterek és a célközönség együtt számítanak.':'Penthouse sajátos területdefinícióval: a belső tér és a teraszok adatait nem szabad összevonni ellenőrzés nélkül.'}</p><Link href={`/ingatlan/${p.slug}`}>Nyilvános adatlap <Icon name="arrow" size={15}/></Link></article>)}</div><p className="kz111-fineprint">A méretek és hirdetési árak kizárólag forráspéldák. A KZ-002 összesítő területadata tisztázandó; a két ingatlan nem közvetlenül összehasonlítható.</p></section>
  <section className="kz11-buyer-qualification"><div><span className="eyebrow">VEVŐI ÉRDEKLŐDÉS / ARÁNYOS ELŐSZŰRÉS</span><h2>Az első egyeztetésen nem több adatot, hanem <em>jobb kérdéseket</em> érdemes feltenni.</h2><p>A vásárló célja, keresett ingatlantípusa, időzítése és információigénye segíthet eldönteni, mi legyen a következő lépés. Személyes vagy pénzügyi adat indokolatlan bekérése nem a professzionalizmus jele.</p><Link href="/tudastar/hogyan-tortenik-a-premium-vevok-eloszurese">Az érdeklődők előszűréséről részletesen <Icon name="arrow" size={16}/></Link></div><aside><span>EGYEZTETÉSI PÉLDA / NEM KÖTELEZŐ PROTOKOLL</span><ol><li><b>Mit keres?</b><small>Ingatlantípus, lényeges adottságok, lokáció</small></li><li><b>Mikor döntene?</b><small>Tervezett időzítés és megtekintési igény</small></li><li><b>Milyen részlet szükséges?</b><small>Az indokolt következő információ és hozzáférés</small></li></ol></aside></section>
  <section className="kz11-access"><header><span className="eyebrow">INFORMÁCIÓKEZELÉS</span><h2>Mit, kinek és mikor lehet megmutatni?</h2><p>Ez szemléltető hozzáférési mátrix, nem automatikus adatkezelési szabályzat. Az adatátadás jogalapját és részleteit ügyletszinten kell ellenőrizni.</p></header><div className="kz-table-scroll"><table><thead><tr><th scope="col">Adat</th><th scope="col">Mit jelent?</th><th scope="col">Nyilvános bemutatás</th><th scope="col">Későbbi hozzáférés</th></tr></thead><tbody>{accessRows.map(([a,b,c,d])=><tr key={a}><th scope="row">{a}</th><td>{b}</td><td>{c}</td><td>{d}</td></tr>)}</tbody></table></div></section>
  <aside className="kz11-decision-next"><div><span className="eyebrow">KÉT KÜLÖNBÖZŐ KÉRDÉS</span><h2>Hogyan történik az értékesítés, és hogyan döntsünk a stratégiáról?</h2><p>Az elsőre a lépésenkénti szolgáltatási folyamat ad áttekintést. Ez a cikk a másodikra koncentrál: az árpozíció, a diszkréció és az információmegosztás közötti választásokra.</p></div><Link href="/ingatlan-ertekesites-folyamata">Az értékesítés nyolc lépése <Icon name="arrow" size={18}/></Link></aside>
 </div>;
}

export function LibraryTopicFinder(){
 const topics=[
  {name:'Ár és érték',slug:'mitol-fugg-egy-budai-luxusvilla-erteke',description:'Mikrolokáció, műszaki állapot és az összehasonlítható adatok szerepe.',image:visual(3),figureAlt:properties[3]?.title},
  {name:'Stratégia és diszkréció',slug:'nyilvanos-vagy-diszkret-ingatlanertekesites',description:'Nyilvánosság, vevői megkeresések és a bizalmas információk határai.',image:visual(1),figureAlt:properties[1]?.title},
  {name:'Felkészülés és dokumentumok',slug:'milyen-dokumentumok-kellenek-nagyerteku-ingatlan-eladasahoz',description:'Mely adatokat érdemes ellenőrizni, mielőtt az ingatlan megjelenik?',image:visual(2),figureAlt:properties[2]?.title}
 ];
 return <section className="kz11-library-topics" id="temakorok"><div className="kz11-library-topics-heading"><span className="eyebrow">TÉMÁK SZERINT</span><h2>A kérdéséből induljon ki.</h2></div><div className="kz11-topic-grid">{topics.map((topic,i)=><Link key={topic.slug} href={`/tudastar/${topic.slug}`} className="kz11-topic-card"><div className="kz11-topic-image"><EditorialListingImage src={topic.image} alt={`Ingatlanfotó illusztrációként: ${topic.figureAlt}`}/></div><div className="kz11-topic-copy"><span>0{i+1} / TÉMAKÖR</span><h3>{topic.name}</h3><p>{topic.description}</p><b>Útmutató megnyitása <Icon name="arrow" size={16}/></b></div></Link>)}</div><p className="kz11-photo-legal">A képek Kiss Zoltán nyilvános ingatlankínálatából származó témaképek, nem lezárt ügyletek vagy cikkbeli esettanulmányok.</p></section>;
}
