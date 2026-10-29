import React,{useMemo,useState} from 'react';
import Link from 'next/link';
import {districtMarket,districtSources} from '../data/kshBudapest';
import Icon from './Icons';

const types=[['all','Összes lakástípus'],['apartment','Társasházi lakás'],['house','Családi ház'],['panel','Panel']];
const roman=n=>{const r=['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII'];return r[n]};
const fmt=n=>typeof n==='number'?new Intl.NumberFormat('hu-HU').format(n):'—';
const price=n=>n===null?'Nincs adat':`${fmt(n*1000)} Ft/m²`;
function Tile({district,active,setActive,type,mode}){
 const record=district[type];const result=mode==='transactions'?record.count:mode==='change'?(type==='all'?Math.round((record.price/district.previous-1)*1000)/10:null):record.price;
 const light=record.price!==null ? Math.max(.13,Math.min(.55,(record.price-600)/1500)) : 0;
 return <button type="button" className={`kz-market-tile ${active===district.id?'is-active':''}`} onClick={()=>setActive(district.id)} aria-pressed={active===district.id} aria-label={`${roman(district.id)}. kerület, ${district.name}: ${price(record.price)}, ${record.count} adásvétel`} style={{'--tile-opacity':light}}>
 <span className="kz-market-roman">{roman(district.id)}</span><span className="kz-market-tile-data">{result===null?'—':mode==='transactions'?`${fmt(result)} db`:mode==='change'?`${result>0?'+':''}${result.toLocaleString('hu-HU')}%`:`${fmt(result)} e`}</span>
 </button>;
}
export default function DistrictMarket(){
 const [active,setActive]=useState(2),[type,setType]=useState('all'),[mode,setMode]=useState('price');
 const selected=districtMarket.find(d=>d.id===active)||districtMarket[1];
 const selectedType=selected[type];
 const yearChange=+(100*(selected.all.price/selected.previous-1)).toFixed(1);
 const buda=useMemo(()=>districtMarket.filter(x=>x.group==='Buda'),[]);
 const pest=useMemo(()=>districtMarket.filter(x=>x.group==='Pest'),[]);
 function chooseType(next){setType(next);if(next!=='all'&&mode==='change')setMode('price')}
 return <section id="keruleti-arterkep" className="kz-market-section"><div className="container">
 <div className="kz-market-heading"><div><span className="eyebrow">04 <span className="dash"/> KSH · BUDAPESTI INGATLANPIAC</span><h2>Budapest értéktérképe.<br/><em>Kerületenként, valódi adatokkal.</em></h2></div><p>Nem kitalált átlagárak. A KSH adásvételek alapján közölt kerületi adatait böngészheti — külön a társasházakra, házakra és panelekre.</p></div>
 <div className="kz-market-fresh"><div><span>LEGUTÓBBI FŐVÁROSI NEGYEDÉVES ADAT · KSH</span><strong>~1,2 millió Ft/m²</strong><small>Budapesti használt lakások átlagára · 2026. I. negyedév, nem kerületi bontás</small></div><div className="kz-market-fresh-divider"/><div><span>A KERÜLETI TÉRKÉP ADATÉVE</span><strong>2024</strong><small>A 2024-es lezárt adásvételek — nem 2026-os árbecslések</small></div><a href={districtSources.latest} target="_blank" rel="noopener noreferrer">2026-os KSH jelentés <Icon name="arrow" size={16}/></a></div>
 <div className="kz-market-layout">
 <div className="kz-market-main"><div className="kz-market-toolbar"><div className="kz-market-tabs" role="tablist" aria-label="Megjelenített mutató">
 <button role="tab" aria-selected={mode==='price'} className={mode==='price'?'selected':''} onClick={()=>setMode('price')}>Ft/m²</button>
 <button role="tab" aria-selected={mode==='transactions'} className={mode==='transactions'?'selected':''} onClick={()=>setMode('transactions')}>Adásvételek</button>
 <button role="tab" aria-selected={mode==='change'} disabled={type!=='all'} className={mode==='change'?'selected':''} onClick={()=>setMode('change')}>2023 → 2024</button>
 </div><span>KERÜLET VÁLASZTÁSA ↓</span></div>
 <div className="kz-market-type-switch"><label htmlFor="market-type">INGATLANTÍPUS</label><select id="market-type" value={type} onChange={e=>chooseType(e.target.value)}>{types.map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></div>
 <div className="kz-market-mosaic"><div className="kz-market-buda"><span className="kz-market-region">BUDA · 6 KERÜLET</span><div className="kz-market-grid kz-market-grid-buda">{buda.map(d=><Tile key={d.id} district={d} active={active} setActive={setActive} type={type} mode={mode}/>)}</div></div><div className="kz-market-river" aria-label="Duna"><span>DUNA</span></div><div className="kz-market-pest"><span className="kz-market-region">PEST · 17 KERÜLET</span><div className="kz-market-grid kz-market-grid-pest">{pest.map(d=><Tile key={d.id} district={d} active={active} setActive={setActive} type={type} mode={mode}/>)}</div></div></div>
 <div className="kz-market-legend"><span>Az ábrán a sötétebb szín a magasabb 2024-es átlagárat jelzi. Ez kerületi mozaik, nem méretarányos térkép.</span><a href={districtSources.historical} target="_blank" rel="noopener noreferrer">KSH-adatsor ↗</a></div>
 </div>
 <aside className="kz-market-panel"><div className="kz-market-panel-top"><span>KIVÁLASZTOTT KERÜLET</span><Icon name="pin" size={23}/></div><span className="kz-market-panel-district">{roman(selected.id)}. kerület</span><h3>{selected.name}</h3><p>{types.find(t=>t[0]===type)?.[1]} · 2024, KSH</p>
 <div className="kz-market-panel-price"><span>TÉNYLEGES ADÁSVÉTELEK ÁTLAGÁRA</span><strong>{selectedType.price!==null?`${(selectedType.price/1000).toLocaleString('hu-HU',{maximumFractionDigits:3})} M`:'—'}</strong><small>{selectedType.price===null?'Nincs közzétett adat':'Ft/m² · 2024'}</small></div>
 <div className="kz-market-panel-metrics"><div><span>Megfigyelt adásvétel</span><strong>{fmt(selectedType.count)} db</strong></div><div><span>2024 vs. 2023 · összes típus</span><strong>{yearChange>0?'+':''}{yearChange.toLocaleString('hu-HU')}%</strong></div><div><span>Összes lakástípus árszint</span><strong>{fmt(selected.all.price)} e Ft/m²</strong></div></div>
 <p className="kz-market-panel-context">Az adatok magánszemélyek között lezárt lakóingatlan-adásvételekre épülnek. <strong>Nem azonosak a luxusvillák áraival</strong>, a jelenlegi kínálati árakkal vagy egy konkrét ingatlan értékével.</p>
 <a className="btn btn-primary btn-block" href={districtSources.historical} target="_blank" rel="noopener noreferrer">Ellenőrzés a KSH-nál <Icon name="arrow" size={16}/></a>
 </aside></div>
 <div className="kz-market-closing"><div><span>MIÉRT SZÁMÍT A KONTEXTUS?</span><h3>Egy kerületi átlag nem mondja meg, mennyit ér egy különleges villa.</h3></div><p>A méret, telek, állapot, építészeti minőség és mikrolokáció külön vizsgálatot igényel. Az értékkalkulátor tájékoztató összehasonlításra való; a személyes értékmeghatározás más műfaj.</p><Link href="/luxusingatlan-ertekbecsles">Értékmeghatározásról bővebben <Icon name="arrow" size={17}/></Link></div>
 </div></section>;
}
