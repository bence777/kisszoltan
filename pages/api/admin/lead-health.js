import {adminFromRequest,db} from '../../../lib/db';
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Nem támogatott metódus.'})}
 try{if(!await adminFromRequest(req))return res.status(403).json({error:'Nincs jogosultságod.'});}catch{return res.status(503).json({error:'Az admin hitelesítés adatbázisa nem elérhető.'})}
 const enc=process.env.LEAD_ENCRYPTION_KEY||'';
 const encryptionKeyValid=Boolean(enc&&Buffer.from(enc,'base64').length===32);
 const mailReady=Boolean(process.env.RESEND_API_KEY&&process.env.LEAD_FROM_EMAIL&&process.env.LEAD_TO_EMAIL);
 const rateLimitReady=process.env.NEXT_PUBLIC_SITE_LIVE!=='true'||Boolean((process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN)||process.env.TRUSTED_EDGE_RATE_LIMIT==='true');
 let tableReady=false;
 try{const {error}=await db().from('kz_leads').select('id').limit(1);tableReady=!error;}catch{}
 return res.status(200).json({encryptionKeyValid,mailReady,rateLimitReady,tableReady,canStore:encryptionKeyValid&&tableReady&&rateLimitReady,notice:'Az e-mail értesítés és a megkeresés mentése külön lépés. Az űrlap csak sikeres mentés után jelezhet sikert.'});
}
