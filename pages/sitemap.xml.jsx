import {INDEXABLE,SITE_URL} from '../lib/seo';
import {publishedPosts} from '../lib/kz-content-store';
import {properties} from '../data/properties';
import {landings} from '../data/landings';
import {articles} from '../data/articles';
import {isPublicationApproved} from '../data/propertyQuality';
import {publishedCaseStudies} from '../data/caseStudies';
import {selectCategoryProperties} from '../lib/category-properties';
import {editorialServices} from '../data/editorialServices';
import {isArticleApproved,isServiceApproved} from '../lib/publication';
export async function getServerSideProps({res}){res.setHeader('Content-Type','application/xml; charset=utf-8');res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=1200');
 let cms=[];try{cms=await publishedPosts();}catch(e){console.error('[sitemap cms]',e.message);}
 const paths=['/','/rolam','/kapcsolat',...(publishedCaseStudies.length?['/referenciak',...publishedCaseStudies.map(c=>`/referenciak/${c.slug}`)]:[]),...Object.keys(landings).filter(slug=>landings[slug].kind!=='category'&&isServiceApproved(editorialServices[slug])).map(slug=>`/${slug}`),...Object.keys(landings).filter(slug=>{if(landings[slug].kind!=='category')return false;const items=selectCategoryProperties(landings[slug].filter);return items.length>=2&&items.every(isPublicationApproved);}).map(slug=>`/${slug}`),...(articles.some(isArticleApproved)?['/tudastar']:[]),...articles.filter(isArticleApproved).map(a=>`/tudastar/${a.slug}`),...properties.filter(isPublicationApproved).map(p=>`/ingatlan/${p.slug}`),...cms.map(p=>`/tudastar/${p.slug}`)];
 const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 res.write(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${INDEXABLE?paths.map(p=>`<url><loc>${esc(`${SITE_URL}${p}`)}</loc></url>`).join(''):''}</urlset>`);res.end();return {props:{}}}
export default function Sitemap(){return null}
