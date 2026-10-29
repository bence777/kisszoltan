import React, {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import Icon from './Icons';
import {useApp,track} from './AppContext';
import {properties,fmtFt,fmtM} from '../data/properties';
import {areaFacts} from '../data/propertyQuality';

const sources=properties.filter(p=>p.price>0 && p.size>0 && p.type!=='Penthouse');
const money=n=>new Intl.NumberFormat('hu-HU',{maximumFractionDigits:0}).format(Math.round(n))+' Ft';
const million=n=>new Intl.NumberFormat('hu-HU',{maximumFractionDigits:1}).format(n/1e6)+' M Ft';

export function ValueExplorer({previewStep=1}){
 const {setModal}=useApp();
 const [step,setStep]=useState(previewStep);
 const [ref,setRef]=useState(sources[0]?.id);
 const [area,setArea]=useState(650);
 const [rooms,setRooms]=useState(6);
 const [quality,setQuality]=useState('Jó állapotú');
 const [features,setFeatures]=useState([]);
 const reference=sources.find(p=>p.id===ref)||sources[0];
 const [seenResult,setSeenResult]=useState(false);
 useEffect(()=>{
   const handler=e=>{
     const d=e.detail||{};
     const match=sources.find(p=>p.district===Number(d.district)&&(!d.type||p.type===d.type))||sources.find(p=>p.district===Number(d.district))||sources[0];
     if(match)setRef(match.id);
     if(Number(d.area)>0)setArea(Math.min(1500,Math.max(70,Number(d.area))));
     setStep(1);
     document.getElementById('ertekbecsles')?.scrollIntoView({behavior:'smooth',block:'start'});
   };
   window.addEventListener('kz:valuationPrefill',handler);
   return ()=>window.removeEventListener('kz:valuationPrefill',handler);
 },[]);
 const referenceUnit=reference.price/reference.size;
 const scale=area/reference.size;
 const comparable=scale>=.55&&scale<=1.45;
 const linear=referenceUnit*area;
 const lo=linear*.8,hi=linear*1.2;
 const toggle=label=>setFeatures(v=>v.includes(label)?v.filter(x=>x!==label):[...v,label]);
 const showResult=()=>{setSeenResult(true);setStep(3);track('valuation_result',{source:'listing_comparison_demo',reference_id:reference.id,area,comparable});};
 const contact=()=>{track('valuation_consultation_open',{reference_id:reference.id});setModal({type:'lead',kind:'seller',context:`Összehasonlító ingatlanérték-kalkulátor: ${area} m², ${rooms} szoba, ${quality}. Választott nyilvános hirdetés: ${reference.title} (${reference.id}). Kiemelt adottságok: ${features.length?features.join(', '):'nincs megadva'}. Kérek személyes értékmeghatározást.`});};
 return <section className="valuation-section kz-valuation-revival" id="ertekbecsles"><div className="container valuation-layout">
   <div className="valuation-copy">
    <div className="eyebrow light">03 <span className="dash"/> INTERAKTÍV ÉRTÉKIRÁNYTŰ</div>
    <h2>Mennyit érhet<br/><em>az Ön ingatlana?</em></h2>
    <p>Induljon el egy valós, nyilvánosan meghirdetett ingatlanból. Hasonlítsa össze a méretet és az adottságokat, majd nézze meg, milyen hirdetési ársáv adódik egy egyszerű arányosításból.</p>
    <div className="valuation-points">
     <div><Icon name="check" size={18}/><span>Azonnal látható számítás, regisztráció nélkül</span></div>
     <div><Icon name="check" size={18}/><span>Kiss Zoltán nyilvános hirdetési árai alapján</span></div>
     <div><Icon name="check" size={18}/><span>Ön dönti el, szeretne-e szakértői értékelést</span></div>
    </div>
    <div className="valuation-note"><span className="valuation-note-star">✳</span><span><strong>Fontos:</strong> ez hirdetésiár-összehasonlító demonstráció, nem értékbecslés. Egyetlen eladó ingatlan kínálati árából nem következtethető ki az Ön ingatlanának piaci értéke.</span></div>
    <div className="kz-value-sample"><span>NYILVÁNOS ÖSSZEHASONLÍTÁSI ALAP</span><strong>{reference.title}</strong><small>{reference.location} · {money(reference.price)} · {reference.size} m²</small><Link href={`/ingatlan/${reference.slug}`}>Ingatlan adatlapja <Icon name="arrow" size={15}/></Link></div>
   </div>
   <div className="valuation-card">
    <div className="valuation-progress"><div><span>INGATLANÉRTÉK-KALKULÁTOR</span><strong>0{step} / 03</strong></div><div className="progress-track"><span style={{width:`${step/3*100}%`}}/></div></div>
    {step===1?<>
      <span className="wizard-step-name">01 — Összehasonlítási alap</span><h3>Melyik ajánlathoz<br/>hasonlítaná?</h3>
      <p className="kz-wizard-lead">Válasszon a valóban meghirdetett ingatlanok közül. A különböző ingatlantípusok négyzetméterárai nem közvetlenül összehasonlíthatók.</p>
      <div className="kz-reference-list">{sources.map(p=><button type="button" key={p.id} className={`kz-reference-item ${ref===p.id?'selected':''}`} onClick={()=>{setRef(p.id);setArea(p.size);}} aria-pressed={ref===p.id}><span className="kz-ref-dot"/><span><strong>{p.title}</strong><small>{p.location} · {p.size} m² · {p.type}</small></span><b>{million(p.price)}</b></button>)}</div>
      <p className="kz-assumption">A penthouse eltérő belső és teraszterületi adatai miatt nem használható ehhez a m²-alapú összehasonlításhoz.</p>
      <button className="btn btn-primary btn-block" onClick={()=>setStep(2)}>Az ingatlanom adatai <Icon name="arrow"/></button>
    </>:step===2?<>
      <span className="wizard-step-name">02 — Saját ingatlan</span><h3>Miben hasonlít?<br/>Miben különbözik?</h3>
      <div className="calc-slider"><div className="slider-label"><span>Alapterület</span><strong>{area} m²</strong></div><input aria-label="Alapterület (négyzetméter)" type="range" min="70" max="1500" step="5" value={area} onChange={e=>setArea(Number(e.target.value))}/><div className="kz-numeric-input"><label htmlFor="kz-area-number">Pontos alapterület (m²)</label><input id="kz-area-number" type="number" min="70" max="1500" value={area} onChange={e=>setArea(Math.min(1500,Math.max(70,Number(e.target.value)||70)))}/></div></div>
      <div className="room-row"><span>Szobák száma</span><div className="counter"><button type="button" onClick={()=>setRooms(Math.max(1,rooms-1))} aria-label="Kevesebb szoba">−</button><strong>{rooms}</strong><button type="button" onClick={()=>setRooms(Math.min(30,rooms+1))} aria-label="Több szoba">+</button></div></div>
      <p className="field-label">Ingatlan állapota</p><div className="chip-group">{['Felújítandó','Jó állapotú','Felújított','Újszerű'].map(x=><button type="button" key={x} className={quality===x?'active':''} onClick={()=>setQuality(x)}>{x}</button>)}</div>
      <p className="field-label">Kiemelt adottságok</p><div className="chip-group">{['Panoráma','Nagy telek','Wellness','Garázs','Lift'].map(x=><button type="button" key={x} className={features.includes(x)?'active':''} onClick={()=>toggle(x)}>{features.includes(x)?'✓':'+'} {x}</button>)}</div>
      <p className="kz-assumption">A megjelölt extrák és az állapot nem kapnak kitalált százalékos felárat. Ezeket személyes értékmeghatározáskor külön kell mérlegelni.</p>
      <div className="wizard-actions"><button className="btn btn-quiet" onClick={()=>setStep(1)}><Icon name="left" size={15}/> Vissza</button><button className="btn btn-primary" onClick={showResult}>Összehasonlítás <Icon name="arrow" size={17}/></button></div>
    </>:<>
      <span className="wizard-step-name">03 — Szemléltető ársáv</span><h3>Ennyit mutat a<br/>választott referencia.</h3>
      {comparable?<><div className="estimate-result"><div>LINEÁRIS HIRDETÉSIÁR-ÖSSZEHASONLÍTÁS · ±20% SZEMLÉLTETŐ SÁV</div><strong>{million(lo)} <span>–</span> {million(hi)}</strong><small>Kiválasztott hirdetés egységára: {money(referenceUnit)}/m²</small></div><p className="valuation-explain">Ez <strong>nem piaci értékbecslés</strong> és nem eladási ár-előrejelzés. A sávot az itt látható egyetlen hirdetés kínálati m²-ára × {area} m² képlettel, ±20%-os szemléltető eltéréssel képeztük. A ±20% nem statisztikai konfidenciaszint.</p></>:<div className="kz-warning-state"><strong>Ez az ingatlan nem megfelelő méretű összehasonlítási alap.</strong><p>Az Ön által megadott {area} m² jelentősen eltér a kiválasztott hirdetés {reference.size} m²-étől. Nem adunk megtévesztő számszerű ársávot.</p></div>}
      <div className="estimate-details"><span>{area} m² · {rooms} szoba · {quality}</span><span>Referencia: {reference.id} · {reference.location}</span></div>
      <div className="kz-result-ctas"><button className="btn btn-primary btn-block" onClick={contact}>Személyes értékmeghatározást kérek <Icon name="arrow"/></button><button className="btn btn-quiet btn-block" onClick={()=>setStep(2)}><Icon name="left" size={15}/> Adatok módosítása</button></div>
    </>}
   </div>
 </div></section>
}

const grouped=properties.filter(p=>p.price>0&&p.size>0);
export function ListingAtlas({setFilters}){
 const [active,setActive]=useState(grouped[0]?.id);
 const listing=grouped.find(p=>p.id===active)||grouped[0];
 const priceM2=listing.price/listing.size;
 return <section className="section kz-atlas-section" id="piaci-osszehasonlitas"><div className="container">
   <div className="section-heading"><div><div className="eyebrow">04 <span className="dash"/> KÍNÁLATI ÁRKÖRKÉP</div><h2>Ne csak az árat nézze.<br/><em>Nézze az összefüggéseket.</em></h2></div><div className="section-right"><p>Valós, meghirdetett ingatlanok gyors összehasonlítása. Az adatok az ajánlatokról szólnak, nem Budapest teljes ingatlanpiacáról.</p></div></div>
   <div className="map-dashboard"><div className="map-main"><div className="map-heading"><div><span className="eyebrow">KISS ZOLTÁN · NYILVÁNOS KÍNÁLAT</span><h3>Válasszon egy ingatlant</h3></div><span className="kz-atlas-stat">{grouped.length} ajánlat</span></div>
   <div className="kz-atlas-list">{grouped.map(p=><button type="button" key={p.id} className={`kz-atlas-tile ${p.id===active?'active':''}`} onClick={()=>setActive(p.id)} aria-pressed={p.id===active}><span className="kz-atlas-location">{p.location}</span><strong>{p.type} · {p.size} m²</strong><small>{million(p.price)}</small></button>)}</div>
   <div className="map-footnote">Az árak hirdetési árak, nem lezárt tranzakciós adatok. A penthouse 170 m²-es listázott méretéhez külön belső- és teraszterületi adatok tartoznak; emiatt m²-alapú összevetésnél óvatosság szükséges. A kínálat időközben változhat.</div></div>
   <div className="map-panel"><div className="map-panel-top"><span className="eyebrow light">KIVÁLASZTOTT AJÁNLAT</span><Icon name="pin" size={24}/></div><h3 className="kz-atlas-type">{listing.type}</h3><div className="panel-price">{million(listing.price)}<small>nyilvános hirdetési ár</small></div><div className="map-panel-grid"><div><span>Listázott méret</span><strong>{listing.size} m²</strong></div><div><span>Szobák</span><strong>{listing.rooms}</strong></div></div><div className="kz-atlas-specific"><strong>{listing.title}</strong><p>{listing.location}</p><span>{!areaFacts(listing).unitRateAllowed?'A hirdetésben szereplő terület definíciója még nem jóváhagyott; nem közlünk rá megtévesztő m²-árat.':`Hirdetési ár / igazolt m²: ${money(priceM2)}`}</span></div><Link href={`/ingatlan/${listing.slug}`} className="btn btn-primary btn-block">Részletes adatlap <Icon name="arrow" size={17}/></Link></div>
   </div></div></section>
}
