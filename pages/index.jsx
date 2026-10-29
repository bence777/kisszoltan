import React,{useState} from 'react';
import {Header,Footer} from '../components/GlobalUI';
import {Hero,Proof,Listings,Method,Team,Testimonial,FAQ,Contact} from '../components/HomeSections';
import {ExpertiseLinks} from '../components/PremiumContent';
import {ValueExplorer} from '../components/ValueExplorer';
import PropertySpotlight from '../components/PropertySpotlight';
import DistrictMarket from '../components/DistrictMarket';
import SeoHead from '../components/SeoHead';
import {currentProperties} from '../lib/kz-content-store';
export async function getStaticProps(){return {props:{propertyList:await currentProperties()},revalidate:120}}
export default function Home({propertyList}){const [filters,setFilters]=useState({type:'',district:'',maxPrice:0});return <>
 <SeoHead title="Kiss Zoltán | Prémium ingatlanközvetítés és nagy értékű ingatlanok" description="Nagy értékű ingatlanok személyes képviselete Budapesten és környékén. Eladói konzultáció, válogatott villák és rezidenciák Kiss Zoltán közvetítésével." path="/"/>
 <Header/><main><Hero filters={filters} setFilters={setFilters} items={propertyList}/><Proof/><PropertySpotlight items={propertyList}/><Listings filters={filters} setFilters={setFilters} items={propertyList}/><Method/><ValueExplorer/><DistrictMarket/><ExpertiseLinks/><Team/><Testimonial/><FAQ/><Contact/></main><Footer/>
 </>}
