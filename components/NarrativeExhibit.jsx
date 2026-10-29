import React from 'react';
import Link from 'next/link';
import {properties} from '../data/properties';
import Icon from './Icons';
const money=n=>new Intl.NumberFormat('hu-HU',{maximumFractionDigits:2}).format(n/1000000);
export default function NarrativeExhibit({slug}){
 if(slug==='eladni-szeretnek')return <aside className="kz9-narrative-exhibit kz9-exhibit-selling" aria-label="Eladói döntési szempontok"><span>AZ ÉRTÉKESÍTÉS KÉT KÉRDÉSE</span><div><b>01</b><strong>Kinek mutatjuk meg?</strong><p>Nyilvános érdeklődői kör vagy célzott, személyes megkeresések?</p></div><div><b>02</b><strong>Mennyit mutatunk meg?</strong><p>Mely fotók, pontos lokációs adatok és dokumentumok publikálhatók?</p></div><Link href="/diszkret-ingatlanertekesites">A diszkrét értékesítés szempontjai <Icon name="arrow" size={16}/></Link></aside>;
 if(slug==='luxusingatlan-ertekbecsles'){
  const ids=['KZ-001','KZ-004'];const list=ids.map(id=>properties.find(p=>p.id===id)).filter(Boolean);
  return <aside className="kz9-narrative-exhibit kz9-exhibit-prices" aria-label="Két hirdetés összehasonlítása"><span>KÉT NYILVÁNOS HIRDETÉSI ÁR · NEM TRANZAKCIÓ</span><div className="kz9-exhibit-price-rows">{list.map(p=><div key={p.id}><strong>{p.title}</strong><span>{p.size} m² · {money(p.price)} M Ft</span><b>{money(p.price/p.size)} M Ft/m²</b></div>)}</div><p>Az eltérő adottságú ingatlanok kínálati négyzetméterára nem jelent közvetlen értékbecslést. A pontos területdefiníciókat külön kell ellenőrizni.</p></aside>;
 }
 if(slug==='diszkret-ingatlanertekesites')return <aside className="kz9-narrative-exhibit kz9-exhibit-information" aria-label="Publikus és bizalmas információk"><span>NYILVÁNOS ADATLAP VS. SZEMÉLYES TÁJÉKOZTATÁS</span><div><strong>Publikálható lehet</strong><p>Ingatlantípus, kerület vagy városrész, jóváhagyott fotók és ellenőrzött alapadatok.</p></div><div><strong>Egyeztetést igényel</strong><p>Pontos cím, érzékeny alaprajzok, műszaki dokumentumok és a megtekintés feltételei.</p></div><small>Nem kötelező szabály, hanem a tulajdonossal tisztázandó megosztási döntések szemléltetése.</small></aside>;
 if(slug==='ingatlan-ertekesites-folyamata')return <aside className="kz9-narrative-exhibit kz9-exhibit-process" aria-label="Az értékesítés szakaszainak kimenete"><span>NEM LÉPÉSSZÁM, HANEM KIMENET</span>{[['Felmérés','Rendezett és ellenőrzött ingatlanadatok'],['Stratégia','Egyeztetett árpozíció és célcsoport'],['Bemutatás','Jóváhagyott hirdetési anyagok'],['Lezárás','Tisztázott ajánlati és átadási feltételek']].map(([stage,result],i)=><div key={stage}><b>0{i+1}</b><strong>{stage}</strong><span>{result}</span></div>)}</aside>;
 return null;
}
