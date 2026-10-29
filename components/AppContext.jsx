import {sendAnalytics} from '../lib/analytics-client';
import React,{createContext,useContext,useEffect,useState} from 'react';
const Context=createContext(null);
export const track=(event,data={})=>{
 if(typeof window==='undefined')return;
 window.dataLayer=window.dataLayer||[];
 window.dataLayer.push({event,...data,site_demo:process.env.NEXT_PUBLIC_SITE_LIVE !== 'true'});
 sendAnalytics(event,data);
};
export function AppProvider({children}){
 const [saved,setSaved]=useState([]),[modal,setModal]=useState(null),[drawer,setDrawer]=useState(false),[toast,setToast]=useState(''),[mounted,setMounted]=useState(false);
 useEffect(()=>{
  setMounted(true);
  try{setSaved(JSON.parse(localStorage.getItem('kisszoltan-demo-saved')||'[]'));}catch{setSaved([])}
  try{
   if(!sessionStorage.getItem('kz_landing_path'))sessionStorage.setItem('kz_landing_path',window.location.pathname);
   if(!sessionStorage.getItem('kz_utm_source')){
    const value=new URLSearchParams(window.location.search).get('utm_source')||'';
    if(/^[a-zA-Z0-9_.-]{1,80}$/.test(value))sessionStorage.setItem('kz_utm_source',value);
   }
  }catch{}
 },[]);
 useEffect(()=>{if(mounted)localStorage.setItem('kisszoltan-demo-saved',JSON.stringify(saved));},[saved,mounted]);
 const notify=msg=>{setToast(msg);};
 const toggleSaved=id=>{
  const exists=saved.includes(id);setSaved(old=>exists?old.filter(x=>x!==id):[...old,id]);
  track('add_to_wishlist',{property_id:id,action:exists?'remove':'add'});
  notify(exists?'Eltávolítva a mentett ingatlanok közül.':'Ingatlan elmentve.');
 };
 return <Context.Provider value={{saved,toggleSaved,modal,setModal,drawer,setDrawer,toast,setToast,notify,mounted}}>{children}</Context.Provider>;
}
export const useApp=()=>useContext(Context);
