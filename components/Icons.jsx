import React from 'react';
const paths={
 arrow:<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
 upRight:<><path d="M7 17 17 7"/><path d="M7 7h10v10"/></>,
 left:<><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>,
 close:<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
 menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,
 heart:<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
 pin:<><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
 area:<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 11 4-4M7 7h4v4m2 6 4-4m-4 0h4v4"/></>,
 bed:<><path d="M3 18V6m18 12V9a3 3 0 0 0-3-3H6v12m-3-6h18M3 18h18"/></>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
 phone:<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19.1 19.1 0 0 1-5.9-5.9 19.5 19.5 0 0 1-3-8.5A2 2 0 0 1 4.4 2h3a2 2 0 0 1 2 1.7l.4 3a2 2 0 0 1-.6 1.7L7.6 10a16 16 0 0 0 6.4 6.4l1.6-1.6a2 2 0 0 1 1.7-.6l3 .4a2 2 0 0 1 1.7 2Z"/>,
 mail:<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/></>,
 check:<path d="m4 12 5 5L20 6"/>,
 chevron:<path d="m6 9 6 6 6-6"/>,
 search:<><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
 filter:<><path d="M4 7h16M7 12h10m-7 5h4"/><circle cx="7" cy="7" r="1"/></>,
 home:<><path d="m3 11 9-8 9 8v10H3z"/><path d="M9 21v-7h6v7"/></>,
 chart:<><path d="M3 20V4m0 16h18M7 16l5-6 4 3 5-7"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></>,
 message:<path d="M21 11a8 8 0 0 1-8 8 9 9 0 0 1-4-.9L3 21l1.9-5A8 8 0 1 1 21 11Z"/>,
 shield:<><path d="M12 2 21 6v6c0 5-4 8-9 10-5-2-9-5-9-10V6z"/><path d="m9 12 2 2 4-4"/></>,
 play:<path d="m8 5 11 7-11 7z"/>,
 share:<><path d="M12 16V3m-5 5 5-5 5 5"/><path d="M4 14v6h16v-6"/></>,
 copy:<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
 building:<><path d="M4 21V3h16v18M2 21h20M8 7h2m4 0h2M8 11h2m4 0h2M8 15h2m4 0h2"/></>
};
export default function Icon({name,size=20,strokeWidth=1.8,fill='none',...props}) {return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]||paths.arrow}</svg>}
