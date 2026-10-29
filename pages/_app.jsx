import '../styles/kz-site.css';
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {sendAnalytics} from '../lib/analytics-client';
import {AppProvider} from '../components/AppContext';
import {GlobalUI} from '../components/GlobalUI';
export default function App({Component,pageProps}){const router=useRouter();useEffect(()=>{const go=url=>{try{sendAnalytics('page_view',{path:new URL(url,location.origin).pathname})}catch{}};go(router.asPath);router.events.on('routeChangeComplete',go);return()=>router.events.off('routeChangeComplete',go);},[router.events]);return <AppProvider><Component {...pageProps}/>{!router.pathname.startsWith('/admin')&&!router.pathname.startsWith('/auth')&&!Component.noGlobalUI&&<GlobalUI/>}</AppProvider>}
