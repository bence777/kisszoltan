import {properties} from '../data/properties';

/** Shared category semantics: listing UI, indexability and sitemap must agree. */
export function selectCategoryProperties(filter,list=properties){
 const active=list.filter(p=>p.status==='Eladó');
 switch(filter){
  case 'villa-budapest': return active.filter(p=>p.type==='Villa'&&p.location.includes('Budapest'));
  case 'penthouse': return active.filter(p=>p.type==='Penthouse'&&p.location.includes('Budapest'));
  case 'ii': return active.filter(p=>p.district===2);
  default: return active;
 }
}
