const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const React=require(path.join(root,'node_modules/react'));
const render=require(path.join(root,'node_modules/react-dom/server')).renderToStaticMarkup;
const babel=require(path.join(root,'node_modules/next/dist/compiled/babel/core'));
const h=React.createElement;
const cache=new Map();
const Link=({href,children,...props})=>h('a',{href,...props},children);
const Icon=({name,size})=>h('span',{'aria-hidden':'true',style:{fontSize:(size||16)+'px',display:'inline-block'}},['upRight','arrow','left'].includes(name)?(name==='left'?'←':'↗'):'•');
const Header=()=>h('header',{className:'header'},h('div',{className:'container header-inner'},h('a',{href:'/',className:'logo'},h('span',{className:'logo-mark'},h('span',null,'KZ')),h('span',{className:'logo-word'},'KISS ZOLTÁN',h('span',null,'INGATLANSZAKÉRTŐ'))),h('nav',{className:'desktop-nav'},...['Ingatlanjaim','Eladni szeretnék','Értékbecslés','Tudástár','Rólam','Kapcsolat'].map((t,i)=>h('a',{key:t,href:['/ingatlanjaim','/eladni-szeretnek','/luxusingatlan-ertekbecsles','/tudastar','/rolam','/kapcsolat'][i]},t))),h('a',{className:'btn btn-primary header-valuation',href:'/luxusingatlan-ertekbecsles'},'Értékbecslést kérek ↗')));
const Footer=()=>h('footer',{className:'footer'},h('div',{className:'container footer-top'},h('div',null,h('div',{className:'eyebrow light'},'SZEMÉLYES KAPCSOLAT'),h('h2',null,'Egy fontos döntés ',h('em',null,'egy beszélgetéssel'),' kezdődik.')),h('a',{className:'btn btn-primary',href:'/kapcsolat'},'Beszéljünk róla ↗')));
const Img=({src,alt='',className='',...props})=>h('div',{className:'photo-wrap '+className},h('img',{src,alt,loading:'lazy',...props}));
const PropertyCard=({p})=>h('article',{className:'property-card'},h('a',{href:'/ingatlan/'+p.slug},h(Img,{src:p.images[0],alt:p.title})),h('div',{className:'property-card-content'},h('h3',null,p.title),h('p',null,p.location),h('strong',null,new Intl.NumberFormat('hu-HU').format(p.price)+' Ft')));
const Global={Header,Footer,ImageWithFallback:Img,PropertyCard};
function load(f){
 const full=path.resolve(root,f);if(cache.has(full))return cache.get(full).exports;
 const src=fs.readFileSync(full,'utf8');const code=babel.transformSync(src,{configFile:false,babelrc:false,presets:[[require.resolve('next/babel',{paths:[root]}),{'preset-react':{runtime:'classic'}}]],filename:full}).code;
 const mod={exports:{}};cache.set(full,mod);
 function req(s){
  if(s==='react')return React;
  if(s.startsWith('@babel/runtime/'))return require(require.resolve('next/dist/compiled/'+s,{paths:[root]}));
  if(s==='next/link')return {__esModule:true,default:Link};
  if(s.endsWith('/Icons')||s==='./Icons')return {__esModule:true,default:Icon};
  if(s.endsWith('/SeoHead'))return {__esModule:true,default:()=>null};
  if(s.endsWith('/GlobalUI')||s==='./GlobalUI')return Global;
  if(s.endsWith('/AppContext'))return {useApp:()=>({saved:[],setModal:()=>{},setDrawer:()=>{},toggleSaved:()=>{}}),track:()=>{}};
  if(s.endsWith('/LeadStatus'))return {LeadConsent:()=>null,LeadStatus:()=>null};
  if(s.startsWith('.')){let f2=path.resolve(path.dirname(full),s);if(!path.extname(f2)){if(fs.existsSync(f2+'.jsx'))f2+='.jsx';else f2+='.js'}return load(path.relative(root,f2))}
  return require(require.resolve(s,{paths:[root]}));
 }
 try{new Function('require','module','exports',code)(req,mod,mod.exports)}catch(e){console.error('Error rendering',f);throw e}
 return mod.exports;
}
const css=['globals.css','premium-refinement.css','property-experience.css','editorial.css','demo-polish.css','interaction-restoration.css'].map(f=>fs.readFileSync(path.join(root,'styles',f),'utf8')).join('\n');
const p=load('data/properties.js').properties[0];
const specs=[{name:'fooldal-bemutato',file:'pages/index.jsx',props:{}},{name:'torokvesz-rezidencia-bemutato',file:'pages/ingatlan/[slug].jsx',props:{property:p}}];
const destDir=path.join(root,'previews');fs.mkdirSync(destDir,{recursive:true});
for(const s of specs){
 const Comp=load(s.file).default;
 const markup=render(h(Comp,s.props));
 const html=`<!DOCTYPE html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kiss Zoltán – ${s.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>${css}</style></head><body>${markup}</body></html>`;
 fs.writeFileSync(path.join(destDir,s.name+'.html'),html);console.log('Created',s.name+'.html',Math.round(html.length/1024)+' kB');
}

// One additional static proof of the result screen, rendered by the SAME JSX component.
const ValueExplorer=load('components/ValueExplorer.jsx').ValueExplorer;
const resultMarkup=render(h('div',null,h(Header),h('main',null,h(ValueExplorer,{previewStep:3})),h(Footer)));
const resultHTML=`<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kiss Zoltán — kalkulátor eredménye (vizuális előnézet)</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>${css}</style></head><body>${resultMarkup}</body></html>`;
fs.writeFileSync(path.join(destDir,'kalkulator-eredmeny.html'),resultHTML);console.log('Created kalkulator-eredmeny.html');
