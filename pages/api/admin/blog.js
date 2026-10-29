import {adminFromRequest,db,method,clean,errorResponse} from '../../../lib/db';
import {readText,slugify,safeHttpUrl} from '../../../lib/blogDocument';
import {articles} from '../../../data/articles';
const allowed=['title','slug','excerpt','content','seo_title','seo_description','status','cover_url','category_slug','tags','related_mode','related_ids','related_excluded_ids','focus_keyword'];
const asIds=v=>Array.isArray(v)?[...new Set(v.map(x=>String(x).trim()).filter(x=>/^[0-9a-f-]{10,50}$/i.test(x)))].slice(0,50):[];
async function invalidate(res,slugs=[]){
 for(const path of ['/tudastar',...new Set(slugs.filter(Boolean).map(slug=>`/tudastar/${slug}`))]){
  try{await res.revalidate(path);}catch(err){console.error('[ISR] revalidation failed',path,err.message);}
 }
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Robots-Tag','noindex,nofollow');
 if(!method(req,res,['GET','POST','PATCH','DELETE']))return;
 try{
  const admin=await adminFromRequest(req);if(!admin)return res.status(403).json({error:'Csak jóváhagyott adminisztrátor használhatja.'});
  const client=db();
  if(req.method==='GET'&&req.query.history){
   const id=clean(req.query.history,50);if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:'Hibás azonosító.'});
   const {data,error}=await client.from('kz_blog_revisions').select('id,changed_at,changed_by,before_data').eq('post_id',id).order('changed_at',{ascending:false}).limit(30);
   if(error)throw error;return res.json({history:data||[]});
  }
  if(req.method==='GET'){
   const {data,error}=await client.from('kz_blog_posts').select('*').order('updated_at',{ascending:false}).limit(300);
   if(error)throw error;return res.json({posts:data||[]});
  }
  const id=clean(req.body?.id,50);
  if(req.method==='DELETE'){
   if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:'Hibás cikkazonosító.'});
   const {data:previous,error:e1}=await client.from('kz_blog_posts').select('slug').eq('id',id).maybeSingle();if(e1)throw e1;
   const {error}=await client.from('kz_blog_posts').delete().eq('id',id);if(error)throw error;
   await invalidate(res,[previous?.slug]);return res.json({ok:true});
  }
  if(req.method==='PATCH'&&!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:'Hiányzó cikkazonosító.'});
  const input=Object.fromEntries(Object.entries(req.body?.post||{}).filter(([k])=>allowed.includes(k)));
  input.title=clean(input.title,180);input.slug=slugify(input.slug||input.title).slice(0,120);
  input.excerpt=clean(input.excerpt,400);
  input.content=typeof input.content==='object'?JSON.stringify(input.content):String(input.content||'');
  input.seo_title=clean(input.seo_title,180);input.seo_description=clean(input.seo_description,400);
  input.status=input.status==='published'?'published':'draft';
  input.cover_url=clean(input.cover_url,2000)?safeHttpUrl(clean(input.cover_url,2000)):null;
  input.category_slug=slugify(input.category_slug||'').slice(0,70);
  input.focus_keyword=clean(input.focus_keyword,130);
  input.tags=Array.isArray(input.tags)?[...new Set(input.tags.map(x=>clean(x,50)).filter(Boolean))].slice(0,25):[];
  input.related_mode=['off','auto','manual'].includes(input.related_mode)?input.related_mode:'auto';
  input.related_ids=asIds(input.related_ids);input.related_excluded_ids=asIds(input.related_excluded_ids);
  if(input.title.length<4||!input.slug)return res.status(400).json({error:'Legalább 4 karakteres cím szükséges.'});
  if(input.content.length>500000)return res.status(413).json({error:'A cikk túl nagy.'});
  if(input.status==='published'&&readText(input.content).length<60)return res.status(400).json({error:'A publikált cikk legyen legalább 60 karakter.'});
  if(articles.some(a=>a.slug===input.slug))return res.status(409).json({error:'Ezzel az URL-lel már létezik a weboldalon egy szerkesztett szakmai cikk.'});
  let previous=null;
  if(req.method==='PATCH'){
   const expected=clean(req.body?.expected_updated_at,70);
   if(!expected)return res.status(428).json({error:'Hiányzó verzióazonosító. Frissítsd a szerkesztőt.'});
   const {data,error}=await client.from('kz_blog_posts').select('*').eq('id',id).maybeSingle();if(error)throw error;
   if(!data)return res.status(404).json({error:'A cikk nem található.'});
   if(data.updated_at!==expected)return res.status(409).json({error:'A cikket másik munkamenet közben módosította. A mentés nem írta felül.'});
   previous=data;
  }
  const {data:alias,error:aliasError}=await client.from('kz_blog_slug_redirects').select('post_id').eq('old_slug',input.slug).maybeSingle();if(aliasError)throw aliasError;
  if(alias&&String(alias.post_id)!==String(id||''))return res.status(409).json({error:'Ezt az URL-t másik cikk már használta.'});
  const row={...input,author_name:'Kiss Zoltán',updated_at:new Date().toISOString(),published_at:input.status==='published'?(previous?.published_at||new Date().toISOString()):null};
  const query=req.method==='POST'?client.from('kz_blog_posts').insert(row).select('*').single():client.from('kz_blog_posts').update(row).eq('id',id).eq('updated_at',previous.updated_at).select('*').maybeSingle();
  const {data,error}=await query;if(error){if(error.code==='23505')return res.status(409).json({error:'Az URL már foglalt.'});throw error;}
  if(!data)return res.status(409).json({error:'Mentési ütközés. Frissítsd a szerkesztőt.'});
  if(previous?.slug&&previous.slug!==data.slug){
   const {error:redirectError}=await client.from('kz_blog_slug_redirects').upsert({old_slug:previous.slug,post_id:data.id},{onConflict:'old_slug'});if(redirectError)throw redirectError;
  }
  if(req.body?.recordRevision===true&&previous){
   const {error:revErr}=await client.from('kz_blog_revisions').insert({post_id:data.id,before_data:previous,changed_by:admin.email});if(revErr)console.error('[revision]',revErr.message);
  }
  if(previous?.status==='published'||data.status==='published')await invalidate(res,[previous?.slug,data.slug]);
  return res.json({post:data});
 }catch(e){return errorResponse(res,e);}
}
