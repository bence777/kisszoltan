/** Server-only lead storage. Never import this module in a browser component. */
import {createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';

function settings(){
 const url=process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 const secret=process.env.LEAD_ENCRYPTION_KEY;
 if(!url||!key||!secret)throw new Error('lead_store_not_configured');
 if(!/^https:\/\/[\w.-]+\/$/.test(url.endsWith('/')?url:url+'/'))throw new Error('invalid_supabase_url');
 const encryptionKey=Buffer.from(secret,'base64');
 if(encryptionKey.length!==32)throw new Error('invalid_lead_encryption_key');
 return {url:url.replace(/\/$/,''),key,encryptionKey};
}
export function encryptLead(details){
 const {encryptionKey}=settings();
 const iv=randomBytes(12);
 const cipher=createCipheriv('aes-256-gcm',encryptionKey,iv);
 cipher.setAAD(Buffer.from('kiss-zoltan-leads-v1'));
 const ciphertext=Buffer.concat([cipher.update(JSON.stringify(details),'utf8'),cipher.final()]);
 return `enc:v1:${iv.toString('base64')}:${cipher.getAuthTag().toString('base64')}:${ciphertext.toString('base64')}`;
}
export function decryptLead(raw){
 const {encryptionKey}=settings();
 const [prefix,version,iv,tag,value]=String(raw).split(':');
 if(prefix!=='enc'||version!=='v1'||!iv||!tag||!value)throw new Error('invalid_encrypted_lead');
 const decipher=createDecipheriv('aes-256-gcm',encryptionKey,Buffer.from(iv,'base64'));
 decipher.setAAD(Buffer.from('kiss-zoltan-leads-v1'));
 decipher.setAuthTag(Buffer.from(tag,'base64'));
 return JSON.parse(Buffer.concat([decipher.update(Buffer.from(value,'base64')),decipher.final()]).toString('utf8'));
}
async function query(method,path,body,prefer){
 const {url,key}=settings();
 const response=await fetch(`${url}/rest/v1/${path}`,{
  method,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',...(prefer?{Prefer:prefer}:{})},
  body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(10000)
 });
 const result=await response.json().catch(()=>null);
 if(!response.ok){console.error('Supabase lead storage failure',response.status,result?.code||'unknown');throw new Error('lead_storage_failed');}
 return result;
}
export async function insertLead(row){
 return query('POST','kz_leads?on_conflict=submission_id',row,'resolution=ignore-duplicates,return=representation');
}
export async function getBySubmissionId(id){
 const rows=await query('GET',`kz_leads?submission_id=eq.${encodeURIComponent(id)}&select=id,notification_status,receipt_status`);
 return rows?.[0]||null;
}
export async function patchLead(id,patch){
 const rows=await query('PATCH',`kz_leads?id=eq.${encodeURIComponent(id)}&select=id`,patch,'return=representation');
 if(!rows?.length)throw new Error('lead_not_found');
 return rows[0];
}
export async function listLeads(limit=150){
 const rows=await query('GET',`kz_leads?select=*&order=created_at.desc&limit=${Math.min(Math.max(limit,1),200)}`);
 return (rows||[]).map(({encrypted_payload,...rest})=>({...rest,details:decryptLead(encrypted_payload)}));
}
export async function getLead(id){
 const rows=await query('GET',`kz_leads?id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
 if(!rows?.length)throw new Error('lead_not_found');
 return {...rows[0],details:decryptLead(rows[0].encrypted_payload)};
}

export async function deleteLead(id){
 await query('DELETE',`kz_leads?id=eq.${encodeURIComponent(id)}`,undefined,'return=minimal');
}
