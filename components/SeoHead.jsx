import Head from 'next/head';
import {INDEXABLE,ROBOTS,canonical,jsonLd} from '../lib/seo';
export default function SeoHead({title,description,path='/',image,schemas=[],robots,ogType='website'}){
 const url=canonical(path);
 const baseSchemas=[{
  '@context':'https://schema.org','@type':'WebPage',name:title,description,url,
  inLanguage:'hu-HU',isPartOf:{'@type':'WebSite',name:'Kiss Zoltán – prémium ingatlanközvetítés',url:canonical('/')}
 }];
 return <Head>
  <title>{title}</title><meta name="description" content={description}/><meta name="robots" content={INDEXABLE?(robots||ROBOTS):ROBOTS}/>
  {url&&<link rel="canonical" href={url}/>}
  <meta property="og:type" content={ogType}/><meta property="og:title" content={title}/><meta property="og:description" content={description}/>
  {url&&<meta property="og:url" content={url}/>}{image&&<meta property="og:image" content={image}/>}
  <meta name="theme-color" content="#0C2A30"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
  {[...baseSchemas,...schemas.filter(Boolean)].map((schema,i)=><script key={i} type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/>)}
 </Head>
}
