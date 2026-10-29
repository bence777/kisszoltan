import {adminFromRequest,db,method,clean,errorResponse} from '../../../lib/db';
import {slugify} from '../../../lib/blogDocument';
const types=['tag','category'];
function normalized(body){const kind=String(body.kind||'');const name=clean(body.name,70);if(!types.includes(kind)||!name)return null;return {kind,name,slug:slugify(body.slug||name).slice(0,70),description:clean(body.description,300),focus_keyword:clean(body.focus_keyword,130)};}
export default async function handler(req,res){if(!method(req,res,['GET','POST','PATCH','DELETE']))return;try{
 if(!await adminFromRequest(req))return res.status(403).json({error:'Nincs hozzáférésed.'});res.setHeader('Cache-Control','no-store');const client=db();
 if(req.method==='GET'){
  const {data:taxonomy,error}=await client.from('kz_blog_taxonomy').select('*').order('name',{ascending:true});if(error)throw error;
  const {data:posts,error:postError}=await client.from('kz_blog_posts').select('category_slug,tags').limit(1000);if(postError)throw postError;
  const known=new Set((taxonomy||[]).map(x=>`${x.kind}:${x.kind==='category'?x.slug:x.name.toLowerCase()}`));const used=[];
  for(const p of posts||[]){if(p.category_slug&&!known.has(`category:${p.category_slug}`)){known.add(`category:${p.category_slug}`);used.push({kind:'category',name:p.category_slug,slug:p.category_slug,description:'',focus_keyword:'',legacy:true});}
   for(const name of p.tags||[])if(!known.has(`tag:${name.toLowerCase()}`)){known.add(`tag:${name.toLowerCase()}`);used.push({kind:'tag',name,slug:slugify(name),description:'',focus_keyword:'',legacy:true});}}
  return res.json({categories:[...(taxonomy||[]),...used].filter(x=>x.kind==='category'),tags:[...(taxonomy||[]),...used].filter(x=>x.kind==='tag')});
 }
 if(req.method==='DELETE'){
  const id=clean(req.body?.id,50);if(!id)return res.status(400).json({error:'Hiányzó azonosító.'});const {data:item,error:readError}=await client.from('kz_blog_taxonomy').select('*').eq('id',id).single();if(readError)throw readError;
  // Protect against deleting taxonomy still referenced by published/draft posts.
  const {count,error:cntError}=await (item.kind==='category'?client.from('kz_blog_posts').select('id',{count:'exact',head:true}).eq('category_slug',item.slug):client.from('kz_blog_posts').select('id',{count:'exact',head:true}).contains('tags',[item.name]));if(cntError)throw cntError;
  if(count>0)return res.status(409).json({error:`${count} cikk még használja ezt a megjelölést. A törlés előtt válassz nekik másikat.`});
  const {error}=await client.from('kz_blog_taxonomy').delete().eq('id',id);if(error)throw error;return res.json({ok:true});
 }
 const item=normalized(req.body||{});if(!item||!item.slug)return res.status(400).json({error:'Hibás címke vagy kategória.'});
 if(req.method==='POST'){
  const {data,error}=await client.from('kz_blog_taxonomy').insert(item).select('*').single();if(error)throw error;return res.json({item:data});
 }
 const id=clean(req.body?.id,50);if(!id)return res.status(400).json({error:'Hiányzó azonosító.'});
 const {data:previous,error:readErr}=await client.from('kz_blog_taxonomy').select('*').eq('id',id).single();if(readErr)throw readErr;
 if(previous.kind!==item.kind||previous.slug!==item.slug||previous.name!==item.name){return res.status(409).json({error:'A használt azonosítók átnevezése megváltoztatná a cikkek kapcsolatait. Hozz létre újat, majd rendeld át a cikkeket.'});}
 const {data,error}=await client.from('kz_blog_taxonomy').update({description:item.description,focus_keyword:item.focus_keyword}).eq('id',id).select('*').single();if(error)throw error;return res.json({item:data});
 }catch(e){if(e.code==='23505')return res.status(409).json({error:'Már létezik ilyen címke vagy kategória.'});if(e.code==='42P01')return res.status(503).json({error:'Futtasd a database/002_kz_studio.sql migrációt.'});return errorResponse(res,e);}}
