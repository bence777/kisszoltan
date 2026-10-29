import Link from 'next/link';
export const numberHU=n=>Number(n||0).toLocaleString('hu-HU');
export const moneyHU=n=>new Intl.NumberFormat('hu-HU',{style:'currency',currency:'HUF',maximumFractionDigits:0}).format(Number(n)||0);
export function Stat({label,value,detail,accent=false}){return <article className={`kz-v13-stat ${accent?'is-accent':''}`}><span>{label}</span><strong>{value}</strong>{detail&&<small>{detail}</small>}</article>}
export function Panel({title,description,action,children,className=''}){return <section className={`kz-v13-panel ${className}`}><div className="kz-v13-panel-head"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{action}</div>{children}</section>}
export function Empty({title,description,action,icon='○'}){return <div className="kz-v13-empty"><div className="kz-v13-empty-icon" aria-hidden="true">{icon}</div><h3>{title}</h3><p>{description}</p>{action}</div>}
export function Notice({type='error',children}){return <div className={`kz-v13-notice is-${type}`} role={type==='error'?'alert':'status'}>{children}</div>}
export function LinkAction({href,children}){return <Link href={href} className="kz-v13-button is-secondary">{children}</Link>}
export function Pill({children,tone='neutral'}){return <span className={`kz-v13-pill is-${tone}`}>{children}</span>}
