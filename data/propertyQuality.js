/**
 * Field-specific publication review. The listed size remains data/properties.js's
 * one display source; this metadata does not silently reinterpret it as net space.
 */
export const areaBreakdowns={
 'KZ-002':{interiorSqm:95,terraceSqm:100,roofTerraceSqm:100,note:'95 m² belső tér, 100 m² terasz és 100 m² sky terasz. A 170 m²-es listázási méret tartalma még nem igazolt.'},
 'KZ-003':{planInteriorSqm:296.44,note:'A 345 m² listázási méret és a 296,44 m² terv szerinti lakótér eltérő fogalom lehet.'},
 'KZ-004':{alternativeSqm:445,note:'A nyilvános anyagban 443 és 445 m² egyaránt szerepel; egyeztetendő.'}
};
export const listingSnapshotDate='2026-10-29';
export function areaFacts(p){
 const extra=areaBreakdowns[p.code];
 return {display:`${p.size} m²`,label:p.areaNote?'Listázott méret':'Alapterület',breakdown:extra,
  unitRateAllowed:!p.areaNote&&p.areaDefinitionApproved===true,verified:!p.areaNote&&p.areaDefinitionApproved===true};
}
/** Owner approval must be explicit and must follow source, rights, price and area checks. */
export function isPublicationApproved(p){
 return p.status==='Eladó'&&p.publicationApproved===true&&p.areaDefinitionApproved===true&&
  p.priceApproved===true&&p.mediaRightsApproved===true&&Boolean(p.sourceUrl)&&!p.areaNote;
}
export function propertyWarnings(p){
 const issues=[];
 if(!p.id||!p.code||!p.slug||!p.title)issues.push('hiányzó azonosító / cím');
 if(!Number.isFinite(p.price)||p.price<=0)issues.push('érvénytelen ár');
 if(!Number.isFinite(p.size)||p.size<=0)issues.push('érvénytelen listázási méret');
 if(!['Eladó','Eladva','Visszavonva'].includes(p.status))issues.push('ismeretlen státusz');
 if(!p.images?.length)issues.push('hiányzó fotó');
 else if(p.images.length<3)issues.push('3-nál kevesebb fotó');
 if(!p.floorplans?.length)issues.push('nincs ellenőrzött alaprajz');
 if(p.areaNote)issues.push('ellentmondó vagy tisztázandó területadat');
 if(!p.areaDefinitionApproved)issues.push('területdefiníció nem jóváhagyott');
 if(!p.priceApproved)issues.push('hirdetési ár nincs újra jóváhagyva');
 if(!p.mediaRightsApproved)issues.push('médiajogok jóváhagyása hiányzik');
 if(!p.publicationApproved)issues.push('publikáció nincs jóváhagyva');
 if(!p.sourceUrl)issues.push('hiányzó elsődleges forrás URL');
 return issues;
}
