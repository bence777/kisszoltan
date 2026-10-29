import {useEffect,useState} from 'react';
import Link from 'next/link';
import AdminShell from '../../components/AdminShell';
import EmailLogin from '../../components/EmailLogin';
import {browserAuth,apiFetch} from '../../lib/browserAuth';
import {Stat,Panel,Notice,numberHU} from '../../components/AdminUI';
const quick=[{href:'/admin/ingatlanok',num:'01',title:'Ingatlanok',desc:'Árak, képek és státuszok naprakészen.'},{href:'/admin/erdeklodesek',num:'02',title:'Érdeklődések',desc:'Megkeresések és ügyfélkapcsolatok.'},{href:'/admin/blog',num:'03',title:'Blogstúdió',desc:'Szakmai cikkek, publikáció és SEO.'},{href:'/admin/fajlok',num:'04',title:'Médiatár',desc:'Fotók, dokumentumok és mappák.'}];
export default function AdminHome(){
 const [user,setUser]=useState(undefined),[stats,setStats]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 useEffect(()=>{browserAuth().auth.getUser().then(({data})=>setUser(data.user)).catch(e=>{setError(e.message);setUser(null)})},[]);
 useEffect(()=>{if(!user)return;let alive=true;setLoading(true);apiFetch('/api/admin/analitika').then(x=>{if(alive)setStats(x)}).catch(e=>{if(alive)setError(e.message)}).finally(()=>{if(alive)setLoading(false)});return()=>{alive=false}},[user?.id]);
 return <AdminShell title={user?'Vezérlőpult':'Admin bejelentkezés'} subtitle={user?'A Kiss Zoltán weboldal és az értékesítési folyamat központja.':'Jóváhagyott e-mail-címmel lehet belépni.'} user={user} active="dashboard" onSignOut={async()=>{await browserAuth().auth.signOut();setUser(null)}}>{user===undefined?<p>Betöltés…</p>:!user?<EmailLogin title="Kiss Zoltán – admin belépés" redirectPath="/admin" onSuccess={setUser}/>:<div className="kz-workspace">
 <div className="kz-v13-welcome"><div><span className="kz-v13-label">ÁTTEKINTÉS · 30 NAP</span><h2>Jó munkát kívánunk.</h2><p>Az ingatlanportfólió, a szakmai tartalmak és az érdeklődések egy helyen.</p></div><Link href="/admin/ingatlanok" className="kz-v13-button is-light">Ingatlanok kezelése <span>↗</span></Link></div>
 {error&&<Notice>Az analitika nem érhető el: {error}. A mérőszámok ezért nem jelennek meg; ez nem nulla forgalmat jelent.</Notice>}
 <div className="kz-v13-metrics is-four"><Stat label="Ingatlanmegtekintések" value={stats?numberHU(stats.pages.filter(([p])=>p.startsWith('/ingatlan/')).reduce((a,[,n])=>a+n,0)):'—'} detail="Elmúlt 30 nap" accent/><Stat label="Összes oldalmegtekintés" value={stats?numberHU(stats.totals.pageViews):'—'} detail="Elmúlt 30 nap"/><Stat label="Értékiránytű indítások" value={stats?numberHU(stats.totals.valuationStarts):'—'} detail="Elmúlt 30 nap"/><Stat label="Webes érdeklődések" value={stats?numberHU(stats.totals.sellerLeads+stats.totals.buyerLeads):'—'} detail="Konverziós események"/></div>
 <Panel title="Gyors műveletek" description="A legfontosabb feladatokhoz egyetlen kattintással eljuthatsz."><div className="kz-v13-quick-grid">{quick.map(x=><Link key={x.href} href={x.href} className="kz-v13-quick"><span>{x.num}</span><strong>{x.title}</strong><p>{x.desc}</p><span className="kz-v13-quick-arrow">↗</span></Link>)}</div></Panel>
 <p className="kz-v13-hint">A kimutatás kizárólag a bekapcsolt mérésből származó tényleges adatokat tartalmazza. {loading?'Az adatok betöltése folyamatban van.':''}</p>
 </div>}</AdminShell>
}
