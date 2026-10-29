import Head from 'next/head';
import Link from 'next/link';
import {useState} from 'react';
const NAV=[
 {section:'ÁTTEKINTÉS',links:[{id:'dashboard',label:'Vezérlőpult',href:'/admin'},{id:'analytics',label:'Analitika',href:'/admin/analitika'},{id:'leads',label:'Érdeklődések',href:'/admin/erdeklodesek'}]},
 {section:'INGATLANOK',links:[{id:'properties',label:'Ingatlanok kezelése',href:'/admin/ingatlanok'}]},
 {section:'TARTALOM',links:[{id:'blog',label:'Blogstúdió',href:'/admin/blog'},{id:'taxonomy',label:'Kategóriák és címkék',href:'/admin/blog/taxonomia'}]},
 {section:'TÁRHELY',links:[{id:'files',label:'Tárhely és fájlok',href:'/admin/fajlok'}]}
];
export default function AdminShell({title,subtitle,user,onSignOut,active='dashboard',children}){
 const [menuOpen,setMenuOpen]=useState(false);const close=()=>setMenuOpen(false);
 return <div className="admin-app kz-admin-app"><Head><title>{title} | Kiss Zoltán Admin</title><meta name="robots" content="noindex,nofollow"/></Head>
 {user&&<><button className={`admin-overlay ${menuOpen?'is-visible':''}`} type="button" aria-label="Menü bezárása" onClick={close} tabIndex={menuOpen?0:-1}/><aside className={`admin-sidebar ${menuOpen?'is-open':''}`} aria-label="Admin navigáció"><Link href="/admin" className="admin-brand" onClick={close}><span className="admin-brand-mark">KZ</span><span><strong>Kiss Zoltán</strong><small>Adminisztráció</small></span></Link><nav className="admin-nav">{NAV.map(group=><div className="admin-nav-group" key={group.section}><p className="admin-nav-label">{group.section}</p>{group.links.map(item=><Link key={item.id} href={item.href} onClick={close} className={`admin-nav-item ${active===item.id?'is-current':''}`}>{item.label}{active===item.id&&<span className="admin-nav-dot"/>}</Link>)}</div>)}</nav><div className="admin-sidebar-bottom"><Link href="/" className="admin-visit-site" target="_blank" rel="noopener noreferrer">Weboldal megnyitása</Link><div className="admin-account"><span className="admin-avatar">{user.email?.slice(0,1).toUpperCase()||'A'}</span><div><strong>Bejelentkezve</strong><small>{user.email}</small></div></div><button type="button" className="admin-signout" onClick={onSignOut}>Kijelentkezés</button></div></aside></>}
 <div className={`admin-main ${!user?'admin-main-guest':''}`}><header className="admin-topbar"><div className="admin-topbar-left">{user&&<button type="button" className="admin-menu-trigger" onClick={()=>setMenuOpen(x=>!x)} aria-label="Admin menü megnyitása" aria-expanded={menuOpen}><span/><span/><span/></button>}<span className="admin-topbar-label">Kiss Zoltán <span>/</span> Admin</span></div>{user&&<span className="admin-topbar-status"><span/> Admin felület</span>}</header><main className={`admin-content ${!user?'admin-content-guest':''}`}><div className="admin-heading"><div><span className="admin-eyebrow">KEZELŐFELÜLET</span><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div></div>{children}</main></div></div>;
}
