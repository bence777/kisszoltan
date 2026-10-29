import {adminFromRequest,db,method,clean,errorResponse} from '../../../lib/db';
import {properties} from '../../../data/properties';
import {currentProperties} from '../../../lib/kz-content-store';
const safeImages=x=>Array.isArray(x)?x.filter(v=>typeof v==='string'&&/^https:\/\//.test(v)&&v.length<1800).slice(0,45):[];
async function invalidate(res,slug){for(const path of [`/ingatlan/${slug}`,'/','/ingatlanjaim','/luxusvillak-budapest','/penthouse-budapest','/luxusingatlanok-budapest-ii-kerulet'])try{await res.revalidate(path);}catch(e){console.error('[ISR property]',path,e.message)}}
export default async function handler(req,res){
 res.setHeader('Cache-Control','private,no-store');res.setHeader('X-Robots-Tag','noindex,nofollow');
 if(!method(req,res,['GET','PATCH']))return;
 try{
  if(!await adminFromRequest(req))return res.status(403).json({error:'Nincs jogosultságod.'});
  if(req.method==='GET')return res.json({properties:await currentProperties()});
  const slug=clean(req.body?.slug,140),base=properties.find(p=>p.slug===slug);
  if(!base)return res.status(404).json({error:'Ismeretlen ingatlan. Az alapadatbázisban nem szerepel.'});
  const v=req.body?.changes||{};
  const price=Number(v.price);
  if(!Number.isFinite(price)||price<1e6||price>1e12)return res.status(400).json({error:'Hibás ár.'});
  const images=safeImages(v.images);
  if(!images.length)return res.status(400).json({error:'Legalább egy https:// képhivatkozás szükséges.'});
  if(!['Eladó','Eladva','Felfüggesztve','Egyeztetendő'].includes(v.status))return res.status(400).json({error:'Hibás státusz.'});
  const row={slug,title:clean(v.title,180),description:clean(v.description,2500),price,status:v.status,images,updated_at:new Date().toISOString()};
  if(row.title.length<6)return res.status(400).json({error:'A cím túl rövid.'});
  const {error}=await db().from('kz_property_overrides').upsert(row,{onConflict:'slug'});
  if(error)throw error;await invalidate(res,slug);return res.json({ok:true});
 }catch(e){return errorResponse(res,e)}
}
