import React,{useState} from 'react';
import {Header,Footer} from '../components/GlobalUI';
import {Hero,Proof,Listings,Method,Team,Testimonial,FAQ,Contact} from '../components/HomeSections';
import {ExpertiseLinks} from '../components/PremiumContent';
import {ValueExplorer} from '../components/ValueExplorer';
import PropertySpotlight from '../components/PropertySpotlight';
import DistrictMarket from '../components/DistrictMarket';
import SeoHead from '../components/SeoHead';
import {currentProperties} from '../lib/kz-content-store';
import {canonical} from '../lib/seo';
export async function getStaticProps(){return {props:{propertyList:await currentProperties()},revalidate:120}}
export default function Home({propertyList}){const [filters,setFilters]=useState({type:'',district:'',maxPrice:0});return <>
 <SeoHead title="Kiss Zoltán | Prémium ingatlanok Budapesten" description="Nagy értékű ingatlanok személyes képviselete Budapesten és környékén. Eladói konzultáció, válogatott villák és rezidenciák Kiss Zoltán közvetítésével." path="/" schemas={[{
  '@context':'https://schema.org','@type':'RealEstateAgent',
  name:'Kiss Zoltán',description:'Nagy értékű ingatlanok személyes képviselete Budapesten és környékén.',
  url:canonical('/'),telephone:'+36 70 905 7683',email:'ingatlan@kisszoltan.com',
  areaServed:[{'@type':'City',name:'Budapest'},{'@type':'AdministrativeArea',name:'Budapest agglomerációja'}]
 },{'@context':'https://schema.org','@type':'WebSite',name:'Kiss Zoltán',url:canonical('/')}]}/>
 <Header/><main><Hero filters={filters} setFilters={setFilters} items={propertyList}/><Proof/><PropertySpotlight items={propertyList}/><Listings filters={filters} setFilters={setFilters} items={propertyList}/><Method/><ValueExplorer/><DistrictMarket/><ExpertiseLinks/><Team/><Testimonial/><FAQ/><Contact/></main><Footer/>
 </>}
