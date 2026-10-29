import {createClient} from '@supabase/supabase-js';
let client;
export function browserAuth(){
 if(typeof window==='undefined')return null;
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)throw new Error('Publikus Supabase kliens konfiguráció hiányzik');
 if(!client)client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{flowType:'pkce',autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}});
 return client;
}
export async function getToken(){const {data}=await browserAuth().auth.getSession();return data.session?.access_token||null;}
export async function apiFetch(url,{method='GET',body}={}){
 const token=await getToken();const r=await fetch(url,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body===undefined?undefined:JSON.stringify(body)});
 const json=await r.json().catch(()=>({}));if(!r.ok)throw Error(json.error||json.message||'Sikertelen kérés');return json;
}
// A callbackhoz a PKCE verifier ugyanabban a böngészőben marad, ahol a belépést kezdeményezték.
const redirectPaths=new Set(['/admin','/admin/blog','/admin/fajlok','/admin/ingatlanok','/admin/analitika','/admin/blog/taxonomia','/admin/erdeklodesek']);
export async function sendOtp(email,redirectPath='/admin'){
 const next=redirectPaths.has(redirectPath)?redirectPath:'/admin';
 const redirectTo=`${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
 const {error}=await browserAuth().auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo,shouldCreateUser:false}});
 if(error)throw Error(error.message);
}
export async function checkOtp(email,token){const {data,error}=await browserAuth().auth.verifyOtp({email,token,type:'email'});if(error)throw Error(error.message);return data.user;}
