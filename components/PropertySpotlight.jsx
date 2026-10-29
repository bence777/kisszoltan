import React from 'react';
import Link from 'next/link';
import {properties,fmtM} from '../data/properties';
import {ImageWithFallback} from './GlobalUI';
import Icon from './Icons';

/** Editorial feature: all metrics copied from the original Törökvész listing. */
export default function PropertySpotlight({items=properties}){
 const p=items.find(x=>x.code==='KZ-001');
 if(!p)return null;
 return <section className="v6-spotlight" aria-labelledby="v6-spotlight-title">
   <div className="container v6-spotlight-grid">
     <div className="v6-spotlight-photo">
       <ImageWithFallback src={p.images[0]} alt="Törökvészi 980 m²-es modern rezidencia, a kisszoltan.com kínálatából"/>
       <span className="v6-spotlight-photo-label">TÖRÖKVÉSZ · BUDAPEST II.</span>
     </div>
     <div className="v6-spotlight-copy">
       <div className="eyebrow">KIEMELT INGATLAN / 001</div>
       <h2 id="v6-spotlight-title">Egy ingatlan, <em>amelyet nem lehet pusztán négyzetméterárban mérni.</em></h2>
       <p>Három szint, 980 m²-es hirdetett alapterület, lift és nyolcállásos teremgarázs. Egy 2024-ben épült törökvészi rezidencia, amelynek bemutatása a részleteknél kezdődik.</p>
       <div className="v6-spotlight-numbers"><div><strong>980 <small>m²</small></strong><span>Alapterület</span></div><div><strong>13</strong><span>Szoba</span></div><div><strong>1 724 <small>m²</small></strong><span>Telek</span></div></div>
       <div className="v6-spotlight-price"><span>Hirdetési ár</span><strong>{fmtM(p.price)}</strong></div>
       <div className="v6-spotlight-actions"><Link className="btn btn-primary" href={'/ingatlan/'+p.slug}>A rezidencia részletei <Icon name="arrow" size={18}/></Link><a className="v6-spotlight-source" href={p.sourceUrl} target="_blank" rel="noopener noreferrer">Eredeti hirdetés <Icon name="upRight" size={14}/></a></div>
     </div>
   </div>
 </section>
}
