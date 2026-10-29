import {adminAuthorized,adminRequestOriginValid} from '../../../lib/server/admin-auth.js';
import {listLeads,getLead,patchLead,deleteLead} from '../../../lib/server/lead-store.js';
import {notifyOwner} from '../../../lib/server/lead-notifications.js';
const statuses=new Set(['new','contacted','qualified','consultation_scheduled','mandate_signed','closed','spam']);
const isUuid=id=>/^[0-9a-f-]{36}$/i.test(String(id||''));
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');
 if(!(adminAuthorized(req)||await import('../../../lib/db.js').then(x=>x.adminFromRequest(req)).catch(()=>null)))return res.status(403).json({message:'Hozzáférés megtagadva.'});
 try{
  if(req.method==='GET')return res.status(200).json({leads:await listLeads()});
  if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return res.status(405).json({message:'Nem támogatott metódus.'});}
  if(!adminRequestOriginValid(req))return res.status(403).json({message:'Érvénytelen kérés.'});
  const {id,action,status}=req.body||{};
  if(!isUuid(id))return res.status(422).json({message:'Érvénytelen azonosító.'});
  if(action==='status'){
   if(!statuses.has(status))return res.status(422).json({message:'Érvénytelen státusz.'});
   const current=await getLead(id);
   const patch={status,updated_at:new Date().toISOString()};
   if(status==='qualified'&&!current.qualified_at)patch.qualified_at=patch.updated_at;
   if(status==='mandate_signed'&&!current.mandate_signed_at)patch.mandate_signed_at=patch.updated_at;
   await patchLead(id,patch);
   return res.status(200).json({ok:true});
  }
  if(action==='delete'){
   await deleteLead(id);
   return res.status(200).json({ok:true});
  }
  if(action==='retry_owner'){
   const lead=await getLead(id);
   if(lead.notification_status==='sent')return res.status(409).json({message:'A tulajdonosi értesítés már sikeres.'});
   await notifyOwner(lead.details,id);
   await patchLead(id,{notification_status:'sent',owner_notified_at:new Date().toISOString(),updated_at:new Date().toISOString()});
   return res.status(200).json({ok:true});
  }
  return res.status(422).json({message:'Ismeretlen művelet.'});
 }catch(error){console.error('Admin lead operation failed',error?.message||'unknown');return res.status(503).json({message:'A művelet nem sikerült. Próbálja újra.'});}
}
