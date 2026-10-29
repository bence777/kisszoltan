// Backward-compatible: old Markdown stays readable; rich documents are JSON stored in the existing content TEXT column.
export const emptyDocument = () => ({ type:'doc', content:[{type:'paragraph'}] });
function inlineNodes(source){
 const input=String(source),result=[];
 const re=/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|_[^_]+_)/g;
 let index=0,match;
 while((match=re.exec(input))){
  if(match.index>index)result.push({type:'text',text:input.slice(index,match.index)});
  const value=match[0],marks=[];let text=value;
  if(value.startsWith('**')||value.startsWith('__')){text=value.slice(2,-2);marks.push({type:'bold'});}
  else if(value.startsWith('*')||value.startsWith('_')){text=value.slice(1,-1);marks.push({type:'italic'});}
  else if(value.startsWith('`')){text=value.slice(1,-1);marks.push({type:'code'});}
  else if(value.startsWith('[')){const m=value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);if(m){text=m[1];const href=safeLink(m[2]);if(href)marks.push({type:'link',attrs:{href}});}}
  result.push({type:'text',text,...(marks.length?{marks}:{})});index=match.index+value.length;
 }
 if(index<input.length)result.push({type:'text',text:input.slice(index)});
 return result.length?result:undefined;
}
const t=s=>inlineNodes(s);
export function markdownToDocument(value='') {
  const out=[]; let list=null;
  for(const line of String(value).split(/\r?\n/)) {
    const s=line.trim();
    if(!s){list=null;continue;}
    const h=s.match(/^(#{1,3})\s+(.+)$/);
    if(h){list=null;out.push({type:'heading',attrs:{level:Math.min(3,h[1].length)},content:t(h[2])});continue;}
    const li=s.match(/^([-*]|\d+\.)\s+(.+)$/);
    if(li){const type=li[1]==='-'||li[1]==='*'?'bulletList':'orderedList';if(!list||list.type!==type){list={type,content:[]};out.push(list);}list.content.push({type:'listItem',content:[{type:'paragraph',content:t(li[2])}]});continue;}
    list=null;
    out.push({type:'paragraph',content:t(s)});
  }
  return {type:'doc',content:out.length?out:[{type:'paragraph'}]};
}
export function parseDocument(value) {
  if(value&&typeof value==='object'&&value.type==='doc')return value;
  const text=String(value||'');
  if(text.trim().startsWith('{')){try{const d=JSON.parse(text);if(d?.type==='doc'&&Array.isArray(d.content))return d;}catch{}}
  return markdownToDocument(text);
}
export function readText(value){
  const d=parseDocument(value);const parts=[];
  function visit(node){if(node.text)parts.push(node.text);if(Array.isArray(node.content))node.content.forEach(visit);if(['paragraph','heading','listItem','blockquote'].includes(node.type))parts.push(' ');}
  visit(d);return parts.join('').replace(/\s+/g,' ').trim();
}
export const slugify = v => String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,150);
export const safeHttpUrl = url=>{try{const v=new URL(url);return ['http:','https:'].includes(v.protocol)?v.href:null;}catch{return null;}};
export const safeLink = url => String(url||'').startsWith('/')&&!String(url).startsWith('//')?String(url):safeHttpUrl(url);
export function makeTemplate(kind){
 const p=s=>({type:'paragraph',content:s?t(s):undefined}); const h=s=>({type:'heading',attrs:{level:2},content:t(s)});
 const templates={
  guide:[p('Kinek szól ez az ingatlanpiaci útmutató?'),h('A kiinduló ingatlanpiaci helyzet'),p(),h('Ellenőrizhető adatok és források'),p(),h('Döntési lehetőségek'),p(),h('Gyakorlati következtetések'),p()],
  question:[p('A gyakori ingatlanpiaci kérdés rövid megválaszolása…'),h('Milyen adatok alapján dönthetünk?'),p(),h('Gyakori félreértések'),p(),h('Milyen esetben célszerű szakembert bevonni?'),p()],
  story:[p('Ellenőrzött ingatlanpiaci esettanulmány vagy példa…'),h('Kiinduló helyzet'),p(),h('Választott stratégia'),p(),h('Eredmény és tanulság'),p()],
  list:[p('A legfontosabb tudnivalók röviden.'),h('1. Első gondolat'),p(),h('2. Második gondolat'),p(),h('3. Harmadik gondolat'),p(),h('Hogyan tovább?'),p()]
 };
 return {type:'doc',content:templates[kind]||[p()]};
}
