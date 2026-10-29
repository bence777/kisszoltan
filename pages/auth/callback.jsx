import Head from 'next/head';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/router';
import {browserAuth} from '../../lib/browserAuth';

const destinations=new Set(['/admin','/admin/blog','/admin/fajlok','/admin/ingatlanok','/admin/analitika','/admin/blog/taxonomia','/admin/erdeklodesek']);
function safeNext(value){return typeof value==='string'&&destinations.has(value)?value:'/admin';}

export default function AuthCallback(){
  const router=useRouter();
  const [error,setError]=useState('');
  const exchangePromise=useRef(null);
  const next=safeNext(router.query.next);
  useEffect(()=>{
    if(!router.isReady)return;
    let active=true;
    // Fejlesztői StrictMode esetén sem váltjuk be kétszer az egyszer használható kódot.
    if(!exchangePromise.current){
      exchangePromise.current=(async()=>{
        const params=new URLSearchParams(window.location.search);
        const code=params.get('code');
        const tokenHash=params.get('token_hash');
        const type=params.get('type');
        const auth=browserAuth();
        if(code){
          const {error:exchangeError}=await auth.auth.exchangeCodeForSession(code);
          if(exchangeError)throw exchangeError;
        }else if(tokenHash&&type){
          const {error:verifyError}=await auth.auth.verifyOtp({token_hash:tokenHash,type});
          if(verifyError)throw verifyError;
        }else{
          const {data:{session},error:sessionError}=await auth.auth.getSession();
          if(sessionError||!session)throw new Error('A bejelentkezési link hiányos vagy már nem érvényes.');
        }
        return safeNext(params.get('next'));
      })();
    }
    exchangePromise.current.then(destination=>{if(active)router.replace(destination);}).catch(e=>{if(active)setError(e.message||'Nem sikerült a bejelentkezés.');});
    return ()=>{active=false;};
  },[router.isReady]);
  return <div className="admin-app admin-auth-callback"><Head><title>Bejelentkezés | Kiss Zoltán</title><meta name="robots" content="noindex,nofollow"/></Head><div className="admin-callback-card"><span className="admin-brand-mark">KZ</span><h1>{error?'Nem sikerült a belépés':'Bejelentkezés ellenőrzése…'}</h1>{error?<><p>{error}</p><p>Ha az e-mailes hivatkozást másik böngészőben nyitottad meg, kérj új linket abban a böngészőben, ahol be szeretnél lépni.</p><Link className="admin-btn admin-btn-primary" href={next}>Új belépés</Link></>:<p>Az e-mailben kapott link ellenőrzése után automatikusan a megfelelő oldalra irányítunk.</p>}</div></div>;
}
