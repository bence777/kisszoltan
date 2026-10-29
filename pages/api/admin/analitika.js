import {listLeads} from '../../../lib/server/lead-store.js';
import {adminFromRequest,db,method,errorResponse} from '../../../lib/db';
export default async function handler(req,res){
 res.setHeader('Cache-Control','private,no-store');res.setHeader('X-Robots-Tag','noindex,nofollow');
 if(!method(req,res,['GET']))return;
 try{
  if(!await adminFromRequest(req))return res.status(403).json({error:'Nincs jogosultságod.'});
  const days=Math.min(90,Math.max(1,Number(req.query.days)||30));const since=new Date(Date.now()-days*86400000).toISOString();
  const {data,error}=await db().from('kz_analytics_events').select('event_name,page_path,property_id,source_channel,created_at').gte('created_at',since).order('created_at',{ascending:false}).limit(10000);
  if(error)throw error;
  const events=data||[],count=name=>events.filter(e=>e.event_name===name).length;
  const byPage={};const sources={};const byDay={};
  for(const e of events){if(e.event_name==='page_view'){byPage[e.page_path]=(byPage[e.page_path]||0)+1;byDay[e.created_at.slice(0,10)]=(byDay[e.created_at.slice(0,10)]||0)+1;sources[e.source_channel||'direct']=(sources[e.source_channel||'direct']||0)+1;}}
  let business=null;try{const leads=await listLeads(200);const recent=leads.filter(l=>new Date(l.created_at)>=new Date(since));business={recentLeads:recent.length,qualifiedLeads:recent.filter(l=>l.status==='qualified').length,mandates:recent.filter(l=>l.status==='mandate_signed').length,limited:leads.length===200};}catch(e){console.error('[analytics leads optional]',e.message);}
  return res.json({business,days,capped:events.length===10000,totals:{pageViews:count('page_view'),phoneClicks:count('phone_click'),valuationStarts:count('valuation_start'),sellerLeads:count('seller_lead_submit'),buyerLeads:count('buyer_inquiry_submit')},pages:Object.entries(byPage).sort((a,b)=>b[1]-a[1]).slice(0,12),sources:Object.entries(sources).sort((a,b)=>b[1]-a[1]),daily:Object.entries(byDay).sort((a,b)=>a[0].localeCompare(b[0]))});
 }catch(e){return errorResponse(res,e)}
}
