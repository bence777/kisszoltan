import {db,configured} from '../../lib/db';
import {properties} from '../../data/properties';
const names=new Set(['page_view','property_view','phone_click','valuation_start','seller_lead_submit','buyer_inquiry_submit','lead_submit_success','gallery_open','tour_open','add_to_wishlist']);
const max=120;
const windowHits=new Map();
const allowedPath=p=>typeof p==='string'&&p.startsWith('/')&&!p.startsWith('//')&&!p.startsWith('/admin')&&!p.startsWith('/api')&&p.length<220&&/^[a-zA-Z0-9/_-]+$/.test(p);
export default async function handler(req,res){
 res.setHeader('Cache-Control','private,no-store');
 if(req.method!=='POST')return res.status(405).end();
 if(process.env.ANALYTICS_ENABLED!=='true'||!configured())return res.status(204).end();
 try{
  const origin=req.headers.origin;
  if(!origin||new URL(origin).host!==req.headers.host)return res.status(403).end();
  const name=String(req.body?.name||''),path=String(req.body?.path||'');
  if(!names.has(name)||!allowedPath(path))return res.status(400).end();
  const stamp=Date.now();const key=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'').slice(0,55);
  const prev=windowHits.get(key)||{at:stamp,n:0};const hit=stamp-prev.at>60000?{at:stamp,n:1}:{at:prev.at,n:prev.n+1};windowHits.set(key,hit);
  if(windowHits.size>2500)windowHits.clear();if(hit.n>max)return res.status(429).end();
  const propertyId=String(req.body?.property_id||'');
  const row={event_name:name,page_path:path,property_id:properties.some(p=>p.id===propertyId)?propertyId:null,source_channel:String(req.body?.source_channel||'direct').slice(0,32).replace(/[^a-z0-9_.-]/gi,''),created_at:new Date().toISOString()};
  const {error}=await db().from('kz_analytics_events').insert(row);
  if(error)throw error;return res.status(204).end();
 }catch(e){console.error('[analytics]',e.message);return res.status(503).end();}
}
