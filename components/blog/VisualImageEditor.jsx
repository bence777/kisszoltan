import {useEffect,useMemo,useRef,useState} from 'react';
import {uploadFile} from '../../lib/mediaClient';
import FloatingPanel from './FloatingPanel';
import StudioIcon from './StudioIcon';
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
const startCrop={x:0,y:0,w:1,h:1};
const loadImage=src=>new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('A kép nem tölthető be szerkesztéshez. Csak CORS-t engedélyező, elérhető képek vághatók.'));img.src=src;});
const blobFromCanvas=(canvas,type='image/webp',quality=.9)=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Nem sikerült elkészíteni a képet.')),type,quality));
export default function VisualImageEditor({image,onClose,onApply}){
 const [source,setSource]=useState(image.src),[natural,setNatural]=useState({w:1,h:1}),[crop,setCrop]=useState(startCrop),[alt,setAlt]=useState(image.alt||''),[caption,setCaption]=useState(image.caption||''),[width,setWidth]=useState(image.width||'100%'),[align,setAlign]=useState(image.align||'center'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[dirty,setDirty]=useState(false),[stageSize,setStageSize]=useState({w:480,h:310});
 const stage=useRef(null),drag=useRef(null),owned=useRef([]);
 useEffect(()=>{if(!stage.current||typeof ResizeObserver==='undefined')return;const observer=new ResizeObserver(entries=>{const r=entries[0].contentRect;setStageSize({w:r.width,h:r.height});});observer.observe(stage.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{let live=true;loadImage(source).then(img=>{if(live)setNatural({w:img.naturalWidth,h:img.naturalHeight});}).catch(e=>{if(live)setError(e.message);});return()=>{live=false;};},[source]);
 useEffect(()=>()=>owned.current.forEach(x=>URL.revokeObjectURL(x)),[]);
 const imageBox=useMemo(()=>{const a=natural.w/natural.h,viewW=stageSize.w,viewH=stageSize.h,ratio=viewW/viewH;const w=a>ratio?viewW:viewH*a,h=a>ratio?viewW/a:viewH;return {left:(viewW-w)/2,top:(viewH-h)/2,w,h};},[natural,stageSize]);
 const cropStyle={left:`${imageBox.left+crop.x*imageBox.w}px`,top:`${imageBox.top+crop.y*imageBox.h}px`,width:`${crop.w*imageBox.w}px`,height:`${crop.h*imageBox.h}px`};
 const begin=(e,handle)=>{e.preventDefault();e.stopPropagation();e.currentTarget.setPointerCapture(e.pointerId);drag.current={id:e.pointerId,handle,x:e.clientX,y:e.clientY,crop:{...crop}};};
 const track=e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;const dx=(e.clientX-d.x)/imageBox.w,dy=(e.clientY-d.y)/imageBox.h;const c={...d.crop};if(d.handle==='move'){c.x=clamp(d.crop.x+dx,0,1-c.w);c.y=clamp(d.crop.y+dy,0,1-c.h);}else{
  const minW=Math.min(.12,80/imageBox.w),minH=Math.min(.12,80/imageBox.h);
  if(d.handle.includes('l')){const nx=clamp(d.crop.x+dx,0,d.crop.x+d.crop.w-minW);c.w=d.crop.w+(d.crop.x-nx);c.x=nx;}
  if(d.handle.includes('r'))c.w=clamp(d.crop.w+dx,minW,1-c.x);
  if(d.handle.includes('t')){const ny=clamp(d.crop.y+dy,0,d.crop.y+d.crop.h-minH);c.h=d.crop.h+(d.crop.y-ny);c.y=ny;}
  if(d.handle.includes('b'))c.h=clamp(d.crop.h+dy,minH,1-c.y);
 }setCrop(c);setDirty(true);};
 const end=e=>{if(drag.current?.id===e.pointerId)drag.current=null;};
 async function rotate(clockwise){setBusy(true);setError('');try{const img=await loadImage(source);const max=2400,scale=Math.min(1,max/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.round(img.height*scale);canvas.height=Math.round(img.width*scale);const c=canvas.getContext('2d');c.translate(canvas.width/2,canvas.height/2);c.rotate(clockwise?Math.PI/2:-Math.PI/2);c.drawImage(img,-img.width*scale/2,-img.height*scale/2,img.width*scale,img.height*scale);const blob=await blobFromCanvas(canvas);const url=URL.createObjectURL(blob);owned.current.push(url);setSource(url);setCrop(startCrop);setDirty(true);}catch(e){setError(e.message);}finally{setBusy(false);}}
 function preset(type){const ratio=type==='square'?1:type==='portrait'?3/4:16/9;const areaRatio=natural.w/natural.h;let w=.9,h=.9;if(areaRatio>ratio)w=Math.min(.9,.9*ratio/areaRatio);else h=Math.min(.9,.9*areaRatio/ratio);setCrop({x:(1-w)/2,y:(1-h)/2,w,h});setDirty(true);}
 async function save(){setBusy(true);setError('');try{let src=source;if(dirty){const img=await loadImage(source);const sx=Math.round(img.naturalWidth*crop.x),sy=Math.round(img.naturalHeight*crop.y),sw=Math.max(1,Math.round(img.naturalWidth*crop.w)),sh=Math.max(1,Math.round(img.naturalHeight*crop.h));const scale=Math.min(1,2400/Math.max(sw,sh));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(sw*scale));canvas.height=Math.max(1,Math.round(sh*scale));canvas.getContext('2d').drawImage(img,sx,sy,sw,sh,0,0,canvas.width,canvas.height);const blob=await blobFromCanvas(canvas);const file=new File([blob],`blog-kep-${Date.now()}.webp`,{type:'image/webp'});const result=await uploadFile(file,'blog/szerkesztett',{enabled:false});src=result.url;}
  onApply({src,alt:alt.trim(),caption:caption.trim(),width,align,rotation:0,fit:'contain',height:0});onClose();
 }catch(e){setError(e.message);}finally{setBusy(false);}}
 return <FloatingPanel title="Kép vizuális szerkesztése" width={548} className="sm-crop-dialog" onClose={onClose} initial={{x:typeof window!=='undefined'?Math.max(12,(window.innerWidth-548)/2):300,y:84}}>
  <p className="sm-helper">Fogd meg a kijelölést a kép kivágásához. A sarkokkal méretezhetsz; az elforgatás a képet módosítja, nem csak a megjelenítését.</p>
  <div className="sm-image-edit-controls"><button type="button" className="sm-soft-button" onClick={()=>rotate(false)} disabled={busy}><StudioIcon name="rotate" size={16}/> Forgatás balra</button><button type="button" className="sm-soft-button" onClick={()=>rotate(true)} disabled={busy}><StudioIcon name="rotate" size={16} style={{transform:'scaleX(-1)'}}/> Forgatás jobbra</button><div className="sm-crop-presets"><button onClick={()=>preset('wide')} type="button">16:9</button><button onClick={()=>preset('square')} type="button">1:1</button><button onClick={()=>preset('portrait')} type="button">3:4</button></div></div>
  <div className="sm-crop-stage" ref={stage}>
   <img src={source} alt="Vágás előnézete" style={{left:imageBox.left,top:imageBox.top,width:imageBox.w,height:imageBox.h}} draggable={false}/>
   <div className="sm-crop-overlay" style={cropStyle} onPointerDown={e=>begin(e,'move')} onPointerMove={track} onPointerUp={end} onPointerCancel={end}>
    {['tl','tr','bl','br'].map(h=><span key={h} className={`sm-crop-handle sm-crop-${h}`} onPointerDown={e=>begin(e,h)} onPointerMove={track} onPointerUp={end} onPointerCancel={end}/>)}
   </div>
  </div>
  <div className="sm-image-fields"><label className="sm-field">Alternatív szöveg<input value={alt} onChange={e=>setAlt(e.target.value)} placeholder="Mit ábrázol a kép?"/></label><label className="sm-field">Képaláírás<input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Opcionális"/></label></div>
  <div className="sm-image-fields"><div className="sm-field"><span>Kép szélessége</span><div className="sm-choice-row">{[['100%','Teljes'],['75%','Széles'],['50%','Fél']].map(([v,label])=><button type="button" className={width===v?'is-active':''} key={v} onClick={()=>setWidth(v)}>{label}</button>)}</div></div><div className="sm-field"><span>Elhelyezés</span><div className="sm-choice-row">{[['left','Balra'],['center','Középre'],['right','Jobbra']].map(([v,label])=><button type="button" className={align===v?'is-active':''} key={v} onClick={()=>setAlign(v)}>{label}</button>)}</div></div></div>
  {error&&<p className="sm-alert sm-alert-error" role="alert">{error}</p>}
  <div className="sm-modal-actions"><button type="button" className="portal-secondary" onClick={onClose} disabled={busy}>Mégse</button><button type="button" className="portal-primary" onClick={save} disabled={busy}>{busy?'Kép feldolgozása…':'Módosítások alkalmazása'}</button></div>
 </FloatingPanel>;
}
