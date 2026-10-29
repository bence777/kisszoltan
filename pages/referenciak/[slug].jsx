import React from 'react';
import Link from 'next/link';
import SeoHead from '../../components/SeoHead';
import {Header,Footer} from '../../components/GlobalUI';
import Icon from '../../components/Icons';
import {publishedCaseStudies} from '../../data/caseStudies';
export async function getStaticPaths(){return {paths:publishedCaseStudies.map(c=>({params:{slug:c.slug}})),fallback:false}}
export async function getStaticProps({params}){const item=publishedCaseStudies.find(c=>c.slug===params.slug);return item?{props:{item}}:{notFound:true};}
export default function CaseStudy({item}){
 const sections=[['Kiinduló helyzet',item.challenge],['Értékesítési stratégia',item.strategy],['A folyamat',item.process],['Igazolt eredmény',item.outcome],['Jóváhagyott bizonyítékok',item.evidence]];
 return <><SeoHead title={`${item.title} – ingatlanértékesítési esettanulmány | Kiss Zoltán`} path={`/referenciak/${item.slug}`} description={item.summary||`${item.title}: igazolt, publikálásra engedélyezett értékesítési esettanulmány.`}/><Header/><main className="kz-landing"><div className="container"><nav className="detail-breadcrumb" aria-label="Morzsanavigáció"><Link href="/">Főoldal</Link><span>/</span><Link href="/referenciak">Referenciák</Link><span>/</span>{item.title}</nav><header className="kz-landing-head"><div className="eyebrow">ELLENŐRZÖTT REFERENCIA · {item.area}</div><h1>{item.title}</h1><p>{item.summary||item.propertyType}</p></header><div className="kz-service-overview">{sections.map(([title,description],i)=><section key={title}><span>{String(i+1).padStart(2,'0')}</span><div><h2>{title}</h2><p>{description}</p></div></section>)}</div><div className="kz-related-services"><div className="eyebrow">A KÖVETKEZŐ LÉPÉS</div><Link href="/ingatlan-ertekesites-folyamata">Hogyan zajlik az értékesítés? <Icon name="arrow"/></Link><Link href="/eladni-szeretnek">Személyes értékesítési konzultáció <Icon name="arrow"/></Link></div></div></main><Footer/></>;
}
