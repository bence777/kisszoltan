import React,{useState} from 'react';
import Head from 'next/head';
import styles from '../../styles/Admin.module.css';
import {requireAdmin} from '../../lib/server/admin-auth';
import {listLeads} from '../../lib/server/lead-store';
const states={new:'Új',contacted:'Kapcsolat felvéve',qualified:'Minősített',consultation_scheduled:'Egyeztetés',mandate_signed:'Megbízás',closed:'Lezárva',spam:'Spam'};
export async function getServerSideProps({req,res}){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');
 if(!requireAdmin(req,res))return {props:{leads:[],failed:'Nincs hozzáférés'}};
 try{return {props:{leads:await listLeads(),failed:''}};}catch{return {props:{leads:[],failed:'Adatbázis nem elérhető. Ellenőrizze a konfigurációt.'}};}
}
export default function AdminLeads({leads:initial,failed}){
 const [leads,setLeads]=useState(initial),[filter,setFilter]=useState('all'),[busy,setBusy]=useState(''),[error,setError]=useState(failed),[opened,setOpened]=useState('');
 const filtered=filter==='all'?leads:leads.filter(l=>l.status===filter);
 const counts=Object.fromEntries(Object.keys(states).map(s=>[s,leads.filter(l=>l.status===s).length]));
 async function update(id,action,status){setError('');setBusy(id);try{
  const response=await fetch('/api/admin/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,action,status})});
  const data=await response.json();if(!response.ok)throw new Error(data.message||'Sikertelen művelet.');
  const loaded=await fetch('/api/admin/leads');if(!loaded.ok)throw new Error('Frissítés nem sikerült.');
  setLeads((await loaded.json()).leads);
 }catch(e){setError(e.message);}finally{setBusy('');}}
 return <><Head><title>Érdeklődések – belső admin | Kiss Zoltán</title><meta name="robots" content="noindex,nofollow"/></Head><main className={styles.main}><div className={styles.wrap}>
 <header className={styles.head}><div><span className={styles.eyebrow}>KISS ZOLTÁN · BELSŐ RENDSZER</span><h1>Érdeklődések</h1><p>Csak jogosult hozzáférés. Titkosítva tárolt megkeresések és utánkövetés.</p></div><a href="/" rel="nofollow">Főoldal</a></header>
 <div className={styles.summary}><div><small>Összes lead</small><strong>{leads.length}</strong></div><div><small>Új érdeklődés</small><strong>{counts.new}</strong></div><div><small>Minősített</small><strong>{counts.qualified}</strong></div><div><small>Megbízás</small><strong>{counts.mandate_signed}</strong></div><div><small>Értesítésre vár</small><strong>{leads.filter(l=>l.notification_status!=='sent').length}</strong></div></div>
 <div className={styles.toolbar}><label>Szűrés <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Összes</option>{Object.entries(states).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><span>Legutóbbi {leads.length} bejegyzés</span></div>
 {error&&<p className={styles.error} role="alert">{error}</p>}
 <div className={styles.list}>{filtered.map(l=><article key={l.id} className={styles.lead}><div className={styles.leadTop}><div><span className={styles.eyebrow}>{l.kind==='buyer'?'VÁSÁRLÓ':'ELADÓ / EGYÉB'} · {l.property_code||'ÁLTALÁNOS'}</span><h2>{l.details.name}</h2><p>{l.type} · {new Date(l.created_at).toLocaleString('hu-HU')}</p></div><button type="button" className={styles.toggle} onClick={()=>setOpened(opened===l.id?'':l.id)} aria-expanded={opened===l.id}>{opened===l.id?'Bezárás':'Részletek'}</button></div>
 <div className={styles.leadActions}><label>Státusz <select aria-label={`${l.details.name} státusza`} value={l.status} disabled={busy===l.id} onChange={e=>update(l.id,'status',e.target.value)}>{Object.entries(states).map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></label><span className={l.notification_status==='sent'?styles.ok:styles.bad}>Értesítés: {l.notification_status==='sent'?'elküldve':l.notification_status==='failed'?'hiba':'függőben'}</span>{l.notification_status!=='sent'&&<button disabled={busy===l.id} className={styles.toggle} onClick={()=>update(l.id,'retry_owner')}>Értesítés újraküldése</button>}</div>
 {opened===l.id&&<div className={styles.details}><div><strong>Elérhetőség</strong><p><a href={`mailto:${l.details.email}`}>{l.details.email}</a>{l.details.phone&&<> · <a href={`tel:${l.details.phone}`}>{l.details.phone}</a></>}</p></div><div><strong>Üzenet</strong><p className={styles.message}>{l.details.message}</p></div><div><strong>Forrás</strong><p>Belépési oldal: {l.landing_path||'—'} · Lead oldal: {l.source_path} · Csatorna: {l.utm_source||'ismeretlen'}</p></div><div><strong>Visszaigazoló levél</strong><p>{l.receipt_status==='sent'?'Elküldve':l.receipt_status==='failed'?'Nem sikerült':'Függőben'}</p></div><div><strong>Adatkezelés</strong><p><button type="button" className={styles.toggle} disabled={busy===l.id} onClick={()=>{if(window.confirm('Véglegesen törli ezt a leadet? Ez nem vonható vissza.'))update(l.id,'delete');}}>Lead végleges törlése</button></p></div></div>}
 </article>)}{!filtered.length&&<p>Nincs ebben a kategóriában megkeresés.</p>}</div>
 <p className={styles.foot}>Az adminfelület nem helyettesíti a végleges adatmegőrzési és törlési szabályzatot. A leadek adatait csak az ügyintézéshez szükséges ideig kezelje.</p>
 </div></main></>;
}

AdminLeads.noGlobalUI=true;
