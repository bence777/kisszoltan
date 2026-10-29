import {useEffect,useRef,useState} from 'react';
import StudioIcon from './StudioIcon';
/** Draggable non-blocking modal, whole panel fades when mouse and keyboard focus are away. */
export default function FloatingPanel({title,onClose,children,className='',width=460,initial}){
 const panel=useRef(null),drag=useRef(null);
 const [position,setPosition]=useState(()=>initial||{x:Math.max(12,typeof window==='undefined'?350:(window.innerWidth-width)/2),y:118});
 const [moving,setMoving]=useState(false);
 function down(e){if(e.button!==0||e.target.closest('button,input,textarea,select,a'))return;const r=panel.current?.getBoundingClientRect();if(!r)return;drag.current={pointer:e.pointerId,startX:e.clientX,startY:e.clientY,x:r.left,y:r.top};e.currentTarget.setPointerCapture(e.pointerId);setMoving(true);}
 function move(e){if(!drag.current||drag.current.pointer!==e.pointerId)return;const {startX,startY,x,y}=drag.current;const width=panel.current?.offsetWidth||360;setPosition({x:Math.min(Math.max(8,x+e.clientX-startX),Math.max(8,window.innerWidth-width-8)),y:Math.min(Math.max(8,y+e.clientY-startY),Math.max(8,window.innerHeight-75))});}
 function up(e){if(drag.current?.pointer===e.pointerId){drag.current=null;setMoving(false);}}
 useEffect(()=>{const resize=()=>setPosition(p=>({x:Math.max(8,Math.min(p.x,window.innerWidth-Math.min(width,window.innerWidth-24)-8)),y:Math.max(8,Math.min(p.y,window.innerHeight-76))}));window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[width]);
 useEffect(()=>{const esc=e=>{if(e.key==='Escape')onClose?.();};window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc);},[onClose]);
 return <section ref={panel} role="dialog" aria-label={title} className={`sm-floating-panel ${moving?'is-dragging':''} ${className}`} style={{left:position.x,top:position.y,width:`min(calc(100vw - 24px), ${width}px)`}}>
  <div className="sm-float-title" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><span className="sm-drag-grip"><StudioIcon name="grip" size={16}/></span><strong>{title}</strong><span className="sm-float-hint">Húzással mozgatható</span><button type="button" className="sm-icon-button" onClick={onClose} aria-label="Panel bezárása"><StudioIcon name="close"/></button></div>
  <div className="sm-float-body">{children}</div>
 </section>;
}
