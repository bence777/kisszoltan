import {browserAuth,apiFetch} from './browserAuth';
export const BUCKET='kz-public-media';
export const PRIVATE_BUCKET='kz-private-media';
export const MAX_BYTES=50*1024*1024;
const imageTypes=new Set(['image/jpeg','image/png','image/webp','image/avif']);
const allowedExtensions=/\.(?:jpe?g|png|webp|avif|gif|pdf|mp4|webm|mov|mp3|m4a|wav|ogg|txt|docx|xlsx|pptx|zip)$/i;
export const formatBytes=n=>n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(1)} MB`;
export async function optimizeFile(file,{enabled=true,quality=.82,maxSize=2400}={}){
 if(!enabled||!imageTypes.has(file.type)||typeof document==='undefined')return file;
 let bitmap;
 try{
  bitmap=await createImageBitmap(file);
  const scale=Math.min(1,maxSize/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
  if(!blob||(! (scale<1) &&blob.size>=file.size))return file;
  return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.webp',{type:'image/webp'});
 }catch{return file;}finally{bitmap?.close?.();}
}
export async function uploadFile(file,folder='',options={}){
 if(!file||!allowedExtensions.test(file.name)||file.type==='image/svg+xml')throw Error('Ez a fájltípus nem engedélyezett.');
 if(file.size>MAX_BYTES)throw Error('Legfeljebb 50 MB-os fájl tölthető fel.');
 const processed=await optimizeFile(file,options);
 const visibility=options.visibility==='private'?'private':'public';
 const {path,token,url}=await apiFetch('/api/admin/media',{method:'POST',body:{action:'sign',folder,name:processed.name,size:processed.size,visibility,contentType:processed.type||'application/octet-stream'}});
 const {error}=await browserAuth().storage.from(visibility==='private'?PRIVATE_BUCKET:BUCKET).uploadToSignedUrl(path,token,processed,{contentType:processed.type||'application/octet-stream',cacheControl:'3600'});
 if(error)throw Error('Feltöltési hiba: '+error.message);
 return {path,url,name:processed.name,from:file.size,to:processed.size};
}
