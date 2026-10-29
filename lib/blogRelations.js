import {readText,slugify} from './blogDocument';
const stop=new Set('a az szabadon maskepp és hogy vagy mint itt ott egy ezt ezen errol arról pedig annak akkor vannak lehet lehetne amikor csak szinten szintén ezért tehát meg mert számára hogyan mikor milyen miért ebben abban ezzel arra vele teljes új még már volt van vagyunk maga saját sajátunk the and for with from what why into over your this about'.split(' '));
export const words=value=>[...new Set(String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').match(/[a-z0-9]{3,}/g)||[])].filter(w=>!stop.has(w));
export const focusOf=p=>String(p?.focus_keyword||p?.seo_title||p?.title||'').trim();
export function scoreRelation(current,other){
 if(!other||current?.id===other.id||current?.slug===other.slug&&current?.slug)return {score:0,shared:[],risk:false};
 const a=words([current?.title,current?.focus_keyword,current?.tags?.join(' ')].join(' ')),b=words([other.title,other.focus_keyword,other.tags?.join(' ')].join(' '));const shared=a.filter(x=>b.includes(x));
 const sharedTags=(current?.tags||[]).filter(tag=>(other.tags||[]).map(x=>x.toLowerCase()).includes(tag.toLowerCase()));
 const category=!!current?.category_slug&&current.category_slug===other.category_slug;
 const focusA=slugify(current?.focus_keyword),focusB=slugify(other.focus_keyword);
 const focusConflict=!!focusA&&!!focusB&&(focusA===focusB||focusA.includes(focusB)&&focusB.length>7||focusB.includes(focusA)&&focusA.length>7);
 const titleA=words(current?.title),titleB=words(other.title),overlap=titleA.length&&titleB.length?titleA.filter(x=>titleB.includes(x)).length/Math.min(titleA.length,titleB.length):0;
 const risk=focusConflict||overlap>=.78;
 const score=sharedTags.length*18+(category?17:0)+Math.min(35,shared.length*7)+Math.round(overlap*20);
 return {score,shared,sharedTags,category,risk,reason:risk?'Azonos vagy nagyon hasonló keresési szándék lehet.':category?'Azonos kategória':sharedTags.length?'Közös címkék':'Témabeli egyezés'};
}
export function suggestionsFor(current,posts,{limit=8}={}){return (posts||[]).filter(p=>p.status==='published'&&p.id!==current?.id&&p.slug!==current?.slug).map(p=>({...p,relation:scoreRelation(current,p)})).filter(p=>p.relation.score>0).sort((a,b)=>b.relation.score-a.relation.score).slice(0,limit);}
export function findCannibalization(posts){const rows=[];for(let i=0;i<posts.length;i++)for(let j=i+1;j<posts.length;j++){const a=posts[i],b=posts[j],rel=scoreRelation(a,b);if(rel.risk&&rel.score>=10)rows.push({a,b,score:rel.score,reason:rel.reason});}return rows.sort((a,b)=>b.score-a.score);}
export function collectLinks(doc){const links=[];function go(node){for(const mark of node.marks||[])if(mark.type==='link'&&mark.attrs?.href)links.push(mark.attrs.href);for(const child of node.content||[])go(child);}go(doc);return [...new Set(links)];}
export function headingsIn(doc){const h=[];function go(n){if(n.type==='heading')h.push(readText({type:'doc',content:[n]}));(n.content||[]).forEach(go);}go(doc);return h;}
