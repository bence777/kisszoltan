import React from 'react';
import Link from 'next/link';
import Icon from '../components/Icons';
import SeoHead from '../components/SeoHead';
import {Header,Footer,PropertyCard} from '../components/GlobalUI';
import {useApp} from '../components/AppContext';
import {isPublicationApproved} from '../data/propertyQuality';
import {selectCategoryProperties} from '../lib/category-properties';
import {landings} from '../data/landings';
import {articles} from '../data/articles';
import {editorialServices} from '../data/editorialServices';
import {EditorialReadingLayout,EditorialChecklist,EditorialFaq,EditorialRelated,PackageComparison,ServiceFramework} from '../components/EditorialLayout';
import {ValueExplorer} from '../components/ValueExplorer';
import {ServiceMasthead,CategoryMasthead,ServiceBridge} from '../components/IntentDesign';
import SellerExperience from '../components/SellerExperience';
import {PremiumShowcase,ProcessJourney} from '../components/EditorialV11';
import {DiscretionDecision,PackageScope,EditorialEssay} from '../components/DecisionTools';
import {isServiceApproved} from '../lib/publication';
import {currentProperties} from '../lib/kz-content-store';

export async function getStaticPaths(){return {paths:Object.keys(landings).map(slug=>({params:{slug}})),fallback:false}}
export async function getStaticProps({params}){return {props:{slug:params.slug,propertyList:await currentProperties()},revalidate:120}}
const categoryLinks=[['Összes ingatlan','/ingatlanjaim'],['Budapesti villák','/luxusvillak-budapest'],['Penthouse','/penthouse-budapest'],['II. kerület','/luxusingatlanok-budapest-ii-kerulet']];
const plans=['standard','premium-csomag','exclusive-csomag'];

export default function Landing({slug,propertyList}){
 const page=landings[slug], editorial=editorialServices[slug];
 const items=page.kind==='category'?selectCategoryProperties(page.filter,propertyList):[];
 const service=page.kind==='service', isPackage=plans.includes(slug);
 const {setModal}=useApp();
 const openContact=()=>setModal({type:'lead',kind:'seller',context:`A(z) ${page.title.toLowerCase()} kapcsán kérek tájékoztatást.`});
 return <><SeoHead title={`${page.title} | Kiss Zoltán`} description={page.description} path={`/${slug}`} robots={service&&!isServiceApproved(editorial)||page.kind==='category'&&(items.length<2||items.some(p=>!isPublicationApproved(p)))?'noindex,follow':undefined}/><Header/>
 {slug==='eladni-szeretnek'?<main className="kz10-seller-page"><SellerExperience/></main>:<main className={`kz-landing kz9-page kz9-page-${service?'service':'category'} kz9-page-${slug}`}><div className="container">
  <nav className="detail-breadcrumb" aria-label="Morzsanavigáció"><Link href="/">Főoldal</Link><span>/</span>{service&&<><Link href="/eladni-szeretnek">Eladóknak</Link><span>/</span></>}<span aria-current="page">{page.title}</span></nav>
  {service?<ServiceMasthead page={page} slug={slug} openContact={openContact}/>:<CategoryMasthead page={page} slug={slug} items={items}/>}
  {service&&editorial?<>
   {slug==='premium-csomag'?<><PremiumShowcase onContact={openContact}/><PackageComparison active={slug}/><EditorialFaq faqs={editorial.faqs}/></>:slug==='ingatlan-ertekesites-folyamata'?<><ProcessJourney onContact={openContact}/><EditorialFaq faqs={editorial.faqs}/></>:slug==='diszkret-ingatlanertekesites'?<><DiscretionDecision/><EditorialEssay content={editorial}/><EditorialFaq faqs={editorial.faqs}/><ServiceBridge slug={slug} openContact={openContact}/></>:slug==='standard'||slug==='exclusive-csomag'?<><PackageScope tier={slug==='standard'?'standard':'exclusive'}/><EditorialEssay content={editorial}/><PackageComparison active={slug}/><EditorialFaq faqs={editorial.faqs}/></>:<>
    <section className="kz-editorial-intro kz9-intro" aria-label="Az oldal lényege"><div><span className="kz-editorial-kicker">AZ OLDAL LÉNYEGE</span><h2>{editorial.kicker}</h2></div><p>{editorial.synopsis}</p></section>
    {slug==='luxusingatlan-ertekbecsles'&&<ServiceFramework slug={slug} page={page}/>}
    <EditorialReadingLayout content={editorial} slug={slug}/>
    {isPackage&&<PackageComparison active={slug}/>}
    <EditorialChecklist items={editorial.checklist} title={slug==='diszkret-ingatlanertekesites'?'Mit célszerű előre tisztázni?':isPackage?'Kérdések a megbízás előtt':'Ellenőrzőlista az induláshoz'}/>
    <EditorialFaq faqs={editorial.faqs}/>
    <ServiceBridge slug={slug} openContact={openContact}/>
   </>}
   <EditorialRelated activeSlug={slug} slugs={editorial.featureLinks||page.related||[]} articles={articles.filter(a=>a.related?.includes(slug)).slice(0,2)} title={isPackage?'Másik együttműködési forma?':'Kapcsolódó szakmai tartalom'}/>
   {editorial.sourceUrl&&<p className="kz-editorial-source">A csomagadatok ellenőrzendő nyilvános forrása: <a href={editorial.sourceUrl} target="_blank" rel="noopener noreferrer">a közzétett szolgáltatásleírás</a>. A végleges vállalásokat a szerződés rögzíti.</p>}
  </>:service?<div className="kz-service-overview">{page.sections.map(([heading,text],i)=><section key={heading}><span>{String(i+1).padStart(2,'0')}</span><div><h2>{heading}</h2><p>{text}</p></div></section>)}</div>:<>
   <section id="kinalat" className="kz9-category-listing"><div className="kz9-category-listing-heading"><div><span className="eyebrow">MEGTEKINTHETŐ AJÁNLATOK</span><h2>Ingatlanok ebben a válogatásban</h2></div><p>Az árak nyilvános hirdetési árak, nem lezárt tranzakciók. Az aktuális elérhetőség egyeztetendő.</p></div>
    <nav className="kz-category-tabs" aria-label="Ingatlankategóriák">{categoryLinks.map(([name,path])=><Link href={path} key={path} className={path===`/${slug}`?'active':''} aria-current={path===`/${slug}`?'page':undefined}>{name}</Link>)}</nav>
    {items.length?<div className="property-grid">{items.map((item,i)=><PropertyCard key={item.id} p={item} index={i}/>)}</div>:<p>Ehhez a kategóriához még nincs nyilvánosan bemutatható ingatlan.</p>}
   </section>
   <section className="kz9-category-criteria"><span className="eyebrow">ÖSSZEHASONLÍTÁS ELŐTT</span><h2>{slug==='penthouse-budapest'?'A belső tér és a terasz nem ugyanaz.':slug==='luxusvillak-budapest'?'Egy villát nem csupán négyzetméterben mérünk.':'A kerületen belül is sokat számít a mikrolokáció.'}</h2><p>{slug==='penthouse-budapest'?'Az alaprajzon, a hirdetésben és a műszaki dokumentációban szereplő területadatokat külön érdemes megvizsgálni.':slug==='luxusvillak-budapest'?'A privát telek, a térszervezés és az épületgépészet azonos alapterület mellett is jelentős különbséget eredményezhet.':'A panoráma, a megközelíthetőség, a zajterhelés és az épület műszaki állapota azonos kerületben is eltérő lehet.'}</p><div><Link href="/tudastar/mitol-fugg-egy-budai-luxusvilla-erteke">A villa értékének tényezői <Icon name="arrow" size={16}/></Link><Link href="/tudastar/miert-nem-eleg-az-atlagos-negyzetmeterar-luxusvilla">Miért nem elég a kerületi átlag? <Icon name="arrow" size={16}/></Link></div></section>
  </>}
 </div>{slug==='luxusingatlan-ertekbecsles'&&<ValueExplorer/>}</main>}<Footer/></>;
}
