import {createClient} from '@supabase/supabase-js';

let instance;
export function db(){
  const url=process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw new Error('Hiányzó SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  if(!instance)instance=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
  return instance;
}
export async function userFromRequest(req){
  const token=(req.headers.authorization||'').match(/^Bearer (.+)$/)?.[1];
  if(!token) return null;
  const {data,error}=await db().auth.getUser(token);
  return error?null:data.user;
}
export async function adminFromRequest(req){
  const user=await userFromRequest(req);
  const admins=(process.env.ADMIN_EMAILS||process.env.ADMIN_EMAIL||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  return user&&user.email_confirmed_at&&admins.includes(user.email?.toLowerCase())?user:null;
}
export function method(req,res,allowed){if(!allowed.includes(req.method)){res.setHeader('Allow',allowed.join(', '));res.status(405).json({error:'A kérés típusa nem támogatott.'});return false;}return true;}
export function errorResponse(res,e){console.error('[API]',e);return res.status(500).json({error:'Átmeneti rendszerhiba. Kérlek, próbáld újra.'});}
export function clean(value,max=150){return String(value??'').trim().slice(0,max);}
export function safeEmail(v){const s=clean(v,254).toLowerCase();return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)?s:null;}
export function configured(){return Boolean((process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL)&&process.env.SUPABASE_SERVICE_ROLE_KEY);}
