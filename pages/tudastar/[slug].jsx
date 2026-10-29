import React from 'react';
import Link from 'next/link';
import SeoHead from '../../components/SeoHead';
import {Header,Footer} from '../../components/GlobalUI';
import {articles} from '../../data/articles';
import {editorialArticles} from '../../data/editorialArticles';
import {EditorialReadingLayout,EditorialChecklist,EditorialFaq,EditorialRelated} from '../../components/EditorialLayout';
import {PropertyPriceContrast} from '../../components/EditorialExperience';
import {ArticleMasthead} from '../../components/IntentDesign';
import {BillionSaleDeepDive} from '../../components/EditorialV11';
import {DocumentDossier,BuyerConversation,PublicityComparison,VillaEvidence,EditorialEssay} from '../../components/DecisionTools';
import {SITE_URL} from '../../lib/seo';
import {publishedPost,publishedRedirect} from '../../lib/kz-content-store';
import BlogRichContent from '../../components/blog/BlogRichContent';
import {isArticleApproved} from '../../lib/publication';
export async function getStaticPaths(){return {paths:articles.map(a=>({params:{slug:a.slug}})),fallback:'blocking'}}
export async function getStaticProps({params}){
 const authored=articles.find(a=>a.slug===params.slug);
 if(authored)return {props:{article:authored,cms:null},revalidate:300};
 try{const cms=await publishedPost(params.slug);if(cms)return {props:{article:null,cms},revalidate:120};const redirect=await publishedRedirect(params.slug);return redirect?{redirect:{destination:`/tudastar/${redirect}`,permanent:true}}:{notFound:true,revalidate:30}}
 catch(error){console.error('[cms article]',error.message);return {notFound:true,revalidate:30};}
}
function CmsArticle({p}){
 const articleSchema=SITE_URL?{'@context':'https://schema.org','@type':'Article',headline:p.title,description:p.excerpt,datePublished:p.published_at,dateModified:p.updated_at||p.published_at,author:{'@type':'Person',name:p.author_name||'Kiss Zoltán'},mainEntityOfPage:`${SITE_URL}/tudastar/${p.slug}`,...(p.cover_url?{image:p.cover_url}:{})}:null;
 return <><SeoHead title={p.seo_title||p.title} description={p.seo_description||p.excerpt||p.title} path={`/tudastar/${p.slug}`} schemas={[articleSchema]} ogType="article"/><Header/><main className="kz-cms-article"><div className="container"><nav className="detail-breadcrumb" aria-label="Morzsanavigáció"><Link href="/">Főoldal</Link><span>/</span><Link href="/tudastar">Tudástár</Link><span>/</span><span>{p.title}</span></nav><header className="kz-cms-masthead"><span className="eyebrow">{p.category_slug||'SZAKMAI TUDÁSTÁR'} / KISS ZOLTÁN</span><h1>{p.title}</h1><p>{p.excerpt}</p>{p.published_at&&<small>{new Date(p.published_at).toLocaleDateString('hu-HU')} · Kiss Zoltán</small>}</header>{p.cover_url&&<figure className="kz-cms-cover"><img src={p.cover_url} alt={p.title}/></figure>}<div className="kz-cms-reading"><BlogRichContent content={p.content}/></div><footer className="kz-cms-end"><Link href="/tudastar">← Vissza a Tudástárhoz</Link><Link href="/eladni-szeretnek">Ingatlan értékesítéséről érdeklődöm →</Link></footer></div></main><Footer/></>;
}
export default function Article({article:a,cms}){
 if(cms)return <CmsArticle p={cms}/>;
 const rich=editorialArticles[a.slug];
 const further=articles.filter(x=>x.slug!==a.slug).filter(x=>x.related?.some(s=>a.related?.includes(s))).slice(0,2);
 const priceArticle=a.slug==='miert-nem-eleg-az-atlagos-negyzetmeterar-luxusvilla';
 const deepDive=a.slug==='hogyan-zajlik-egy-milliardos-ingatlan-ertekesitese';
 // Article schema only with reviewed publication metadata; a demo must not invent dates or authorship.
 const breadcrumbSchema=SITE_URL?{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Főoldal',item:`${SITE_URL}/`},{'@type':'ListItem',position:2,name:'Tudástár',item:`${SITE_URL}/tudastar`},{'@type':'ListItem',position:3,name:a.title,item:`${SITE_URL}/tudastar/${a.slug}`}]}:null;
 const articleSchema=isArticleApproved(a)&&SITE_URL?{'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.intro,datePublished:a.publishedAt,dateModified:a.modifiedAt||a.publishedAt,author:{'@type':'Person',name:a.authorName||'Kiss Zoltán'},mainEntityOfPage:`${SITE_URL}/tudastar/${a.slug}`}:null;
 return <><SeoHead title={`${a.title} | Kiss Zoltán – tudástár`} description={a.intro} path={`/tudastar/${a.slug}`} robots={isArticleApproved(a)?undefined:'noindex,follow'} schemas={[breadcrumbSchema,articleSchema]} ogType="article"/><Header/>
 <main className={`kz-landing kz-editorial-article kz9-article-page kz9-topic-${a.slug}`}><div className="container">
  <nav className="detail-breadcrumb" aria-label="Morzsanavigáció"><Link href="/">Főoldal</Link><span>/</span><Link href="/tudastar">Tudástár</Link><span>/</span><span aria-current="page">{a.title}</span></nav>
  <ArticleMasthead article={a} rich={rich}/>
  {deepDive?<BillionSaleDeepDive/>:rich?<>
   <section className="kz-article-answer" aria-label="A legfontosabb tudnivaló"><span>A LÉNYEG RÖVIDEN</span><p>{rich.answer}</p></section>
   {priceArticle&&<PropertyPriceContrast/>}
   {a.slug==='mitol-fugg-egy-budai-luxusvilla-erteke'&&<VillaEvidence/>}
   {a.slug==='nyilvanos-vagy-diszkret-ingatlanertekesites'&&<PublicityComparison/>}
   {a.slug==='milyen-dokumentumok-kellenek-nagyerteku-ingatlan-eladasahoz'&&<DocumentDossier/>}
   {a.slug==='hogyan-tortenik-a-premium-vevok-eloszurese'&&<BuyerConversation/>}
   <EditorialEssay content={rich}/>
   {!a.slug.includes('dokumentumok')&&!a.slug.includes('eloszurese')&&<EditorialChecklist items={rich.checklist} title="Gyakorlati ellenőrzőlista"/>}
   <EditorialFaq faqs={rich.faqs}/>
  </>:<div className="kz-article-body">{a.sections.map(([heading,p])=><section key={heading}><h2>{heading}</h2><p>{p}</p></section>)}</div>}
  <p className="kz-article-disclaimer">Ez az útmutató általános tájékoztatás. A konkrét ingatlan értékének, jogi feltételeinek vagy finanszírozásának megítélése egyedi vizsgálatot és szükség esetén megfelelő szakember bevonását igényli.</p>
  <EditorialRelated slugs={a.related||[]} articles={deepDive?[]:further} title={deepDive?'Következő lépés: kapcsolódó szolgáltatások':'Tovább a témában'}/>
 </div></main><Footer/></>;
}
