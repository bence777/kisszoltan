import React from 'react';
import Link from 'next/link';
import Icon from '../../components/Icons';
import SeoHead from '../../components/SeoHead';
import {Header,Footer} from '../../components/GlobalUI';
import {articles} from '../../data/articles';
import {publishedPosts} from '../../lib/kz-content-store';
import {isArticleApproved} from '../../lib/publication';
import {editorialArticles} from '../../data/editorialArticles';
import {properties} from '../../data/properties';
import {LibraryTopicFinder,EditorialListingImage} from '../../components/EditorialV11';

const editorialPick=articles.find(a=>a.slug==='hogyan-zajlik-egy-milliardos-ingatlan-ertekesitese');
const otherSlugs=['hogyan-tortenik-a-premium-vevok-eloszurese','miert-nem-eleg-az-atlagos-negyzetmeterar-luxusvilla'];

export async function getStaticProps(){
 try{return {props:{cmsPosts:await publishedPosts()},revalidate:120}}catch(error){console.error('[cms listing]',error.message);return {props:{cmsPosts:[]},revalidate:30}}
}
export default function Tudastar({cmsPosts=[]}){
 const photo=properties[3];
 const feature=properties[0];
 return <><SeoHead title="Prémium ingatlanok – szakmai tudástár | Kiss Zoltán" description="Témánként rendezett útmutatók nagy értékű ingatlanok értékesítéséhez: árazás, diszkréció, előkészítés, dokumentumok és vevői egyeztetés." path="/tudastar" robots={articles.some(isArticleApproved)||cmsPosts.length?undefined:'noindex,follow'}/><Header/>
 <main className="kz-landing kz-library kz11-library"><div className="container">
  <nav className="detail-breadcrumb" aria-label="Morzsanavigáció"><Link href="/">Főoldal</Link><span>/</span><span aria-current="page">Tudástár</span></nav>
  <header className="kz11-library-hero"><div><span className="eyebrow">KISS ZOLTÁN / TUDÁSTÁR</span><h1>Az ingatlannál fontosabb, <em>hogy jó döntést hozzon.</em></h1><p>Prémium ingatlanokkal kapcsolatos kérdések, konkrét szempontok és a mérlegeléshez szükséges háttér. Válasszon témát az alapján, hogy most melyik döntés előtt áll.</p><a href="#temakorok">Témakörök áttekintése <Icon name="arrow" size={18}/></a></div><figure><EditorialListingImage src={photo.images?.[0]} loading="eager" alt={`Ingatlanfotó Kiss Zoltán nyilvános kínálatából: ${photo.title}`}/><figcaption>A KÉP ILLUSZTRÁCIÓ · {photo.location} · NYILVÁNOS KÍNÁLAT</figcaption></figure></header>
  <LibraryTopicFinder/>
  <section className="kz11-library-feature"><div><span className="eyebrow">KIEMELT ELEMZÉS / ÉRTÉKESÍTÉSI STRATÉGIA</span><h2>{editorialPick.title}</h2><p>{editorialPick.intro}</p><Link href={`/tudastar/${editorialPick.slug}`}>Az elemzés elolvasása <Icon name="arrow" size={18}/></Link></div><figure><EditorialListingImage src={feature.images?.[0]} alt={`${feature.title}, a nyilvános kínálat fotója témaképként`}/><figcaption>ILLUSZTRÁCIÓ A NYILVÁNOS KÍNÁLATBÓL · NEM LEZÁRT ÜGYLET</figcaption></figure></section>
  <section className="kz11-library-other"><span className="eyebrow">MÉLYEBBRE A TÉMÁBAN</span><h2>Részletesebb kérdések, célzott válaszok.</h2><div className="kz11-library-other-grid">{otherSlugs.map((slug,i)=>{const article=articles.find(a=>a.slug===slug);return <Link key={slug} href={`/tudastar/${slug}`}><span>0{i+1} / RÉSZLETKÉRDÉS</span><strong>{article.title}</strong><p>{article.intro}</p><Icon name="arrow" size={19}/></Link>})}</div></section>
  {cmsPosts.length>0&&<section className="kz-cms-listing"><span className="eyebrow">FRISS SZAKMAI CIKKEK</span><h2>Új publikációk a Tudástárban</h2><div className="kz-cms-listing-grid">{cmsPosts.map(p=><Link href={`/tudastar/${p.slug}`} key={p.slug} className="kz-cms-listing-card">{p.cover_url&&<img src={p.cover_url} alt="" loading="lazy"/>}<div><small>{p.category_slug||'Tudástár'}</small><h3>{p.title}</h3><p>{p.excerpt}</p><span>Cikk elolvasása ↗</span></div></Link>)}</div></section>}
  <aside className="kz11-decision-next"><div><span className="eyebrow">A KÖVETKEZŐ LÉPÉS</span><h2>Ha már az értékesítésről döntene…</h2><p>Az általános útmutatók segítenek a felkészülésben. A tényleges ár- és értékesítési döntésekhez az ingatlan adatainak ellenőrzése is szükséges.</p></div><Link href="/eladni-szeretnek">Eladóknak szóló lehetőségek <Icon name="arrow" size={17}/></Link></aside>
 </div></main><Footer/></>;
}
