import {randomUUID} from 'node:crypto';
import {encryptLead,insertLead,getBySubmissionId,patchLead} from '../../lib/server/lead-store.js';
import {notifyOwner,notifyVisitor} from '../../lib/server/lead-notifications.js';
import {rateLimit} from '../../lib/server/rate-limit.js';

const LIMITS={name:120,email:254,phone:60,type:80,message:4000,propertyCode:50,source:300,landingPath:300,utmSource:80};
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const read=(v,max)=>typeof v==='string'&&v.trim().length<=max?v.trim():null;
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function validOrigin(req){
 const origin=String(req.headers.origin||'');
 if(!origin)return true; // Non-browser callers still need all other controls.
 try{const parsed=new URL(origin);return parsed.host===req.headers.host&&(parsed.protocol==='https:'||process.env.NODE_ENV!=='production');}catch{return false;}
}
function safePath(value){if(!value||!value.startsWith('/')||value.startsWith('//'))return '/';return value.split('?')[0].slice(0,300);}
function validated(body){
 if(!body||typeof body!=='object'||Array.isArray(body))return null;
 if(body.website)return {honeypot:true};
 const d=Object.fromEntries(Object.entries(LIMITS).map(([key,max])=>[key,read(body[key],max)]));
 if(!d.name||!d.email||!emailPattern.test(d.email)||!d.message||!d.type||body.consent!==true)return null;
 if(Object.entries(LIMITS).some(([key,max])=>typeof body[key]==='string'&&body[key].trim().length>max))return null;
 const kind=['seller','buyer','general'].includes(body.kind)?body.kind:'general';
 if(d.propertyCode&&!/^KZ-[0-9]{3,6}$/.test(d.propertyCode))return null;
 return {...d,kind,source:safePath(d.source),landingPath:safePath(d.landingPath),utmSource:/^[a-zA-Z0-9_.-]{1,80}$/.test(d.utmSource||'')?d.utmSource:'',type:d.type.replace(/[\r\n]/g,' ').slice(0,80)};
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({message:'Nem támogatott metódus.'});}
 if(!validOrigin(req))return res.status(403).json({message:'Nem engedélyezett eredet.'});
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({message:'JSON szükséges.'});
 if(Number(req.headers['content-length']||0)>12000)return res.status(413).json({message:'Túl hosszú kérés.'});
 const d=validated(req.body);
 if(!d)return res.status(422).json({message:'Kérjük, ellenőrizze az elérhetőségeket, a mezőket és az adatkezelési nyilatkozatot.'});
 if(d.honeypot)return res.status(200).json({ok:true});
 const submissionId=uuid.test(String(req.body.submissionId||''))?req.body.submissionId:randomUUID();
 try{
  const allowed=await rateLimit(req);
  if(!allowed)return res.status(429).json({message:'Túl sok kérés érkezett. Kérjük, telefonon vagy e-mailben keressen bennünket.'});
 }catch{return res.status(503).json({message:'Az érdeklődési rendszer átmenetileg nem elérhető. Kérjük, keressen telefonon.'});}
 let saved;
 try{
  saved=await insertLead({submission_id:submissionId,kind:d.kind,type:d.type,property_code:d.propertyCode||null,
   source_path:d.source,landing_path:d.landingPath,utm_source:d.utmSource||null,encrypted_payload:encryptLead(d)});
 }catch{return res.status(503).json({message:'Jelenleg nem tudjuk biztonságosan rögzíteni a megkeresését. Kérjük, próbálja újra vagy keressen telefonon.'});}
 if(!saved?.length){
  try{const original=await getBySubmissionId(submissionId);if(original)return res.status(200).json({ok:true,stored:true,notificationDelayed:original.notification_status!=='sent'});}catch{}
  return res.status(503).json({message:'A megkeresés státuszát nem sikerült ellenőrizni.'});
 }
 const leadId=saved[0].id;
 let ownerSent=false,visitorSent=false;
 try{await notifyOwner(d,leadId);ownerSent=true;}catch{console.error('Stored lead requires owner notification retry',leadId);}
 try{await patchLead(leadId,{notification_status:ownerSent?'sent':'failed',...(ownerSent?{owner_notified_at:new Date().toISOString()}:{})});}catch{console.error('Could not save owner notification state',leadId);}
 try{await notifyVisitor(d);visitorSent=true;}catch{console.error('Stored lead visitor receipt not sent',leadId);}
 try{await patchLead(leadId,{receipt_status:visitorSent?'sent':'failed'});}catch{console.error('Could not save receipt state',leadId);}
 return res.status(ownerSent?201:202).json({ok:true,stored:true,notificationDelayed:!ownerSent,receiptDelayed:!visitorSent});
}
