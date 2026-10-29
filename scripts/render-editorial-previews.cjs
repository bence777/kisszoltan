// Standalone, noninteractive visual proofs without a Next production build.
// Uses the project JSX and exact editorial CSS, with simplified header/footer.
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const nm=path.join(root,'node_modules');
const React=require(path.join(nm,'react'));
const ReactDOMServer=require(path.join(nm,'react-dom/server'));
const babel=require(path.join(nm,'next/dist/compiled/babel/core'));
const h=React.createElement;
const cache=new Map();
const Link=({href,children, ...props})=>h('a',{href,...props},children);
const Icon=({name})=>h('span',{'aria-hidden':true,style:{display:'inline-block',fontSize:'18px'}},name==='arrow'?'↗':'→');
const Header=()=>h('header',{className:'header'},h('div',{className:'container header-inner',style:{display:'flex',justifyContent:'space-between',alignItems:'center'}},h('a',{href:'/',className:'logo'},h('div',{className:'logo-mark'},h('span',null,'KZ')),h('div',{className:'logo-word'},'KISS ZOLTÁN',h('span',null,'INGATLANSZAKÉRTŐ'))),h('nav',{className:'desktop-nav',style:{display:'flex',gap:'22px'}},...['Ingatlanjaim','Eladni szeretnék','Értékbecslés','Tudástár','Rólam','Kapcsolat'].map((t,i)=>h('a',{key:t,href:['/ingatlanjaim','/eladni-szeretnek','/luxusingatlan-ertekbecsles','/tudastar','/rolam','/kapcsolat'][i]},t))),h('a',{className:'btn btn-primary header-valuation',href:'/eladni-szeretnek'},'Értékbecslést kérek ↗')));
const Footer=()=>h('footer',{className:'footer'},h('div',{className:'container footer-top'},h('div',null,h('div',{className:'eyebrow light'},'SZEMÉLYES KAPCSOLAT'),h('h2',null,'Egy fontos döntés ',h('em',null,'egy beszélgetéssel'),' kezdődik.')),h('a',{className:'btn btn-primary',href:'/kapcsolat'},'Beszéljünk róla ↗')));
function load(f){
 const full=path.resolve(root,f);
 if(cache.has(full))return cache.get(full).exports;
 const src=fs.readFileSync(full,'utf8');
 const code=babel.transformSync(src,{configFile:false,babelrc:false,presets:[[require.resolve('next/babel',{paths:[root]}),{'preset-react':{runtime:'classic'}}]],filename:full}).code;
 const mod={exports:{}};cache.set(full,mod);
 function req(s){
  if(s==='react')return React;
  if(s==='next/link')return {__esModule:true,default:Link};
  if(s.endsWith('/Icons')||s==='./Icons')return {__esModule:true,default:Icon};
  if(s.endsWith('/SeoHead'))return {__esModule:true,default:()=>null};
  if(s.endsWith('/GlobalUI'))return {Header,Footer,PropertyCard:()=>null};
  if(s.endsWith('/AppContext'))return {useApp:()=>({setModal:()=>{}})};
  if(s.startsWith('.')){let f2=path.resolve(path.dirname(full),s);if(!path.extname(f2)){if(fs.existsSync(f2+'.jsx'))f2+='.jsx';else f2+='.js'};return load(path.relative(root,f2));}
  if(s.startsWith('@babel/runtime/'))return require(require.resolve('next/dist/compiled/'+s,{paths:[root]}));
  return require(require.resolve(s,{paths:[root]}));
 }
 try{new Function('require','module','exports',code)(req,mod,mod.exports)}catch(e){console.error('ERROR in',f);throw e}
 return mod.exports;
}
const css=['globals.css','premium-refinement.css','property-experience.css','editorial.css','interaction-restoration.css','edition-v8.css','edition-v9.css'].map(f=>fs.readFileSync(path.join(root,'styles',f),'utf8')).join('\n');
const bootstrap='@media(max-width:1100px){.desktop-nav{display:none!important}} .footer-top{padding-block:60px}';
const outDir=path.join(root,'previews');fs.mkdirSync(outDir,{recursive:true});
const specs=[
 {file:'pages/[slug].jsx',name:'eladni-szeretnek',props:{slug:'eladni-szeretnek'}},
 {file:'pages/[slug].jsx',name:'luxusingatlan-ertekbecsles',props:{slug:'luxusingatlan-ertekbecsles'}},
 {file:'pages/[slug].jsx',name:'premium-csomag',props:{slug:'premium-csomag'}},
 {file:'pages/tudastar/[slug].jsx',name:'cikk-milliardos-ertekesites',props:{article:load('data/articles.js').articles[0]}},
 {file:'pages/tudastar/index.jsx',name:'tudastar',props:{}},
 {file:'pages/[slug].jsx',name:'diszkret-ingatlanertekesites',props:{slug:'diszkret-ingatlanertekesites'}},
 {file:'pages/[slug].jsx',name:'ingatlan-ertekesites-folyamata',props:{slug:'ingatlan-ertekesites-folyamata'}},
 {file:'pages/[slug].jsx',name:'luxusvillak-budapest',props:{slug:'luxusvillak-budapest'}},
 {file:'pages/[slug].jsx',name:'penthouse-budapest',props:{slug:'penthouse-budapest'}},
 {file:'pages/[slug].jsx',name:'standard',props:{slug:'standard'}},
 {file:'pages/[slug].jsx',name:'exclusive-csomag',props:{slug:'exclusive-csomag'}},
 ...load('data/articles.js').articles.slice(1).map(a=>({file:'pages/tudastar/[slug].jsx',name:'cikk-'+a.slug,props:{article:a}}))
];
for(const s of specs){
 const Component=load(s.file).default;const content=ReactDOMServer.renderToStaticMarkup(h(Component,s.props));
 const html='<!DOCTYPE html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Kiss Zoltán – V5 böngészős előnézet</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>'+css+'\n'+bootstrap+'</style></head><body>'+content+'</body></html>';
 const dest=path.join(outDir,s.name+'.html');fs.writeFileSync(dest,html);console.log(s.name,Math.round(html.length/1024)+' KB');
}
