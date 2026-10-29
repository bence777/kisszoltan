import {useState} from 'react';
import {parseDocument,safeHttpUrl,safeLink} from '../../lib/blogDocument';
function embedSrc(url){const href=safeHttpUrl(url);if(!href)return null;try{const u=new URL(href),h=u.hostname.toLowerCase(),p=u.pathname.split('/').filter(Boolean);if(h==='youtu.be'||h.endsWith('.youtube.com')||h==='youtube.com'||h==='youtube-nocookie.com'){const id=h==='youtu.be'?p[0]:u.searchParams.get('v')||(['shorts','embed','live'].includes(p[0])?p[1]:null);return /^[a-z\d_-]{11}$/i.test(id||'')?`https://www.youtube-nocookie.com/embed/${id}`:null;}if(h==='vimeo.com'||h==='www.vimeo.com'){const id=p.find(x=>/^\d+$/.test(x));return id?`https://player.vimeo.com/video/${id}`:null;}if(h==='open.spotify.com'&&/^(track|album|playlist|episode|show)$/.test(p[0])&&/^[\w]+$/.test(p[1]||''))return `https://open.spotify.com/embed/${p[0]}/${p[1]}`;if(h==='tiktok.com'||h.endsWith('.tiktok.com')){const id=p[p.indexOf('video')+1];return /^\d+$/.test(id||'')?`https://www.tiktok.com/embed/v2/${id}`:null;}if(h==='instagram.com'||h==='www.instagram.com'){return ['p','reel'].includes(p[0])&&/^[\w-]+$/.test(p[1]||'')?`https://www.instagram.com/${p[0]}/${p[1]}/embed/`:null;}if(h==='facebook.com'||h==='www.facebook.com'||h==='m.facebook.com'){return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(href)}&show_text=true`;}if(h==='soundcloud.com'||h==='www.soundcloud.com')return `https://w.soundcloud.com/player/?url=${encodeURIComponent(href)}`;if(/\.pdf$/i.test(u.pathname)&&(/\.supabase\.co$/.test(h)||h==='kisszoltan.com'||h==='kisszoltan.vercel.app'))return href;return null;}catch{return null;}}
function formatText(n,key){let child=n.text||'';for(const mark of n.marks||[]){const type=mark.type,href=safeLink(mark.attrs?.href);if(type==='bold')child=<strong>{child}</strong>;if(type==='italic')child=<em>{child}</em>;if(type==='underline')child=<u>{child}</u>;if(type==='strike')child=<s>{child}</s>;if(type==='code')child=<code>{child}</code>;if(type==='highlight')child=<mark>{child}</mark>;if(type==='link'&&href)child=<a href={href} target={href.startsWith('/')?'_self':'_blank'} rel="noopener noreferrer">{child}</a>;}return <span key={key}>{child}</span>;}
function PublicQuiz({quiz}){
 const data=quiz||{},questions=data.questions||[],results=data.results||[];
 const [answers,setAnswers]=useState({}),[done,setDone]=useState(false);
 if(!questions.length)return null;
 const score=questions.reduce((sum,q,i)=>{const ix=answers[i];if(ix===undefined)return sum;const opt=(q.options||q.answers||[])[ix];return sum+(Number(typeof opt==='string'?ix:opt?.points??ix)||0);},0);
 const max=questions.reduce((sum,q)=>sum+Math.max(0,...(q.options||q.answers||[]).map((opt,i)=>typeof opt==='string'?i:Number(opt?.points)||0)),0);
 const pct=max?Math.round(score/max*100):0;
 const ranked=[...results].sort((a,b)=>Number(a.minScore??a.min??0)-Number(b.minScore??b.min??0));
 const result=ranked.filter(r=>Number(r.minScore??r.min??0)<=(r.minScore===undefined?pct:score)).at(-1)||ranked[0];
 return <section className="sm-public-quiz"><h2>{data.title||'Rövid kérdőív'}</h2>{data.introduction&&<p>{data.introduction}</p>}{!done?<form onSubmit={e=>{e.preventDefault();setDone(true);}}>{questions.map((q,i)=><fieldset key={i}><legend>{q.text||q.question}</legend>{(q.options||q.answers||[]).map((option,j)=><label key={j}><input type="radio" name={`quiz-${data.id||'x'}-${i}`} checked={answers[i]===j} onChange={()=>setAnswers(v=>({...v,[i]:j}))}/>{typeof option==='string'?option:option.text}</label>)}</fieldset>)}<button className="portal-primary" disabled={Object.keys(answers).length!==questions.length} type="submit">{data.buttonText||'Eredményem'}</button></form>:<div className="sm-quiz-result" aria-live="polite"><span>Eredmény</span><h3>{result?.title||'Köszönjük a kitöltést!'}</h3><p>{result?.body||result?.text||''}</p>{result?.delivery==='pdf'&&safeHttpUrl(result.pdfUrl)&&<a href={safeHttpUrl(result.pdfUrl)} target="_blank" rel="noreferrer">PDF megnyitása ↗</a>}<button type="button" onClick={()=>{setAnswers({});setDone(false);}}>Újra kitöltöm</button></div>}</section>;
}
function RichNode({node,depth=0}){
 if(!node||depth>30)return null;
 if(node.type==='text')return formatText(node,node.text);
 const content=(node.content||[]).map((c,i)=><RichNode key={i} node={c} depth={depth+1}/>);
 const align=['left','right','center','justify'].includes(node.attrs?.textAlign)?node.attrs.textAlign:undefined;
 const attrs=align?{style:{textAlign:align}}:{};
 switch(node.type){
  case 'doc':return <>{content}</>;
  case 'paragraph':return <p {...attrs}>{content}</p>;
  case 'heading':return node.attrs?.level===1?<h2 {...attrs}>{content}</h2>:node.attrs?.level===3?<h3 {...attrs}>{content}</h3>:<h2 {...attrs}>{content}</h2>;
  case 'bulletList':return <ul>{content}</ul>;
  case 'orderedList':return <ol start={node.attrs?.start||1}>{content}</ol>;
  case 'listItem':return <li>{content}</li>;
  case 'blockquote':return <blockquote>{content}</blockquote>;
  case 'horizontalRule':return <hr/>;
  case 'hardBreak':return <span>{'\n'}</span>;
  case 'codeBlock':return <pre><code>{content}</code></pre>;
  case 'columns':return <div className="sm-public-columns">{content}</div>;
  case 'column':return <div>{content}</div>;
  case 'image':{const src=safeHttpUrl(node.attrs?.src);if(!src)return null;const width=/^(\d{1,3}%|\d{2,4}px)$/.test(String(node.attrs?.width))?node.attrs.width:'100%';const alignImg=node.attrs?.align;return <figure className="sm-public-photo" style={{width,maxWidth:'100%',marginLeft:alignImg==='right'?'auto':undefined,marginRight:alignImg==='left'?'auto':undefined}}><img src={src} loading="lazy" alt={node.attrs?.alt||''} style={{borderRadius:`${Math.min(999,Math.max(0,Number(node.attrs?.radius)||0))}px`,objectFit:node.attrs?.fit==='cover'?'cover':'contain',height:node.attrs?.height>0?`${Math.min(1000,Number(node.attrs.height))}px`:undefined,transform:`rotate(${Number(node.attrs?.rotation)||0}deg)`}}/>{node.attrs?.caption&&<figcaption>{node.attrs.caption}</figcaption>}</figure>;}
  case 'embedBlock':{const url=safeHttpUrl(node.attrs?.url||node.attrs?.source);if(!url)return null;const src=embedSrc(url),isPdf=(node.attrs?.kind==='pdf'||/\.pdf(?:\?|$)/i.test(url));return <div className="sm-public-embed">{src?<iframe title={node.attrs?.title||'Beágyazott tartalom'} src={src} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" sandbox={isPdf?'allow-scripts allow-same-origin':'allow-scripts allow-same-origin allow-popups allow-presentation'}/>:<a href={url} target="_blank" rel="noopener noreferrer">{node.attrs?.title||'Külső tartalom megnyitása'} ↗</a>}</div>;}
  case 'quizBlock':return <PublicQuiz quiz={node.attrs?.data||node.attrs?.quiz}/>;
  case 'newsletterBlock':{const href=safeLink(node.attrs?.url)||'/kapcsolat';return <div className="sm-public-signup"><h3>{node.attrs?.title||'Kapcsolódjunk!'}</h3><p>{node.attrs?.description||''}</p><a href={href}>{node.attrs?.button||'Tovább'} ↗</a></div>;}
  default:return <>{content}</>;
 }
}
export default function BlogRichContent({content}){return <div className="portal-article-body sm-public-article"><RichNode node={parseDocument(content)}/></div>;}
