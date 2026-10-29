import React, {useState} from 'react';
import Link from 'next/link';
import Icon from './Icons';
import {properties} from '../data/properties';
import {useApp,track} from './AppContext';

const featured=properties.find(p=>p.id==='KZ-001')||properties[0];
const exterior=featured?.images?.[0]||'';
const detailPhoto=properties.find(p=>p.id==='KZ-003')||properties[2]||featured;
const goals=[
 {value:'Megfelelő ár',label:'A megfelelő ajánlat az első',caption:'Nem sürgős, de fontos a piaci pozíció.',insight:'Az árstratégiánál a hasonló adottságú ajánlatok, a mikrolokáció és a műszaki tartalom kerül előtérbe.',route:'/luxusingatlan-ertekbecsles',routeLabel:'Az árképzés szempontjai'},
 {value:'Diszkréció',label:'Nem szeretnék mindent nyilvánossá tenni',caption:'Fontos, ki és mikor láthatja az adatokat.',insight:'A nyilvánosság szintjét érdemes még a fotózás és a hirdetés előtt tisztázni. A célzott és a nyilvános megjelenés kombinálható.',route:'/diszkret-ingatlanertekesites',routeLabel:'Diszkrét értékesítés'},
 {value:'Időzítés',label:'Az időzítés meghatározó',caption:'Konkrét határidőhöz igazodnék.',insight:'A kívánt időtáv befolyásolhatja az induló árat, a megjelenési tervet és a megtekintések szervezését.',route:'/ingatlan-ertekesites-folyamata',routeLabel:'Az értékesítés menete'}
];
const types=['Villa / családi ház','Penthouse / lakás','Rezidencia / egyéb'];
const periods=['Három hónapon belül','3–12 hónapon belül','Még tájékozódom'];
const questions=[
 ['Meg kell adnom a pontos címet az első üzenetben?','Nem. Az első egyeztetéshez elegendő lehet az ingatlantípus, a környék és az elérhetőség. A pontos címet később, bizalmasan lehet egyeztetni.'],
 ['Minden nagy értékű ingatlan esetében jó megoldás a nyilvános hirdetés?','Nem feltétlenül. Az ingatlan és a tulajdonos céljai határozzák meg, milyen információk kerülhetnek nyilvánosságra, és mikor.'],
 ['Miből lehet megalapozott hirdetési árat kialakítani?','Az ingatlan sajátosságaiból, az ellenőrzött műszaki és területadatokból, a lokációból és valóban összehasonlítható piaci ajánlatokból. A nyilvános kínálati ár nem azonos a lezárt eladási árral.']
];

export default function SellerExperience(){
 const {setModal}=useApp();
 const [goal,setGoal]=useState(0);
 const [type,setType]=useState(0);
 const [period,setPeriod]=useState(2);
 const [stage,setStage]=useState(0);
 const selected=goals[goal];
 const contact=()=>{track('seller_path_contact_open',{origin:'seller_v10',goal:selected.value});setModal({type:'lead',kind:'seller',context:`Eladói konzultációt szeretnék kérni. Elsődleges szempont: ${selected.value}. Ingatlantípus: ${types[type]}. Időzítés: ${periods[period]}.`});};
 return <div className="kz10-seller" id="seller-top">
  <header className="kz10-seller-hero">
   <div className="kz10-seller-hero-copy">
    <span className="kz10-eyebrow"><span className="kz10-dot"/> INGATLANTULAJDONOSOKNAK / BUDAPEST ÉS KÖRNYÉKE</span>
    <h1>Egy különleges ingatlanhoz <em>nem sablonhirdetés kell.</em></h1>
    <p>Az ár, a nyilvánosság és az időzítés együtt határozza meg, hogyan érdemes elindítani az értékesítést. Először ezeket tisztázzuk.</p>
    <div className="kz10-seller-hero-actions"><a href="#eladoi-iranytu" className="kz10-button-primary">Nézzük az Ön helyzetét <Icon name="arrow" size={18}/></a><Link href="/ingatlanjaim" className="kz10-button-line">Ingatlanok megtekintése <Icon name="arrow" size={16}/></Link></div>
    <div className="kz10-hero-fineprint"><span>01 — Stratégia</span><span>02 — Bemutatás</span><span>03 — Értékesítés</span></div>
   </div>
   <figure className="kz10-seller-hero-photo">
    <img src={exterior} alt={`${featured.title} – a nyilvánosan meghirdetett ingatlan külső fotója`} loading="eager"/>
    <figcaption><span><b>KÍNÁLATI PÉLDA · NEM LEZÁRT ÉRTÉKESÍTÉS</b><strong>{featured.title}</strong><small>{featured.location}</small></span><Link href={`/ingatlan/${featured.slug}`} aria-label="A példaként bemutatott ingatlan adatlapja"><Icon name="arrow" size={21}/></Link></figcaption>
   </figure>
  </header>

  <section className="kz10-owner-tool" id="eladoi-iranytu" aria-labelledby="owner-tool-heading">
   <div className="kz10-owner-tool-head"><div><span className="kz10-eyebrow dark">RÖVID TÁJÉKOZÓDÁS · REGISZTRÁCIÓ NÉLKÜL</span><h2 id="owner-tool-heading">Nem mindenkinek <em>ugyanaz a jó út.</em></h2></div><p>Három rövid kérdés segít megfogalmazni, milyen szempontok alapján érdemes az első beszélgetést felépíteni. Ez nem automatikus értékbecslés.</p></div>
   <div className="kz10-owner-workspace">
    <div className="kz10-owner-controls">
     <div className="kz10-owner-steps" aria-label="Tájékozódási lépések">{['Cél','Ingatlan','Időzítés'].map((label,i)=><button key={label} type="button" aria-current={stage===i?'step':undefined} onClick={()=>setStage(i)} className={stage===i?'active':''}><b>0{i+1}</b><span>{label}</span></button>)}</div>
     <div className="kz10-owner-question" aria-live="polite">
      {stage===0?<><span className="kz10-mini-label">01 / 03 — AZ ELSŐDLEGES SZEMPONT</span><h3>Mi számít most a legtöbbet?</h3><div className="kz10-choices">{goals.map((item,i)=><button type="button" key={item.value} className={goal===i?'selected':''} aria-pressed={goal===i} onClick={()=>setGoal(i)}><span className="kz10-choice-check">{goal===i?'✓':''}</span><span><strong>{item.label}</strong><small>{item.caption}</small></span><Icon name="arrow" size={16}/></button>)}</div></>:null}
      {stage===1?<><span className="kz10-mini-label">02 / 03 — AZ INGATLAN TÍPUSA</span><h3>Milyen ingatlant értékesítene?</h3><div className="kz10-choices">{types.map((item,i)=><button type="button" key={item} className={type===i?'selected':''} aria-pressed={type===i} onClick={()=>setType(i)}><span className="kz10-choice-check">{type===i?'✓':''}</span><strong>{item}</strong><Icon name="arrow" size={16}/></button>)}</div></>:null}
      {stage===2?<><span className="kz10-mini-label">03 / 03 — AZ IDŐTÁV</span><h3>Mikor szeretné elindítani?</h3><div className="kz10-choices">{periods.map((item,i)=><button type="button" key={item} className={period===i?'selected':''} aria-pressed={period===i} onClick={()=>setPeriod(i)}><span className="kz10-choice-check">{period===i?'✓':''}</span><strong>{item}</strong><Icon name="arrow" size={16}/></button>)}</div></>:null}
      <div className="kz10-owners-nav"><button type="button" disabled={stage===0} onClick={()=>setStage(s=>Math.max(0,s-1))}>← Előző</button>{stage<2?<button type="button" className="kz10-next" onClick={()=>{track('seller_path_next',{step:stage+1});setStage(s=>Math.min(2,s+1));}}>Következő <Icon name="arrow" size={16}/></button>:<button type="button" className="kz10-next" onClick={contact}>Személyes egyeztetést kérek <Icon name="arrow" size={16}/></button>}</div>
     </div>
    </div>
    <aside className="kz10-owner-summary"><span className="kz10-mini-label">AZ ÖN KIINDULÓPONTJA</span><div className="kz10-owner-summary-track" aria-hidden="true"><span>ÉRTÉKESÍTÉSI CÉL</span><div><i/><i/><i/></div><b>EGYEZTETÉSI ALAP</b></div><span className="kz10-summary-tag">{selected.value}</span><h3>{selected.label}</h3><p>{selected.insight}</p><dl><div><dt>Ingatlan</dt><dd>{types[type]}</dd></div><div><dt>Tervezett időtáv</dt><dd>{periods[period]}</dd></div></dl><Link href={selected.route} className="kz10-owner-related">{selected.routeLabel} <Icon name="arrow" size={17}/></Link><small>Tájékozódást segítő összefoglaló; nem személyre szabott értékesítési javaslat.</small></aside>
   </div>
  </section>

  <section className="kz10-what-matters" aria-labelledby="matters-heading"><div className="kz10-section-heading"><span className="kz10-eyebrow dark">AMIT A HIRDETÉS ELŐTT ÉRDEMES ÁTGONDOLNI</span><h2 id="matters-heading">Három döntés, ami <em>megváltoztathatja a teljes értékesítést.</em></h2></div>
   <div className="kz10-matters-grid"><article className="kz10-price-editorial"><span className="kz10-mini-label">01 / ÁRSTRATÉGIA</span><h3>Nem a négyzetméterárat kell eladni.</h3><p>Azonos kerületen belül is eltérhet a telek, a panoráma, a gépészet és az ingatlan használhatósága.</p><div className="kz10-price-lines" aria-label="Az árstratégia egymással összefüggő tényezői"><div><span>Adottságok</span><b/></div><div><span>Összevethető kínálat</span><b/></div><div><span>Eladói cél</span><b/></div></div><Link href="/luxusingatlan-ertekbecsles">Hogyan érdemes árat meghatározni? <Icon name="arrow" size={16}/></Link></article>
    <article className="kz10-presentation-editorial"><div className="kz10-presentation-photo"><img src={detailPhoto?.images?.[0]} alt={`${detailPhoto.title} – nyilvános hirdetési fotó`} loading="lazy"/><span>A KÍNÁLAT EGY MÁSIK INGATLANA</span></div><div><span className="kz10-mini-label">02 / PREZENTÁCIÓ</span><h3>A részletek építik a bizalmat.</h3><p>Az alaprajz, a műszaki tartalom és a térhasználat éppúgy része a bemutatásnak, mint a fotók.</p><Link href={`/ingatlan/${featured.slug}`}>Nézze meg az adatlapot <Icon name="arrow" size={16}/></Link></div></article>
    <article className="kz10-privacy-editorial"><span className="kz10-mini-label">03 / NYILVÁNOSSÁG</span><h3>Nem minden információ nyilvános.</h3><p>A pontos cím, az alaprajz és a részletes dokumentáció hozzáféréséről a tulajdonossal érdemes dönteni.</p><div className="kz10-privacy-levels"><div><b>01</b><span>Nyilvánosan megosztható</span></div><div><b>02</b><span>Egyeztetés után átadható</span></div><div><b>03</b><span>Bizalmas dokumentumok</span></div></div><Link href="/diszkret-ingatlanertekesites">A diszkréció lehetőségei <Icon name="arrow" size={16}/></Link></article></div>
  </section>

  <section className="kz10-close" aria-labelledby="close-heading"><div className="kz10-close-copy"><span className="kz10-eyebrow dark">KÖVETKEZŐ LÉPÉS</span><h2 id="close-heading">Először az ingatlanról beszéljünk. <em>Ne egy csomagról.</em></h2><p>Rövid, személyes egyeztetés keretében tisztázhatók a célok, az ingatlan különleges adottságai és a következő szakmai lépés. A pontos cím megadása az első üzenetben nem szükséges.</p><button type="button" className="kz10-button-primary" onClick={contact}>Kérek egy személyes egyeztetést <Icon name="arrow" size={18}/></button></div><div className="kz10-close-details"><span>AMIVEL ÉRDEMES KÉSZÜLNI</span>{['Az ingatlan hozzávetőleges elhelyezkedése','A kívánt értékesítési időtáv','A nyilvánossággal kapcsolatos elvárások'].map((x,i)=><div key={x}><b>0{i+1}</b><p>{x}</p></div>)}<small>A konzultáció kérése nem jelent megbízást vagy garantált értékesítési eredményt.</small></div></section>

  <section className="kz10-owner-faq"><div><span className="kz10-eyebrow dark">GYAKORI KÉRDÉSEK</span><h2>Mielőtt <em>belevágna.</em></h2></div><div>{questions.map(([question,answer],i)=><details key={question}><summary><span>0{i+1}</span>{question}<b aria-hidden="true">+</b></summary><p>{answer}</p></details>)}</div></section>
 </div>;
}
