import {adminFromRequest,db,method} from '../../../lib/db';
import {randomUUID} from 'node:crypto';
const PUBLIC_BUCKET='kz-public-media',PRIVATE_BUCKET='kz-private-media';
const visibility=v=>v==='private'?'private':'public';
const allowed=/\.(?:jpe?g|png|webp|avif|gif|pdf|mp4|webm|mov|mp3|m4a|wav|ogg|txt|docx|xlsx|pptx|zip)$/i;
const namePart=s=>{
 const v=String(s||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_.-]+/g,'-').replace(/^\.+/,'').slice(0,110);
 if(!v||v==='.'||v==='..'||!/[a-zA-Z0-9]/.test(v))throw Error('Érvénytelen fájlnév/mappanév.');return v;
};
const folderPath=s=>String(s||'').split('/').filter(Boolean).map(namePart).join('/');
const keyPath=s=>{const parts=String(s||'').split('/').filter(Boolean);if(!parts.length)throw Error('Hiányzó fájl.');return parts.map(namePart).join('/');};
const join=(a,b)=>a?`${a}/${b}`:b;
const fail=(r,message,code=400)=>r.status(code).json({error:message});
async function all(storage,folder){let items=[],offset=0;do{const {data,error}=await storage.list(folder,{limit:100,offset,sortBy:{column:'name',order:'asc'}});if(error)throw error;items.push(...(data||[]));if(!data||data.length<100)break;offset+=data.length;}while(offset<10000);return items;}
const isFolder=x=>!x.id||!x.metadata;
async function tree(storage,folder,depth=0){if(depth>12)throw Error('Túl mély mappaszerkezet.');const children=await all(storage,folder);let files=[];for(const item of children){const path=join(folder,item.name);if(isFolder(item))files.push(...await tree(storage,path,depth+1));else files.push(path);}return files;}
export default async function handler(req,res){
 if(!method(req,res,['GET','POST']))return;
 try{
  if(!await adminFromRequest(req))return fail(res,'Csak adminisztrátor használhatja a tárhelyet.',403);
  res.setHeader('Cache-Control','no-store');const area=visibility(req.method==='GET'?req.query.visibility:req.body?.visibility);const storage=db().storage.from(area==='private'?PRIVATE_BUCKET:PUBLIC_BUCKET);
  if(req.method==='GET'){
   const folder=folderPath(req.query.folder||'');const entries=await all(storage,folder);
   const records=[];
   for(const e of entries.filter(x=>x.name!=='.keep')){
    const path=join(folder,e.name),folderEntry=isFolder(e);
    let url=null;
    if(!folderEntry){
     if(area==='private'){
      const {data,error}=await storage.createSignedUrl(path,3600);
      if(error)throw error;
      url=data.signedUrl;
     }else url=storage.getPublicUrl(path).data.publicUrl;
    }
    records.push({...e,isFolder:folderEntry,path,url});
   }
   return res.json({folder,visibility:area,entries:records});
  }
  const body=req.body||{};const action=body.action;
  if(action==='sign'){
   const size=Number(body.size);if(!Number.isFinite(size)||size<=0||size>50*1024*1024)return fail(res,'A megengedett fájlméret legfeljebb 50 MB.');
   const name=namePart(body.name);if(!allowed.test(name))return fail(res,'Nem engedélyezett fájltípus.');
   if(String(body.contentType||'').includes('svg')||String(body.contentType||'').includes('html'))return fail(res,'Nem engedélyezett tartalomtípus.');
   const folder=folderPath(body.folder||'');const ext=(name.match(/\.[^.]+$/)||[''])[0].toLowerCase();const base=name.slice(0,-ext.length||undefined).slice(0,70);
   const path=join(folder,`${base}-${randomUUID().slice(0,10)}${ext}`);
   const {data,error}=await storage.createSignedUploadUrl(path);if(error)throw error;
   return res.json({path,token:data.token,url:area==='public'?storage.getPublicUrl(path).data.publicUrl:null,visibility:area});
  }
  if(action==='createFolder'){
   const folder=folderPath(body.folder||''),name=namePart(body.name);const path=join(join(folder,name),'.keep');
   const {error}=await storage.upload(path,new Uint8Array([0]),{contentType:'application/octet-stream',upsert:false});if(error)throw error;return res.json({ok:true});
  }
  if(action==='delete'){
   const path=keyPath(body.path);const paths=body.folder?await tree(storage,path):[path];
   if(!paths.length)return res.json({ok:true});
   for(let i=0;i<paths.length;i+=100){const {error}=await storage.remove(paths.slice(i,i+100));if(error)throw error;}
   return res.json({ok:true});
  }
  if(action==='move'||action==='rename'){
   const original=keyPath(body.path),folder=folderPath(body.toFolder??original.split('/').slice(0,-1).join('/'));
   const name=namePart(body.name||original.split('/').at(-1));
   if(!body.folder){const previousExt=original.split('/').at(-1).split('.').at(-1).toLowerCase();const newExt=name.split('.').at(-1).toLowerCase();if(previousExt!==newExt||!allowed.test(name))return fail(res,'Fájl átnevezésekor a kiterjesztés nem változtatható meg.');}
   const target=join(folder,name);if(target===original)return res.json({ok:true});
   if(body.folder&&target.startsWith(original+'/'))return fail(res,'Mappát nem lehet önmagába áthelyezni.');
   if(body.folder){
    const files=await tree(storage,original);
    if(files.length>300)return fail(res,'Egyszerre legfeljebb 300 fájl mozgatható.');
    // Preserve directory marker even for an empty folder.
    for(const file of files){const next=target+file.slice(original.length);const {error}=await storage.move(file,next);if(error)throw error;}
   }else{const {error}=await storage.move(original,target);if(error)throw error;}
   return res.json({ok:true});
  }
  return fail(res,'Ismeretlen művelet.');
 }catch(e){console.error('[media]',e);return fail(res,'Átmeneti tárhelyhiba. Ellenőrizd a szervernaplót.',500);}
}
