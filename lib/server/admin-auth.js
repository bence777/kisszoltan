import {scryptSync,timingSafeEqual} from 'node:crypto';
const reject=res=>{res.setHeader('WWW-Authenticate','Basic realm="Kiss Zoltan admin", charset="UTF-8"');res.setHeader('Cache-Control','no-store');res.statusCode=401;};
export function adminAuthorized(req){
 const auth=String(req.headers.authorization||'');
 if(!auth.startsWith('Basic ')||auth.length>1600)return false;
 const user=process.env.ADMIN_USER,stored=process.env.ADMIN_PASSWORD_SCRYPT;
 if(!user||!stored)return false;
 const [salt,hex]=stored.split(':');
 if(!/^[a-f0-9]{32}$/.test(salt||'')||!/^[a-f0-9]{128}$/.test(hex||''))return false;
 try{
  const clear=Buffer.from(auth.slice(6),'base64').toString('utf8');
  const position=clear.indexOf(':');
  if(position<0||clear.slice(0,position)!==user)return false;
  const pass=clear.slice(position+1);
  if(pass.length>250)return false;
  const actual=scryptSync(pass,Buffer.from(salt,'hex'),64);
  return timingSafeEqual(actual,Buffer.from(hex,'hex'));
 }catch{return false;}
}
export function requireAdmin(req,res){if(adminAuthorized(req))return true;reject(res);return false;}
export function adminRequestOriginValid(req){
 const source=String(req.headers.origin||'');
 if(!source)return false;
 try{return new URL(source).host===req.headers.host&&new URL(source).protocol==='https:' || (process.env.NODE_ENV!=='production'&&new URL(source).host===req.headers.host);}catch{return false;}
}
