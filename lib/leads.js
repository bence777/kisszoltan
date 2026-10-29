import {track} from '../components/AppContext';
import {mailto} from './seo';

// A retry with identical fields reuses the UUID: transient network errors cannot create duplicate leads.
const pending=new Map();
function safeLanding(){
 if(typeof window==='undefined')return '/';
 try{return sessionStorage.getItem('kz_landing_path')||window.location.pathname;}catch{return window.location.pathname;}
}
function safeSource(){
 if(typeof window==='undefined')return '';
 try{return sessionStorage.getItem('kz_utm_source')||'';}catch{return '';}
}
export async function submitLead(details){
 const kind=details.kind||'general';
 const source=typeof window!=='undefined'?window.location.pathname:'/';
 const payload={...details,kind,source,landingPath:safeLanding(),utmSource:safeSource()};
 const key=JSON.stringify(payload);
 if(!pending.has(key))pending.set(key,crypto.randomUUID());
 const submissionId=pending.get(key);
 let response;
 try{response=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,submissionId})});}
 catch{throw new Error('Nem sikerült kapcsolódni a szerverhez. Próbálja újra, vagy keressen telefonon.');}
 const result=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(result.message||'Nem sikerült rögzíteni a megkeresést.');
 pending.delete(key);
 track(kind==='seller'?'seller_lead_submit':kind==='buyer'?'buyer_inquiry_submit':'lead_submit_success',{
  property_id:details.propertyCode||undefined,source_page:source,notification_delayed:Boolean(result.notificationDelayed)
 });
 return result;
}
export function fallbackLeadHref(d){
 return mailto(`Ingatlanérdeklődés – ${d.type||'konzultáció'}`,`Név: ${d.name||''}\nE-mail: ${d.email||''}\nTelefon: ${d.phone||''}\nTéma: ${d.type||''}\nIngatlanazonosító: ${d.propertyCode||''}\n\n${d.message||''}`);
}
