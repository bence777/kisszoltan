/** Fast offline API contract tests; does not call Supabase, Resend or Upstash. */
import {randomBytes,randomUUID,scryptSync} from 'node:crypto';
import assert from 'node:assert/strict';
const leads=new Map();
const encKey=randomBytes(32);
Object.assign(process.env,{
 SUPABASE_URL:'https://local-test.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'local-unit-test-only',LEAD_ENCRYPTION_KEY:encKey.toString('base64'),
 LEAD_RATE_LIMIT_SECRET:'local-unit-test',RESEND_API_KEY:'mock-key',LEAD_FROM_EMAIL:'test@verified.example',LEAD_TO_EMAIL:'office@example.com',
 NEXT_PUBLIC_SITE_LIVE:'false',ADMIN_USER:'office'
});
const salt=randomBytes(16);process.env.ADMIN_PASSWORD_SCRYPT=`${salt.toString('hex')}:${scryptSync('unit-test-long-admin-password!',salt,64).toString('hex')}`;
let failMail=false,failDB=false, emailCount=0;
const json=(status,data)=>({ok:status>=200&&status<300,status,async json(){return data;}});
globalThis.fetch=async (url,options={})=>{
 if(String(url).includes('/rest/v1/kz_leads')){
  if(failDB)return json(503,{code:'MOCK_UNAVAILABLE'});
  const q=new URL(url).searchParams,method=options.method||'GET';
  if(method==='POST'){
   const row=JSON.parse(options.body);if([...leads.values()].some(l=>l.submission_id===row.submission_id))return json(201,[]);
   const inserted={id:randomUUID(),created_at:new Date().toISOString(),status:'new',notification_status:'pending',receipt_status:'pending',...row};leads.set(inserted.id,inserted);return json(201,[inserted]);
  }
  const rows=[...leads.values()].filter(l=>!q.get('id')||l.id===q.get('id').slice(3)).filter(l=>!q.get('submission_id')||l.submission_id===q.get('submission_id').slice(3));
  if(method==='PATCH'){const patch=JSON.parse(options.body);rows.forEach(l=>Object.assign(l,patch));return json(200,rows);}
  if(method==='DELETE'){rows.forEach(l=>leads.delete(l.id));return {ok:true,status:204,json:async()=>null};}
  return json(200,rows);
 }
 if(String(url)==='https://api.resend.com/emails'){emailCount++;return failMail?json(500,{message:'mail unavailable'}):json(200,{id:randomUUID()});}
 throw new Error('Unexpected outgoing request: '+url);
};
const [{default:handler},{default:adminHandler},{encryptLead,decryptLead}]=await Promise.all([
 import('../pages/api/lead.js'),import('../pages/api/admin/leads.js'),import('../lib/server/lead-store.js')]);
function makeReq(body,ip){return {method:'POST',body,headers:{host:'kisszoltan.com',origin:'https://kisszoltan.com','content-type':'application/json','x-forwarded-for':ip},socket:{remoteAddress:'127.0.0.1'}};}
function makeRes(){return {statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;return this;},status(v){this.statusCode=v;return this;},json(data){this.body=data;return this;},end(data){this.body=data;return this;}};}
async function run(req,fn=handler){const res=makeRes();await fn(req,res);return res;}
function example(){return {name:'Példa Elek',email:'elek@example.com',phone:'+36301234567',kind:'seller',type:'Eladói konzultáció',message:'Kérek egyeztetést az ingatlanomról.',consent:true,source:'/kapcsolat',landingPath:'/',submissionId:randomUUID()};}
const enc=encryptLead({name:'titkos adat'});assert.match(enc,/^enc:v1:/);assert.deepEqual(decryptLead(enc),{name:'titkos adat'});assert.throws(()=>decryptLead(enc.slice(0,-4)+'ABCD'));
let invalid=await run(makeReq({...example(),email:'bad'},'198.18.0.1'));assert.equal(invalid.statusCode,422);
const first=example();let success=await run(makeReq(first,'198.18.0.2'));assert.equal(success.statusCode,201);assert.equal(leads.size,1);assert.equal(success.body.stored,true);assert.equal(success.body.notificationDelayed,false);assert.equal(emailCount,2);
let duplicate=await run(makeReq(first,'198.18.0.2'));assert.equal(duplicate.statusCode,200);assert.equal(leads.size,1);assert.equal(emailCount,2);
failMail=true;let delayed=await run(makeReq(example(),'198.18.0.3'));assert.equal(delayed.statusCode,202);assert.equal(delayed.body.notificationDelayed,true);assert.equal(leads.size,2);
failMail=false;failDB=true;let blocked=await run(makeReq(example(),'198.18.0.4'));assert.equal(blocked.statusCode,503);assert.equal(leads.size,2);failDB=false;
let wrongOrigin=makeReq(example(),'198.18.0.5');wrongOrigin.headers.origin='https://attacker.example';assert.equal((await run(wrongOrigin)).statusCode,403);
let attempts=[];for(let i=0;i<6;i++)attempts.push((await run(makeReq(example(),'198.18.0.6'))).statusCode);assert.equal(attempts.at(-1),429);
// The first five requests in a rate-limit window succeed and create mock rows.
for(const id of [...leads.keys()].slice(2))leads.delete(id);
const auth=Buffer.from('office:unit-test-long-admin-password!').toString('base64');
let reqAdmin=makeReq({id:[...leads.keys()][0],action:'status',status:'qualified'},'198.18.0.7');reqAdmin.headers.authorization='Basic '+auth;let changed=await run(reqAdmin,adminHandler);assert.equal(changed.statusCode,200);
assert.equal([...leads.values()][0].status,'qualified');
reqAdmin=makeReq({id:[...leads.keys()][1],action:'retry_owner'},'198.18.0.7');reqAdmin.headers.authorization='Basic '+auth;let retry=await run(reqAdmin,adminHandler);assert.equal(retry.statusCode,200);assert.equal([...leads.values()][1].notification_status,'sent');
reqAdmin=makeReq({id:[...leads.keys()][1],action:'delete'},'198.18.0.7');reqAdmin.headers.authorization='Basic '+auth;let removed=await run(reqAdmin,adminHandler);assert.equal(removed.statusCode,200);assert.equal(leads.size,1);
console.log('PASS: encryption, malformed request, stored lead, idempotence, mail failure, DB failure, origin, throttling, admin status/retry/delete');
