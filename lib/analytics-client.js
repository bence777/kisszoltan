export function sendAnalytics(name,info={}){
 if(typeof window==='undefined'||process.env.NEXT_PUBLIC_ANALYTICS_ENABLED!=='true'||navigator.doNotTrack==='1')return;
 if(location.pathname.startsWith('/admin')||location.pathname.startsWith('/auth'))return;
 try{
  const url=new URL(window.location.href);const source=url.searchParams.get('utm_source')||(()=>{try{return new URL(document.referrer).hostname}catch{return 'direct'}})();
  const payload={name,path:url.pathname,property_id:info.property_id||null,source_channel:source};
  fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true,credentials:'same-origin'}).catch(()=>{});
 }catch{}
}
