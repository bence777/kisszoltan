import {createHmac} from 'node:crypto';
const local=new Map();
export async function rateLimit(req){
 const raw=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim().slice(0,120);
 const secret=process.env.LEAD_RATE_LIMIT_SECRET||process.env.LEAD_ENCRYPTION_KEY;
 if(!secret)throw new Error('rate_limit_not_configured');
 const key='kz:leads:'+createHmac('sha256',secret).update(raw).digest('hex');
 const url=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN;
 if(url&&token){
  const resp=await fetch(`${url.replace(/\/$/,'')}/multi-exec`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify([['INCR',key],['EXPIRE',key,900,'NX']]),signal:AbortSignal.timeout(4000)});
  if(!resp.ok)throw new Error('rate_limit_unavailable');
  const data=await resp.json();
  if(data?.[0]?.error||!Number.isFinite(Number(data?.[0]?.result)))throw new Error('rate_limit_unavailable');
  return Number(data[0].result)<=5;
 }
 // An explicitly configured external WAF is also acceptable in production.
 if(process.env.NEXT_PUBLIC_SITE_LIVE==='true'&&process.env.TRUSTED_EDGE_RATE_LIMIT!=='true')throw new Error('rate_limit_required');
 const now=Date.now();
 if(local.size>3000)for(const [k,v] of local)if(now-v.start>900000)local.delete(k);
 const old=local.get(key),current=old&&now-old.start<900000?old:{start:now,count:0};
 current.count++;local.set(key,current);
 return current.count<=5;
}
