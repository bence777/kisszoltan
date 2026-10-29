import {useEffect,useState} from 'react';
import AdminShell from '../../components/AdminShell';
import EmailLogin from '../../components/EmailLogin';
import MediaLibrary from '../../components/blog/MediaLibrary';
import {browserAuth} from '../../lib/browserAuth';
export default function StorageAdmin(){
 const [user,setUser]=useState(undefined);
 useEffect(()=>{browserAuth().auth.getUser().then(({data})=>setUser(data.user)).catch(()=>setUser(null));},[]);
 return <AdminShell title={user?'Tárhely és fájlok':'Admin bejelentkezés'} subtitle={user?'Ingatlanfotók, cikk-képek és dokumentumok – nyilvános és privát mappákban.':'Belépés szükséges.'} user={user} active="files" onSignOut={async()=>{await browserAuth().auth.signOut();setUser(null);}}>{user===undefined?<p>Betöltés…</p>:!user?<EmailLogin title="Admin belépés" redirectPath="/admin/fajlok" onSuccess={setUser}/>:<MediaLibrary/>}</AdminShell>;
}
