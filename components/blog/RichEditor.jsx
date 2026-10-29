import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {useEditor,EditorContent,NodeViewWrapper,ReactNodeViewRenderer} from '@tiptap/react';
import {Node,Mark,Extension,mergeAttributes} from '@tiptap/core';
import {StarterKit} from '@tiptap/starter-kit';
import {Placeholder} from '@tiptap/extension-placeholder';
import {Image} from '@tiptap/extension-image';
import {safeHttpUrl,safeLink,parseDocument,makeTemplate} from '../../lib/blogDocument';
import {uploadFile} from '../../lib/mediaClient';
import MediaLibrary from './MediaLibrary';
import StudioIcon from './StudioIcon';
import FloatingPanel from './FloatingPanel';
import VisualImageEditor from './VisualImageEditor';
import {suggestionsFor} from '../../lib/blogRelations';
const LinkMark=Mark.create({name:'link',inclusive:false,priority:1000,addAttributes(){return {href:{default:null}};},parseHTML(){return [{tag:'a[href]'}];},renderHTML({HTMLAttributes}){const href=safeLink(HTMLAttributes.href)||'#';return ['a',{href,target:href.startsWith('/')?'_self':'_blank',rel:'noopener noreferrer'},0];}});
const Underline=Mark.create({name:'underline',parseHTML(){return [{tag:'u'}];},renderHTML(){return ['u',0];}});
const Highlight=Mark.create({name:'highlight',parseHTML(){return [{tag:'mark'}];},renderHTML(){return ['mark',0];}});
const Align=Extension.create({name:'textAlignExtra',addGlobalAttributes(){return [{types:['paragraph','heading'],attributes:{textAlign:{default:'left',parseHTML:e=>e.style.textAlign||'left',renderHTML:attrs=>attrs.textAlign!=='left'?{style:`text-align:${attrs.textAlign}`}:{}}}}];}});
function PhotoView({node,updateAttributes,selected,deleteNode}){
 const [editing,setEditing]=useState(false);const attrs=node.attrs;
 return <NodeViewWrapper className={`sm-photo-node ${selected?'is-selected':''}`} contentEditable={false}>
  <figure className="sm-editor-image-figure" style={{width:attrs.width||'100%',marginLeft:attrs.align==='right'?'auto':attrs.align==='center'?'auto':0,marginRight:attrs.align==='left'?'auto':attrs.align==='center'?'auto':0}}>
   <img src={attrs.src} alt={attrs.alt||''} style={{width:'100%',maxHeight:720,objectFit:'contain',borderRadius:Math.min(60,Number(attrs.radius)||0)}} draggable={false}/>
   <div className="sm-photo-actions"><button type="button" onClick={()=>setEditing(true)}><StudioIcon name="crop" size={16}/> Vizuális szerkesztés</button><button type="button" title="Kép eltávolítása" aria-label="Kép eltávolítása" onClick={deleteNode}><StudioIcon name="trash" size={16}/></button></div>
   {attrs.caption&&<figcaption>{attrs.caption}</figcaption>}
  </figure>
  {editing&&<VisualImageEditor image={attrs} onApply={updateAttributes} onClose={()=>setEditing(false)}/>}
 </NodeViewWrapper>;
}
const Photo=Image.extend({addAttributes(){return {...this.parent?.(),width:{default:'100%'},align:{default:'center'},radius:{default:12},fit:{default:'contain'},height:{default:0},rotation:{default:0},caption:{default:''}};},addNodeView(){return ReactNodeViewRenderer(PhotoView);},renderHTML({HTMLAttributes}){const {width,align,radius,fit,height,rotation,caption,...rest}=HTMLAttributes;const w=/^(\d{1,3}%|\d{2,4}px)$/.test(String(width))?width:'100%';return ['img',mergeAttributes(rest,{style:`width:${w};height:${Number(height)>0?`${Math.min(Number(height),1000)}px`:'auto'};object-fit:${fit==='cover'?'cover':'contain'};border-radius:${Number(radius)||0}px;display:block;margin:${align==='left'?'0 auto 0 0':align==='right'?'0 0 0 auto':'0 auto'};transform:rotate(${Number(rotation)||0}deg)`,alt:String(rest.alt||''),loading:'lazy'})];}});
const Embed=Node.create({name:'embedBlock',group:'block',atom:true,addAttributes(){return {url:{default:''},kind:{default:'embed'},title:{default:''}};},parseHTML(){return [{tag:'div[data-blog-embed]'}];},renderHTML({HTMLAttributes}){return ['div',{'data-blog-embed':true,'data-url':HTMLAttributes.url,'data-kind':HTMLAttributes.kind,'data-title':HTMLAttributes.title},HTMLAttributes.title||HTMLAttributes.url];},addNodeView(){return ReactNodeViewRenderer(EmbedView);}});
function EmbedView({node,updateAttributes,deleteNode,selected}){const {url,kind,title}=node.attrs;const video=youtubeEmbed(url);const [open,setOpen]=useState(false),[draft,setDraft]=useState(node.attrs);
 return <NodeViewWrapper className={`sm-embed-node ${selected?'is-selected':''}`} contentEditable={false}><div className="sm-embed-heading"><strong>{kind==='pdf'?'PDF dokumentum':kind==='video'?'Videó':'Beágyazott tartalom'}</strong><div className="sm-node-buttons"><button type="button" onClick={()=>{setDraft({...node.attrs});setOpen(true);}}><StudioIcon name="edit" size={15}/> Szerkesztés</button><button type="button" onClick={deleteNode} aria-label="Blokk eltávolítása"><StudioIcon name="trash" size={15}/></button></div></div>{video?<iframe title={title||'Videó'} loading="lazy" src={video} allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<div className="sm-embed-link"><a href={safeHttpUrl(url)||'#'} target="_blank" rel="noreferrer">{title||url||'Beágyazás'}</a><small>A támogatott tartalmak a nyilvános oldalon jelennek meg.</small></div>}
 {open&&<FloatingPanel title="Beágyazás szerkesztése" width={420} onClose={()=>setOpen(false)}><label className="sm-field">Tartalom címe<input value={draft.title||''} onChange={e=>setDraft({...draft,title:e.target.value})}/></label><label className="sm-field">URL<input value={draft.url||''} onChange={e=>setDraft({...draft,url:e.target.value})}/></label><div className="sm-modal-actions"><button type="button" className="portal-secondary" onClick={()=>setOpen(false)}>Mégse</button><button type="button" className="portal-primary" onClick={()=>{const safe=safeHttpUrl(draft.url);if(!safe)return alert('Érvényes HTTPS-cím szükséges.');updateAttributes({...draft,url:safe});setOpen(false);}}>Mentés</button></div></FloatingPanel>}</NodeViewWrapper>;
}
const Quiz=Node.create({name:'quizBlock',group:'block',atom:true,addAttributes(){return {data:{default:{title:'Rövid önismereti kvíz',introduction:'Nincs jó vagy rossz válasz. Válaszd a rád leginkább jellemzőt.',questions:[{text:'Mennyire igaz rád?',options:[{text:'Egyáltalán nem',points:0},{text:'Néha',points:1},{text:'Gyakran',points:2}]}],results:[{minScore:0,title:'A te eredményed',body:'Gondold végig, mi a legfontosabb számodra.',delivery:'text'}]}}};},parseHTML(){return [{tag:'div[data-blog-quiz]'}];},renderHTML({HTMLAttributes}){return ['div',{'data-blog-quiz':true,'data-data':JSON.stringify(HTMLAttributes.data)},'Kvíz'];},addNodeView(){return ReactNodeViewRenderer(QuizView);}});
function QuizView({node,updateAttributes,deleteNode}){
 const data=node.attrs.data||{};const [editing,setEditing]=useState(false),[draft,setDraft]=useState(null);
 const open=()=>{setDraft(JSON.parse(JSON.stringify(data)));setEditing(true);};
 const edit=(path,val)=>{setDraft(prev=>{const next=structuredClone(prev),parts=path.split('.');let obj=next;for(let i=0;i<parts.length-1;i++)obj=obj[parts[i]];obj[parts.at(-1)]=val;return next;});};
 const newQuestion=()=>setDraft(prev=>({...prev,questions:[...(prev.questions||[]),{text:'Új kérdés',options:[{text:'Nem',points:0},{text:'Igen',points:1}]}]}));
 const removeQuestion=i=>setDraft(prev=>({...prev,questions:prev.questions.filter((_,j)=>i!==j)}));
 const addOption=i=>setDraft(prev=>({...prev,questions:prev.questions.map((q,j)=>j===i?{...q,options:[...q.options,{text:'Új válasz',points:q.options.length}]}:q)}));
 const dropOption=(i,j)=>setDraft(prev=>({...prev,questions:prev.questions.map((q,index)=>index===i?{...q,options:q.options.filter((_,k)=>k!==j)}:q)}));
 const newResult=()=>setDraft(prev=>({...prev,results:[...prev.results,{minScore:0,title:'Új eredmény',body:'',delivery:'text'}]}));
 const removeResult=i=>setDraft(prev=>({...prev,results:prev.results.filter((_,j)=>j!==i)}));
 const save=()=>{if(!draft.questions?.length||!draft.results?.length||draft.questions.some(q=>!q.options?.length)){window.alert('Legalább egy kérdés, válasz és eredmény szükséges.');return;}updateAttributes({data:draft});setEditing(false);};
 return <NodeViewWrapper className="sm-custom-node" contentEditable={false}><strong>Interaktív kvíz · {data.title}</strong><p>{(data.questions||[]).length} kérdés · {(data.results||[]).length} eredménysáv</p><button type="button" onClick={open}>Kvíz szerkesztése</button><button type="button" onClick={deleteNode}>Eltávolítás</button>
 {editing&&draft&&<FloatingPanel title="Interaktív kvíz szerkesztése" width={750} onClose={()=>setEditing(false)} className="sm-quiz-floating">
 <label className="sm-field">Kvíz címe<input value={draft.title||''} onChange={e=>edit('title',e.target.value)}/></label><label className="sm-field">Bevezető<textarea rows={2} value={draft.introduction||''} onChange={e=>edit('introduction',e.target.value)}/></label>
 {(draft.questions||[]).map((q,i)=><section className="sm-quiz-question" key={i}><div className="sm-quiz-question-head"><strong>{i+1}. kérdés</strong><button type="button" onClick={()=>removeQuestion(i)}>Kérdés törlése</button></div><input value={q.text||''} onChange={e=>edit(`questions.${i}.text`,e.target.value)} aria-label={`Kérdés ${i+1}`} />
 {(q.options||[]).map((a,j)=><div className="sm-quiz-option" key={j}><input aria-label="Válasz" value={a.text||''} onChange={e=>edit(`questions.${i}.options.${j}.text`,e.target.value)}/><label>Pont <input type="number" min="0" max="50" value={a.points??0} onChange={e=>edit(`questions.${i}.options.${j}.points`,Number(e.target.value))}/></label><button type="button" onClick={()=>dropOption(i,j)}>×</button></div>)}<button type="button" className="portal-secondary" disabled={q.options?.length>=6} onClick={()=>addOption(i)}>+ Válasz</button></section>)}
 <button type="button" className="portal-secondary" disabled={draft.questions?.length>=12} onClick={newQuestion}>+ Új kérdés</button>
 <h3 className="sm-quiz-subtitle">Eredmények (minimum pontszám alapján)</h3>{(draft.results||[]).map((r,i)=><section className="sm-quiz-result-edit" key={i}><div className="sm-quiz-question-head"><strong>{i+1}. eredmény</strong><button type="button" onClick={()=>removeResult(i)}>Törlés</button></div><label className="sm-field">Minimum pontszám<input type="number" min="0" max="999" value={r.minScore??0} onChange={e=>edit(`results.${i}.minScore`,Number(e.target.value))}/></label><label className="sm-field">Eredmény címe<input value={r.title||''} onChange={e=>edit(`results.${i}.title`,e.target.value)}/></label><label className="sm-field">Magyarázat<textarea rows={3} value={r.body||''} onChange={e=>edit(`results.${i}.body`,e.target.value)}/></label><label className="sm-field">Megjelenítés<select value={r.delivery||'text'} onChange={e=>edit(`results.${i}.delivery`,e.target.value)}><option value="text">Szöveges eredmény</option><option value="pdf">PDF melléklet</option></select></label>{r.delivery==='pdf'&&<label className="sm-field">PDF URL<input value={r.pdfUrl||''} onChange={e=>edit(`results.${i}.pdfUrl`,e.target.value)}/></label>}</section>)}<button type="button" className="portal-secondary" onClick={newResult} disabled={draft.results?.length>=8}>+ Eredménysáv</button>
 <div className="sm-modal-actions"><button type="button" className="portal-secondary" onClick={()=>setEditing(false)}>Mégse</button><button type="button" className="portal-primary" onClick={save}>Kvíz mentése</button></div></FloatingPanel>}
 </NodeViewWrapper>;
}
const Signup=Node.create({name:'newsletterBlock',group:'block',atom:true,addAttributes(){return {title:{default:'Kapcsolódjunk!'},description:{default:'Ha szívesen beszélgetnél erről, itt találod az elérhetőségeket.'},url:{default:'/kapcsolat'},button:{default:'Tovább'}};},parseHTML(){return [{tag:'div[data-blog-newsletter]'}];},renderHTML({HTMLAttributes}){return ['div',{'data-blog-newsletter':true},HTMLAttributes.title];},addNodeView(){return ReactNodeViewRenderer(SignupView);}});
function SignupView({node,updateAttributes,deleteNode}){const [open,setOpen]=useState(false),[draft,setDraft]=useState(node.attrs);const edit=()=>{setDraft({...node.attrs});setOpen(true);};return <NodeViewWrapper className="sm-custom-node" contentEditable={false}><strong>{node.attrs.title}</strong><p>{node.attrs.description}</p><div className="sm-node-buttons"><button type="button" onClick={edit}><StudioIcon name="edit" size={15}/> Szerkesztés</button><button type="button" onClick={deleteNode}><StudioIcon name="trash" size={15}/> Eltávolítás</button></div>{open&&<FloatingPanel title="Kapcsolati blokk szerkesztése" width={460} onClose={()=>setOpen(false)}>{[['title','Cím'],['description','Leírás'],['url','Kapcsolati oldal vagy CTA URL'],['button','Gomb szövege']].map(([key,label])=><label className="sm-field" key={key}>{label}<input value={draft[key]||''} onChange={e=>setDraft(v=>({...v,[key]:e.target.value}))}/></label>)}<div className="sm-modal-actions"><button type="button" className="portal-secondary" onClick={()=>setOpen(false)}>Mégse</button><button type="button" className="portal-primary" onClick={()=>{if(!safeLink(draft.url)){alert('Érvényes hivatkozás szükséges.');return;}updateAttributes(draft);setOpen(false);}}>Mentés</button></div></FloatingPanel>}</NodeViewWrapper>;}
const Column=Node.create({name:'column',content:'block+',isolating:true,parseHTML(){return [{tag:'div[data-blog-column]'}];},renderHTML(){return ['div',{'data-blog-column':true,class:'sm-editor-column'},0];}});
const Columns=Node.create({name:'columns',group:'block',content:'column{2,3}',isolating:true,addAttributes(){return {layout:{default:'equal'}};},parseHTML(){return [{tag:'div[data-blog-columns]'}];},renderHTML(){return ['div',{'data-blog-columns':true,class:'sm-editor-columns'},0];}});
function youtubeEmbed(url){try{const u=new URL(url);let id;if(['youtu.be'].includes(u.hostname))id=u.pathname.slice(1);if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname))id=u.searchParams.get('v')||(u.pathname.startsWith('/shorts/')?u.pathname.split('/')[2]:null);return id&&/^[\w-]{11}$/.test(id)?`https://www.youtube-nocookie.com/embed/${id}`:null;}catch{return null;}}
const ACTIONS=[
 {id:'paragraph',label:'Bekezdés',icon:'paragraph',group:'Szöveg'},
 {id:'h2',label:'Alcím (H2)',icon:'heading',group:'Szöveg'},
 {id:'h3',label:'Kisebb alcím (H3)',icon:'heading',group:'Szöveg'},
 {id:'bullet',label:'Felsorolás',icon:'bullet',group:'Szöveg'},
 {id:'numbers',label:'Számozott lista',icon:'numbered',group:'Szöveg'},
 {id:'quote',label:'Idézet',icon:'quote',group:'Szöveg'},
 {id:'line',label:'Elválasztó',icon:'separator',group:'Elrendezés'},
 {id:'columns',label:'Két hasáb',icon:'columns',group:'Elrendezés'},
 {id:'image',label:'Kép',icon:'image',group:'Média'},
 {id:'video',label:'Videó',icon:'video',group:'Média'},
 {id:'pdf',label:'PDF dokumentum',icon:'filetext',group:'Média'},
 {id:'embed',label:'Külső tartalom',icon:'link',group:'Média'},
 {id:'internal-link',label:'Belső hivatkozás',icon:'link',group:'Kapcsolatok'},
 {id:'quiz',label:'Interaktív kvíz',icon:'quiz',group:'Interaktív'},
 {id:'newsletter',label:'Kapcsolati felhívás',icon:'mailbox',group:'Interaktív'}
];
function IconButton({name,onClick,label,active=false,children}){return <button className={`sm-icon-button ${active?'is-active':''}`} type="button" title={label} aria-label={label} onMouseDown={e=>e.preventDefault()} onClick={onClick}><StudioIcon name={name}/>{children}</button>;}
export default function RichEditor({value,onChange,otherPosts=[],currentPost={}}){
 const [insertMenu,setInsertMenu]=useState(false),[slash,setSlash]=useState(''),[dialog,setDialog]=useState(''),[url,setUrl]=useState(''),[caption,setCaption]=useState(''),[picker,setPicker]=useState(false),[error,setError]=useState(''),[bubble,setBubble]=useState(null),[hover,setHover]=useState(null),[linkSearch,setLinkSearch]=useState('');
 const editorRef=useRef(null),changeRef=useRef(onChange),canvas=useRef(null),insertPos=useRef(null);changeRef.current=onChange;
 const recs=useMemo(()=>suggestionsFor(currentPost,otherPosts,{limit:20}),[currentPost,otherPosts]);
 function updateSlash(e){try{if(!e.isActive('codeBlock')&&e.state.selection.empty){const $=e.state.selection.$from;if($.parent.isTextblock){const before=$.parent.textBetween(0,$.parentOffset),m=before.match(/(?:^|\s)\/([\p{L}0-9-]*)$/u);if(m){setSlash(m[1]);setInsertMenu(true);return;}}}setInsertMenu(false);}catch{setInsertMenu(false);}}
 function updateBubble(e){if(e.state.selection.empty||e.isActive('image')){setBubble(null);return;}try{const {from,to}=e.state.selection,first=e.view.coordsAtPos(from),last=e.view.coordsAtPos(to);setBubble({x:Math.max(70,Math.min(window.innerWidth-70,(first.left+last.right)/2)),y:Math.max(12,Math.min(first.top,last.top)-54)});}catch{setBubble(null);}}
 const editor=useEditor({immediatelyRender:false,extensions:[StarterKit.configure({link:false,underline:false}),Placeholder.configure({placeholder:'Kezdj írni… A / jellel beszúrhatsz blokkokat.'}),Photo,LinkMark,Underline,Highlight,Align,Embed,Quiz,Signup,Columns,Column],content:parseDocument(value),onUpdate:({editor:e})=>{changeRef.current?.(e.getJSON());updateSlash(e);updateBubble(e);},onSelectionUpdate:({editor:e})=>updateBubble(e),editorProps:{attributes:{class:'sm-tiptap',spellcheck:'true'},handleDrop(view,event){const file=Array.from(event.dataTransfer?.files||[]).find(x=>x.type.startsWith('image/'));if(!file)return false;event.preventDefault();uploadFile(file,'blog').then(({url})=>editorRef.current?.chain().focus().setImage({src:url,alt:file.name}).run()).catch(e=>setError(e.message));return true;},handlePaste(view,event){const file=Array.from(event.clipboardData?.files||[]).find(x=>x.type.startsWith('image/'));if(!file)return false;event.preventDefault();uploadFile(file,'blog').then(({url})=>editorRef.current?.chain().focus().setImage({src:url,alt:file.name}).run()).catch(e=>setError(e.message));return true;}}});
 editorRef.current=editor;
 function run(id){if(!editor)return;setError('');const e=editor;
  // Remove the typed slash query without destroying the surrounding paragraph.
  if(insertMenu){const {$from}=e.state.selection,text=$from.parent.textBetween(0,$from.parentOffset),match=text.match(/(?:^|\s)\/([\p{L}0-9-]*)$/u);if(match)e.chain().focus().deleteRange({from:$from.pos-match[0].trimStart().length,to:$from.pos}).run();}
  if(insertPos.current!==null){const pos=Math.min(insertPos.current,e.state.doc.content.size);e.chain().focus().setTextSelection(pos).run();insertPos.current=null;}
  setInsertMenu(false);
  const chain=e.chain().focus();
  if(id==='paragraph')chain.setParagraph().run();
  else if(id==='h2'||id==='h3')chain.setHeading({level:id==='h2'?2:3}).run();
  else if(id==='bullet')chain.toggleBulletList().run();
  else if(id==='numbers')chain.toggleOrderedList().run();
  else if(id==='quote')chain.toggleBlockquote().run();
  else if(id==='line')chain.setHorizontalRule().run();
  else if(id==='columns')chain.insertContent({type:'columns',content:[{type:'column',content:[{type:'paragraph'}]},{type:'column',content:[{type:'paragraph'}]}]}).run();
  else if(id==='quiz')chain.insertContent({type:'quizBlock'}).run();
  else if(id==='newsletter')chain.insertContent({type:'newsletterBlock'}).run();
  else{setUrl('');setCaption('');setLinkSearch('');setDialog(id);}
 }
 const filtered=ACTIONS.filter(x=>(x.label+' '+x.id).toLowerCase().includes(slash.toLowerCase()));
 useEffect(()=>{if(!insertMenu)return;const f=e=>{if(e.key==='Escape'){e.preventDefault();setInsertMenu(false);}else if(e.key==='Enter'&&filtered.length){e.preventDefault();run(filtered[0].id);}};document.addEventListener('keydown',f,true);return()=>document.removeEventListener('keydown',f,true);},[insertMenu,slash,editor]);
 function insertLink(href,label){const safe=safeLink(href);if(!safe||!editor){setError('Érvénytelen hivatkozás.');return;}
  if(!editor.state.selection.empty){editor.chain().focus().setMark('link',{href:safe}).run();}
  else editor.chain().focus().insertContent({type:'text',text:label||safe,marks:[{type:'link',attrs:{href:safe}}]}).run();setDialog('');setBubble(null);
 }
 function addFromUrl(){const href=safeLink(url);if(!href){setError('Adj meg érvényes HTTPS- vagy belső webcímet.');return;}
  if(dialog==='internal-link'){insertLink(href,caption);return;}
  if(dialog==='image')editor?.chain().focus().setImage({src:href,alt:caption}).run();
  else editor?.chain().focus().insertContent({type:'embedBlock',attrs:{url:href,kind:dialog,title:caption}}).run();setDialog('');}
 const onMouseMove=e=>{if(!editor||!canvas.current||e.target.closest('button,.sm-photo-node,.sm-floating-panel'))return;const parent=e.target.closest('.ProseMirror > *');if(!parent){setHover(null);return;}const rect=parent.getBoundingClientRect(),root=canvas.current.getBoundingClientRect();let pos;try{pos=editor.view.posAtDOM(parent,0);}catch{return;}setHover({top:rect.top-root.top+Math.min(12,rect.height/2),pos});};
 function openNext(){if(!editor)return;const pos=hover?.pos;if(pos!==undefined){try{const resolved=editor.state.doc.resolve(Math.max(0,Math.min(pos,editor.state.doc.content.size)));insertPos.current=resolved.after(1);}catch{insertPos.current=null;}}setSlash('');setInsertMenu(true);}
 return <div className="sm-rich-editor">
  <div className="sm-slim-toolbar"><span>Szöveg és blokkok</span><div><button type="button" className="sm-history-button" title="Visszavonás" onMouseDown={e=>e.preventDefault()} onClick={()=>editor?.chain().focus().undo().run()}>Visszavonás</button><button type="button" className="sm-history-button" title="Újra" onMouseDown={e=>e.preventDefault()} onClick={()=>editor?.chain().focus().redo().run()}>Újra</button><button type="button" className="sm-soft-button" onMouseDown={e=>e.preventDefault()} onClick={()=>{insertPos.current=null;setSlash('');setInsertMenu(v=>!v);}}><StudioIcon name="plus" size={16}/> Blokk beszúrása</button></div></div>
  <div className="sm-editor-canvas" ref={canvas} onMouseMove={onMouseMove} onMouseLeave={()=>setHover(null)}>
   {hover&&!insertMenu&&<button type="button" style={{top:Math.max(4,hover.top)}} className="sm-block-insert" title="Új blokk beszúrása" aria-label="Új blokk beszúrása" onMouseDown={e=>e.preventDefault()} onClick={openNext}><StudioIcon name="plus" size={16}/></button>}
   <EditorContent editor={editor}/>
  </div>
  {bubble&&!dialog&&<div className="sm-selection-toolbar" style={{left:bubble.x,top:bubble.y}}><IconButton name="bold" label="Félkövér" active={editor?.isActive('bold')} onClick={()=>editor?.chain().focus().toggleBold().run()}/><IconButton name="italic" label="Dőlt" active={editor?.isActive('italic')} onClick={()=>editor?.chain().focus().toggleItalic().run()}/><IconButton name="underline" label="Aláhúzott" active={editor?.isActive('underline')} onClick={()=>editor?.chain().focus().toggleMark('underline').run()}/><IconButton name="link" label="Hivatkozás szerkesztése" onClick={()=>{setUrl(editor?.getAttributes('link').href||'');setDialog('internal-link');}}/><IconButton name="close" label="Hivatkozás törlése" onClick={()=>editor?.chain().focus().unsetMark('link').run()}/></div>}
  {insertMenu&&<FloatingPanel title="Blokk beszúrása" className="sm-insert-floating" width={490} onClose={()=>{setInsertMenu(false);insertPos.current=null;}}><input autoFocus placeholder="Keresés a blokkok között…" value={slash} onChange={e=>setSlash(e.target.value)} aria-label="Blokkok keresése"/><div className="sm-block-list">{filtered.map(item=><button type="button" key={item.id} onMouseDown={e=>e.preventDefault()} onClick={()=>run(item.id)}><span className="sm-block-icon"><StudioIcon name={item.icon} size={20}/></span><span><strong>{item.label}</strong><small>{item.group}</small></span></button>)}</div>{!filtered.length&&<p className="sm-helper">Nem található ilyen blokk.</p>}</FloatingPanel>}
  {dialog&&<FloatingPanel title={dialog==='internal-link'?'Belső hivatkozás':dialog==='image'?'Kép beszúrása':'Tartalom beágyazása'} width={dialog==='internal-link'?515:455} onClose={()=>setDialog('')}>
   {dialog==='internal-link'&&<><p className="sm-helper">Válassz kapcsolódó cikket, vagy írj be egy belső URL-t. Kijelölt szövegnél arra kerül a link.</p><input placeholder="Cikk keresése név, címke alapján…" value={linkSearch} onChange={e=>setLinkSearch(e.target.value)}/><div className="sm-related-picker">{[...recs,...otherPosts.filter(x=>x.status==='published'&&!recs.some(r=>r.id===x.id))].filter(p=>(p.title+' '+p.category_slug+' '+(p.tags||[]).join(' ')).toLowerCase().includes(linkSearch.toLowerCase())).slice(0,12).map(p=><button type="button" key={p.id} onClick={()=>insertLink(`/tudastar/${p.slug}`,p.title)}><strong>{p.title}</strong><small>{p.category_slug||'Kategória nélkül'} {p.relation?.risk?'· Hasonló célkulcsszó, ellenőrizd':'· Javasolt belső link'}</small></button>)}</div></>}
   {dialog==='image'&&<button className="portal-secondary sm-media-choice" type="button" onClick={()=>{setDialog('');setPicker(true);}}><StudioIcon name="folder"/> Választás a tárhelyből</button>}
   <label className="sm-field">{dialog==='internal-link'?'Hivatkozás':dialog==='image'?'Kép webcíme':'Beágyazandó webcím'}<input placeholder={dialog==='internal-link'?'/tudastar/a-cikk-cime':'https://…'} value={url} onChange={e=>setUrl(e.target.value)}/></label><label className="sm-field">{dialog==='internal-link'?'Hivatkozás szövege':dialog==='image'?'Kép alternatív szövege':'Megjelenő cím'}<input value={caption} onChange={e=>setCaption(e.target.value)}/></label><div className="sm-modal-actions"><button type="button" className="portal-secondary" onClick={()=>setDialog('')}>Mégse</button><button type="button" className="portal-primary" onClick={addFromUrl}>Beszúrás</button></div>
  </FloatingPanel>}
  {picker&&<div className="sm-modal-backdrop" onClick={()=>setPicker(false)}><div className="sm-modal sm-studio-picker" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Kép kiválasztása"><MediaLibrary picker accept="image" onClose={()=>setPicker(false)} onSelect={src=>{editor?.chain().focus().setImage({src,alt:''}).run();setPicker(false);}}/></div></div>}
  {error&&<p role="alert" className="sm-alert sm-alert-error">{error}</p>}
 </div>;
}
