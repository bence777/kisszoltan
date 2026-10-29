/** Local environment readiness check. Never logs secret values. */
import {readFileSync,existsSync} from 'node:fs';
const file=existsSync('.env.local')?'.env.local':'.env';
if(!existsSync(file)){console.error('Hiányzik a .env.local fájl. Másold a .env.example mintát.');process.exit(1)}
const values={};for(const line of readFileSync(file,'utf8').split(/\r?\n/)){const m=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);if(m)values[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'')}
const missing=[],warnings=[];for(const key of ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','ADMIN_EMAILS','LEAD_ENCRYPTION_KEY']){if(!values[key]||/YOUR_|REPLACE_|PROJECT\.supabase|example\.com|pelda\.hu/.test(values[key]))missing.push(key)}
if(values.LEAD_ENCRYPTION_KEY){let len=0;try{len=Buffer.from(values.LEAD_ENCRYPTION_KEY,'base64').length}catch{}if(len!==32&&!missing.includes('LEAD_ENCRYPTION_KEY'))missing.push('LEAD_ENCRYPTION_KEY (pontosan 32 bájt base64)')}
for(const key of ['RESEND_API_KEY','LEAD_FROM_EMAIL','LEAD_TO_EMAIL'])if(!values[key]||/YOUR_|example\.com|your-verified-domain/.test(values[key]))warnings.push(key);
if(values.NEXT_PUBLIC_SITE_LIVE==='true'&&!((values.UPSTASH_REDIS_REST_URL&&values.UPSTASH_REDIS_REST_TOKEN)||values.TRUSTED_EDGE_RATE_LIMIT==='true'))missing.push('UPSTASH_REDIS_REST_URL/TOKEN vagy igazolt TRUSTED_EDGE_RATE_LIMIT');
console.log('Kiss Zoltán – konfiguráció ellenőrzése');
console.log(missing.length?'HIÁNYZÓ / HIBÁS: '+missing.join(', '):'Az alap Supabase és lead titkosítási változók formailag rendben.');
if(warnings.length)console.log('E-mail küldéshez még beállítandó: '+warnings.join(', '));
console.log('Fontos: a database/001_kz_leads.sql és 002_kz_studio.sql migrációkat külön futtatni kell Supabase-ben.');
process.exit(missing.length?1:0);
