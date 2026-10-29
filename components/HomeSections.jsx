import React,{useEffect,useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import Icon from './Icons';
import {useApp,track} from './AppContext';
import {PropertyCard,ImageWithFallback} from './GlobalUI';
import {agents,properties,districtData,fmtFt,fmtM,findDistrict} from '../data/properties';
import {submitLead,fallbackLeadHref} from '../lib/leads';
import {LeadConsent,LeadStatus} from './LeadStatus';
const go=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});


export function Hero({filters,setFilters,items=properties}){const {setModal}=useApp();
const [tab,setTab]=useState('seller'),[district,setDistrict]=useState('2'),[type,setType]=useState(''),[area,setArea]=useState('650'),[budget,setBudget]=useState('2500');
const count=items.filter(p=>(!district||p.district===Number(district))&&(!type||p.type===type)&&p.price<=Number(budget)*1e6).length;
const seller=()=>{track('valuation_start',{origin:'hero',district,type,area});window.dispatchEvent(new CustomEvent('kz:valuationPrefill',{detail:{district,type,area}}));go('ertekbecsles')};
const buyer=()=>{setFilters(o=>({...o,district,type,maxPrice:Number(budget)*1e6}));track('search',{origin:'hero',district,type,budget});go('ingatlanok')};
return <section className="hero" id="top">
<div className="hero-image" aria-hidden="true"/>
<div className="hero-decoration"/>
<div className="container hero-inner">
<div className="hero-content">
<div className="hero-eyebrow">
<span className="eyebrow-line"/>BUDAPEST ÉS AGGLOMERÁCIÓ · KISS ZOLTÁN</div>
<h1>Kivételes<br/>ingatlanok.<br/>Nagy érték. <em>Diszkrét<br/>képviselet.</em>
</h1>
<p className="hero-lead">A több százmilliós vagy akár milliárdos ingatlanok értékesítése különleges figyelmet igényel. Egyedi árazással, célzott vevőeléréssel és személyes képviselettel vezetem végig a teljes folyamatot.</p>
<div className="hero-proof">
<div>
<strong>01 /</strong>
<span>Piaci összehasonlító elemzés</span>
</div>
<div>
<strong>02 /</strong>
<span>Személyes kapcsolattartás</span>
</div>
<div>
<strong>03 /</strong>
<span>Értékesítés a birtokbaadásig</span>
</div>
</div>
</div>
<div className="intent-card">
<div className="intent-tabs" role="tablist">
<button role="tab" aria-selected={tab==='seller'} className={tab==='seller'?'active':''} onClick={()=>setTab('seller')}>Eladnék</button>
<button role="tab" aria-selected={tab==='buyer'} className={tab==='buyer'?'active':''} onClick={()=>setTab('buyer')}>Vásárolnék</button>
</div>
<div className="intent-fields">
<label>
<span>KERÜLET</span>
<select value={district} onChange={e=>setDistrict(e.target.value)}>
<option value="">Bármely kerület</option>{districtData.map(d=>
<option key={d.id} value={d.id}>{d.name} kerület</option>)}</select>
</label>
<label>
<span>INGATLAN TÍPUSA</span>
<select value={type} onChange={e=>setType(e.target.value)}>
<option value="">Bármilyen</option>
<option>Villa</option>
<option>Rezidencia</option>
<option>Penthouse</option>
</select>
</label>{tab==='seller'?<label>
<span>ALAPTERÜLET</span>
<div className="field-suffix">
<input type="number" min="150" max="2500" value={area} onChange={e=>setArea(e.target.value)}/>
<span>m²</span>
</div>
</label>:<label>
<span>MAXIMÁLIS KERET</span>
<div className="field-suffix">
<input type="number" min="250" max="5000" value={budget} onChange={e=>setBudget(e.target.value)}/>
<span>M Ft</span>
</div>
</label>}<button className="btn btn-primary intent-submit" onClick={tab==='seller'?seller:buyer}>{tab==='seller'?'Online értékiránytű':`${count} ingatlan megtekintése`} <Icon name="arrow" size={19}/>
</button>
</div>
<div className="intent-footer">
<span>
<Icon name="shield" size={15}/> {tab==='seller'?'Előzetes összehasonlítás, elérhetőség nélkül':'Szűrjön néhány másodperc alatt'}</span>
<span>EGYSZERŰ · DISZKRÉT · SZEMÉLYES</span>
</div>
</div>
</div>
<div className="hero-bottom">
<div className="container">
<span>AZ ÖN INGATLANÁHOZ ILLŐ STRATÉGIA</span>
<span>GÖRGESSEN TOVÁBB <span>↓</span>
</span>
</div>
</div>
</section>}


export function Proof(){return <section className="proof-section">
<div className="container">
<div className="proof-top">
<span className="eyebrow">MÉRHETŐ SZAKMAI HÁTTÉR</span>
<p>Nem gyors ígéretekben hiszek. <strong>A megfelelő árban, a tudatos értékesítési tervben és az ügyfél teljes körű képviseletében.</strong>
</p>
</div>
<div className="proof-stats">{[['980 m²','kiemelt törökvészi rezidencia'],['2,187 Mrd','Ft hirdetési ár'],['3','értékesítési csomag'],['1','személyes kapcsolattartó']].map(([num,label])=>
<div key={label} className="proof-stat">
<strong>{num}<span></span>
</strong>
<span>{label}</span>
</div>)}</div>
<p className="sample-note">A bemutatott törökvészi ingatlan alapterülete és hirdetési ára a kisszoltan.com nyilvános adatlapján szerepel.</p>
</div>
</section>}


export function Listings({filters,setFilters,items=properties}){const {setModal}=useApp();
const [sort,setSort]=useState('recommended'),[minRooms,setMinRooms]=useState('0'),[threeD,setThreeD]=useState(false),[expanded,setExpanded]=useState(false);
const matches=useMemo(()=>{let itemsFiltered=items.filter(p=>(!filters.type||p.type===filters.type)&&(!filters.district||p.district===Number(filters.district))&&(!filters.maxPrice||p.price<=Number(filters.maxPrice))&&p.rooms>=Number(minRooms)&&(!threeD||p.threeD));
if(sort==='priceLow')itemsFiltered.sort((a,b)=>a.price-b.price);
if(sort==='priceHigh')itemsFiltered.sort((a,b)=>b.price-a.price);
if(sort==='area')itemsFiltered.sort((a,b)=>b.size-a.size);
return itemsFiltered;},[items,filters,sort,minRooms,threeD]);
const reset=()=>{setFilters({type:'',district:'',maxPrice:0});setMinRooms('0');setThreeD(false);setSort('recommended')};
return <section id="ingatlanok" className="section listings-section">
<div className="container">
<div className="section-heading">
<div>
<div className="eyebrow">01 <span className="dash"/> VÁLOGATOTT INGATLANOK</div>
<h2>Ingatlanok, amelyek<br/>
<em>túlmutatnak az átlagon.</em>
</h2>
</div>
<div className="section-right">
<p>Válogatás Kiss Zoltán nagy értékű, nyilvánosan meghirdetett ingatlanaiból. Az árak és az elérhetőség minden esetben egyeztetendők.</p>
<button className="text-link" onClick={()=>setExpanded(!expanded)}>{expanded?'Kevesebb szűrő':'Részletes keresés'} <Icon name="filter" size={18}/>
</button>
</div>
</div>
<div className="listings-filter">
<div className="filter-switch">
<button className={!filters.type?'active':''} onClick={()=>setFilters(o=>({...o,type:''}))}>Összes</button>
<button className={filters.type==='Villa'?'active':''} onClick={()=>setFilters(o=>({...o,type:'Villa'}))}>Villák</button>
<button className={filters.type==='Rezidencia'?'active':''} onClick={()=>setFilters(o=>({...o,type:'Rezidencia'}))}>Rezidenciák</button>
</div>
<div className="filter-controls">
<select aria-label="Kerület" value={filters.district||''} onChange={e=>setFilters(o=>({...o,district:e.target.value}))}>
<option value="">Minden kerület</option>{districtData.map(d=>
<option key={d.id} value={d.id}>{d.name} kerület</option>)}</select>
<select aria-label="Rendezés" value={sort} onChange={e=>setSort(e.target.value)}>
<option value="recommended">Ajánlott sorrend</option>
<option value="priceLow">Ár szerint ↑</option>
<option value="priceHigh">Ár szerint ↓</option>
<option value="area">Alapterület szerint</option>
</select>
</div>
</div>{expanded&&<div className="expanded-filters">
<label>Maximum ár <select value={filters.maxPrice||''} onChange={e=>setFilters(o=>({...o,maxPrice:Number(e.target.value)}))}>
<option value="">Bármennyi</option>{[350,500,750,1000,2500,5000].map(n=>
<option key={n} value={n*1e6}>{n} M Ft</option>)}</select>
</label>
<label>Minimum szobaszám <select value={minRooms} onChange={e=>setMinRooms(e.target.value)}>{[0,2,3,4,5].map(n=>
<option key={n} value={n}>{n||'Bármennyi'}</option>)}</select>
</label>
<label className="toggle-option">
<input type="checkbox" checked={threeD} onChange={e=>setThreeD(e.target.checked)}/> 3D séta jelöléssel (ha elérhető)</label>
<button className="filter-reset" onClick={reset}>Szűrők törlése <Icon name="close" size={15}/>
</button>
</div>}<div className="listings-result">
<span>
<strong>{matches.length}</strong> ingatlan a bemutató kínálatban</span>
<span>A hirdetések a bemutató készítésének időpontját tükrözik</span>
</div>{matches.length?<div className="property-grid">{matches.map((p,i)=>
<PropertyCard p={p} key={p.id} index={i}/>)}</div>:<div className="no-results">
<Icon name="search" size={34}/>
<h3>Erre most nincs találat.</h3>
<p>Állítsa vissza a szűrőket, vagy kérjen értesítést új ingatlanokról.</p>
<button className="btn btn-dark" onClick={reset}>Összes ingatlan mutatása</button>
</div>}<SearchAlert filters={filters}/>
</div>
</section>}


function SearchAlert(){const {setModal}=useApp();return <div className="alert-band"><div className="alert-art"/><div className="alert-copy"><div className="eyebrow light">SZEMÉLYES AJÁNLATKÉRÉS</div><h3>A kivételes ingatlanok<br/><em>ritkán kerülnek piacra.</em></h3><p>Ha különleges ingatlant keres, személyesen egyeztetheti az igényeit Kiss Zoltánnal.</p></div><div className="alert-form"><button type="button" className="btn btn-primary btn-block" onClick={()=>setModal({type:'lead',kind:'buyer',context:'Szeretnék személyesen egyeztetni a prémium ingatlankínálatról.'})}>Személyes ajánlatot kérek <Icon name="arrow"/></button><span className="form-note">E-mailes érdeklődés, nem automatikus értesítő.</span></div></div>}


export function Method(){const {setModal}=useApp();
const steps=[['01','Megértjük','Az ingatlan egyedi adottságait és a tulajdonosi célokat részletesen feltérképezem.', 'https://kisszoltan.com/images/DSCF1568.jpg'],['02','Megtervezzük','Álomár, reális ár, pesszimista ár: több forgatókönyvből építem fel a stratégiát.','https://kisszoltan.com/images/11_fotjpg.jpg'],['03','Megmutatjuk','Prémium bemutatóanyagokkal és a megfelelő vevői körre szabott kommunikációval dolgozom.','https://kisszoltan.com/images/29Hmes_utca.jpg'],['04','Végigvisszük','Diszkrét vevőminősítés, személyes tárgyalás és ügyintézés a birtokbaadásig.','https://kisszoltan.com/images/2profiljpg.jpg']];
return <section id="modszer" className="section method-section">
<div className="container">
<div className="section-heading">
<div>
<div className="eyebrow">02 <span className="dash"/> KISS ZOLTÁN MÓDSZERE</div>
<h2>Nem csak hirdetek.<br/>
<em>Értékesítési stratégiát építek.</em>
</h2>
</div>
<div className="section-right">
<p>Minden ingatlanhoz személyre szabott tervet készítek: piacfelmérés, árazás, professzionális bemutatás, vevők felkutatása és utánkövetése.</p>
</div>
</div>
<div className="method-grid">{steps.map(([n,t,d,img])=>
<div className="method-step" key={n}>
<div className="method-img">
<ImageWithFallback src={img} alt={`Fotó Kiss Zoltán ingatlankínálatából – ${t}`}/>
<span>{n}</span>
</div>
<h3>{t}</h3>
<p>{d}</p>
</div>)}</div>
<div className="method-benefits">
<div>
<Icon name="shield" size={25}/>
<h4>Átlátható díjazás</h4>
<p>A szolgáltatási díjakat és a megbízás feltételeit személyes egyeztetésen tisztázzuk.</p>
</div>
<div>
<Icon name="chart" size={25}/>
<h4>Megtervezett értékesítés</h4>
<p>Piaci adatok, gondos előkészítés és követhető döntési pontok – felesleges körök nélkül.</p>
</div>
<div>
<Icon name="home" size={25}/>
<h4>Felkészítési lehetőségek</h4>
<p>A különleges ingatlanok bemutatása személyre szabott vizuális és marketingelőkészítést igényel.</p>
</div>
</div>
<div className="net-container">
<NetCalculator/>
</div>
<div className="section-cta">
<span>Minden ingatlan más. Az első lépés az ingatlan adottságainak megértése.</span>
<button className="text-link" onClick={()=>go('ertekbecsles')}>Próbálja ki az érték-kalkulátort <Icon name="arrow"/>
</button>
</div>
</div>
</section>}


export function NetCalculator(){
 const [price,setPrice]=useState(650);
 const [rate,setRate]=useState(2.5);
 const [months,setMonths]=useState(3);
 const [running,setRunning]=useState(240);
 const gross=price*1e6;
 const exampleFee=gross*(rate/100);
 const ownership=months*running*1000;
 const remaining=gross-exampleFee-ownership;
 return <div className="net-calculator kz-proceeds-calculator">
   <div className="net-intro"><div className="eyebrow">PÉNZÜGYI FORGATÓKÖNYV</div>
    <h3>Mennyi maradhat<br/><em>az értékesítés után?</em></h3>
    <p>Állítsa be a tervezett hirdetési árat, a lehetséges közvetítői díjat és a tartási költségeket. A számítás az Ön feltételezéseit mutatja, nem Kiss Zoltán díjajánlata.</p>
    <div className="calc-slider"><div className="slider-label"><span>Feltételezett eladási ár</span><strong>{price.toLocaleString('hu-HU')} M Ft</strong></div><input aria-label="Feltételezett eladási ár" type="range" min="100" max="3000" step="25" value={price} onChange={e=>setPrice(Number(e.target.value))}/></div>
    <div className="calc-slider"><div className="slider-label"><span>Ön által megadott díj (%)</span><strong>{rate.toLocaleString('hu-HU')}%</strong></div><input aria-label="Példaként megadott közvetítői díj" type="range" min="0" max="6" step="0.1" value={rate} onChange={e=>setRate(Number(e.target.value))}/></div>
    <div className="calc-slider"><div className="slider-label"><span>Tervezett további hónapok</span><strong>{months} hó</strong></div><input aria-label="További tartási hónapok" type="range" min="0" max="18" step="1" value={months} onChange={e=>setMonths(Number(e.target.value))}/></div>
    <div className="calc-slider"><div className="slider-label"><span>Havi tartási költség</span><strong>{fmtFt(running*1000)}</strong></div><input aria-label="Havi tartási költség" type="range" min="0" max="1000" step="20" value={running} onChange={e=>setRunning(Number(e.target.value))}/></div>
   </div>
   <div className="net-sheet"><div className="sheet-kicker">SZEMLÉLTETŐ PÉLDASZÁMÍTÁS <span>AZ ÖN FELTÉTELEZÉSEI</span></div>
    <div className="sheet-row"><span>Feltételezett eladási ár</span><strong>{fmtFt(gross)}</strong></div>
    <div className="sheet-row"><span>Beállított díj ({rate.toLocaleString('hu-HU')}%)</span><strong>− {fmtFt(exampleFee)}</strong></div>
    <div className="sheet-row"><span>Fennmaradó tartási költség</span><strong>− {fmtFt(ownership)}</strong></div>
    <div className="sheet-rule"/><div className="sheet-total"><span>Elméleti különbözet*</span><strong>{fmtM(remaining)}</strong></div>
    <p>* Nem tartalmazza az esetleges áfát, adót, hitelterheket, illetékeket, egyéb tranzakciós tételeket. A tényleges közvetítői díj és feltételek nincsenek megállapítva. Nem pénzügyi tanácsadás és nem garantált eredmény.</p>
   </div>
 </div>
}


export function Team(){const {setModal}=useApp();
const offers=[['01','Standard','Piaci összehasonlító elemzés, hirdetési árjavaslat, alaprajz és havi stratégiai konzultáció.','/standard'],['02','Prémium','Három értékesítési stratégia, profi fotó és videó, hirdetéskiemelés és saját ingatlanoldal.','/premium-csomag'],['03','Exclusive','Home staging, brossúra, egyedi bemutatóvideó, kiemelt hirdetések és havi riportok.','/exclusive-csomag']];
return <section id="csapat" className="section team-section kz-services-section">
<div className="container">
<div className="section-heading">
<div>
<div className="eyebrow">07 <span className="dash"/> AZ ÖN IGÉNYEIHEZ IGAZÍTVA</div>
<h2>Több százmilliós értékekhez<br/>
<em>személyes képviselet.</em>
</h2>
</div>
<div className="section-right">
<p>Nagy értékű ingatlanoknál a személyes jelenlét, a vevők gondos kiválasztása és a diszkréció különösen fontos.</p>
</div>
</div>
<div className="kz-services-grid">
<div className="kz-expert">
<div className="kz-expert-photo">
<ImageWithFallback src="https://ot.ingatlancdn.com/logo/referenshd/r_82613_0.jpg?v=20260212110024" alt="Kiss Zoltán szakmai portré"/>
</div>
<span>AZ ÖN INGATLANSZAKÉRTŐJE</span>
<h3>Kiss Zoltán</h3>
<p>Ingatlanértékesítési szakértő · Budapest és agglomeráció</p>
<button className="text-link" onClick={()=>setModal({type:'lead',context:'Kiss Zoltánnal szeretnék személyes konzultációt.'})}>Beszéljünk <Icon name="arrow" size={17}/>
</button>
</div>{offers.map(([n,title,desc,url])=>
<article className="kz-service-card" key={n}>
<span>{n} / SZOLGÁLTATÁSI CSOMAG</span>
<h3>{title}</h3>
<p>{desc}</p>
<Link href={url}>Csomag részletei <Icon name="arrow" size={18}/>
</Link>
</article>)}</div>
</div>
</section>}


export function Testimonial(){return <section className="testimonial-section">
<div className="container testimonial-layout">
<div>
<div className="eyebrow light">SZAKMAI HITVALLÁS</div>
<h2>Nem négyzetmétereket.<br/>
<em>Értéket képviselek.</em>
</h2>
<span className="testimonial-label">KISS ZOLTÁN · INGATLANÉRTÉKESÍTÉS</span>
</div>
<div className="quote-block">
<div className="quote-mark">“</div>
<blockquote>A különleges ingatlanoknál az árstratégia, a valódi vevői igények és a személyes képviselet együtt alakítják az értékesítést.</blockquote>
<div className="quote-footer">
<span>A személyes képviselet szemlélete</span>
</div>
</div>
</div>
</section>}


export function FAQ(){const {setModal}=useApp();
const qs=[['Milyen szolgáltatási csomagok közül választhatok?','Standard, Prémium és Exclusive csomagok érhetők el. Az egyes csomagok az értékesítési stratégia, a marketingeszközök és a kapcsolattartás gyakorisága szerint különböznek.'],['Hogyan határozza meg az ingatlan árát?','Személyes megtekintés, piaci összehasonlító elemzés és az élethelyzetéhez illeszkedő értékesítési stratégia alapján.'],['A Prémium csomagban van profi fotózás?','Igen. A kisszoltan.com nyilvános Prémium csomagleírása profi fotózást, videós bemutatót, kiemelt hirdetéseket és saját ingatlanoldalt sorol fel. Az aktuális feltételek személyesen egyeztethetők.'],['Mit nyújt az Exclusive csomag?','A Prémium megoldásokon túl egyedi marketingvideót, home staginget, brossúrát és célzott Facebook-, Instagram- és Google-hirdetéseket.'],['Mennyi az ingatlanközvetítés díja?','A pontos megbízási és díjazási feltételeket Kiss Zoltánnal, személyes konzultáción érdemes egyeztetni. A szolgáltatási díjazásról személyes tájékoztatást kérhet.'],['Hogyan kérhetek ingatlanmegtekintést?','Telefonon vagy e-mailben veheti fel a kapcsolatot Kiss Zoltánnal. Az érdeklődés e-mailben vagy telefonon történik; online időpontkiosztás jelenleg nincs.']];
const [open,setOpen]=useState(0);
return <section id="gyik" className="section faq-section">
<div className="container faq-layout">
<div>
<div className="eyebrow">08 <span className="dash"/> GYAKORI KÉRDÉSEK</div>
<h2>Amit érdemes<br/>
<em>előre tisztázni.</em>
</h2>
<p>A csomagok, az értékesítési stratégia és a kapcsolattartás legfontosabb kérdései.</p>
<button className="text-link" onClick={()=>setModal({type:'lead',context:'Kérdésem lenne Kiss Zoltán szolgáltatásairól.'})}>Személyes kérdésem van <Icon name="arrow"/>
</button>
</div>
<div className="faq-items">{qs.map(([q,a],i)=>
<div className={`faq-item ${open===i?'open':''}`} key={q}>
<button aria-expanded={open===i} onClick={()=>setOpen(open===i?-1:i)}>
<span>
<small>0{i+1}</small>{q}</span>
<span className="faq-plus">{open===i?'−':'+'}</span>
</button>{open===i&&<p>{a}</p>}</div>)}</div>
</div>
</section>}


export function Contact(){const started=useRef(false);const [topic,setTopic]=useState('Eladnék'),[name,setName]=useState(''),[phone,setPhone]=useState(''),[email,setEmail]=useState(''),[message,setMessage]=useState(''),[consent,setConsent]=useState(false),[loading,setLoading]=useState(false),[sent,setSent]=useState(false),[deliveryDelayed,setDeliveryDelayed]=useState(false),[error,setError]=useState(''),[website,setWebsite]=useState('');
const details={kind:['Eladnék','Értékbecslés'].includes(topic)?'seller':topic==='Vásárolnék'?'buyer':'general',type:topic,name,phone,email,message,consent,website};
const send=async e=>{e.preventDefault();if(loading)return;setLoading(true);setError('');track('lead_form_submit',{origin:'contact',topic});try{const result=await submitLead(details);setDeliveryDelayed(Boolean(result.notificationDelayed));setSent(true)}catch(e){setError(e.message);track('lead_submit_error',{origin:'contact'})}finally{setLoading(false)}};
return <section id="kapcsolat" className="section contact-section">
<div className="container contact-layout">
<div className="contact-copy">
<div className="eyebrow">09 <span className="dash"/> LÉPJÜNK KAPCSOLATBA</div>
<h2>Beszéljünk az<br/>
<em>ingatlanáról.</em>
</h2>
<p>Legyen szó kivételes villáról, exkluzív rezidenciáról vagy kiemelt értékű befektetésről, az első beszélgetés a részletekről szól.</p>
<div className="contact-lines">
<div>
<Icon name="phone" size={21}/>
<div>
<small>TELEFON</small>
<a href="tel:+36709057683" onClick={()=>track('phone_click',{origin:'contact'})}>+36 70 905 7683</a>
</div>
</div>
<div>
<Icon name="mail" size={21}/>
<div>
<small>E-MAIL</small>
<a href="mailto:ingatlan@kisszoltan.com">ingatlan@kisszoltan.com</a>
</div>
</div>
<div>
<Icon name="pin" size={21}/>
<div>
<small>TERÜLET</small>
<span>Budapest és az agglomeráció</span>
</div>
</div>
</div>
<div className="office-status">
<span className="live-dot"/> Személyes konzultáció előzetes egyeztetéssel</div>
</div>
<div className="contact-form">
<div className="contact-form-head">
<span>ÍRJON KISS ZOLTÁNNAK</span>
<span>EGYSZERŰ · KÖTETLEN</span>
</div>
<form onFocusCapture={()=>{if(!started.current){started.current=true;track(topic==='Vásárolnék'?'buyer_form_start':'seller_form_start',{form:'contact'});}}} onSubmit={send}><label className="kz-honeypot" aria-hidden="true">Weboldal<input tabIndex="-1" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label>
<p className="field-label">Miben segíthetek?</p>
<div className="chip-group">{['Eladnék','Vásárolnék','Értékbecslés','Más kérdés'].map(x=>
<button className={topic===x?'active':''} type="button" key={x} onClick={()=>setTopic(x)}>{x}</button>)}</div>
<div className="input-two">
<label>Név<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Teljes név"/>
</label>
<label>Telefonszám<input type="tel" required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+36 30 ..."/>
</label>
</div>
<label>E-mail-cím<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="nev@pelda.hu"/>
</label>
<label>Üzenet<textarea required rows="4" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Miben segíthetek?"/>
</label>
<LeadConsent checked={consent} onChange={setConsent}/><LeadStatus loading={loading} sent={sent} error={error} delayed={deliveryDelayed} fallbackHref={fallbackLeadHref(details)}/>
<button type="submit" disabled={loading||sent} className="btn btn-primary btn-block">{sent?"Üzenet elküldve":loading?"Küldés…":"Üzenet küldése"} <Icon name="arrow"/>
</button>
</form>
</div>
</div>
</section>}
