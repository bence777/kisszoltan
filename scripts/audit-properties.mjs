import {properties} from '../data/properties.js';
import {listingSnapshotDate,propertyWarnings,isPublicationApproved} from '../data/propertyQuality.js';
const keys=new Set(),slugs=new Set();let errors=0,approved=0;
console.log(`Kiss Zoltán · ingatlanadat-audit | forrás pillanatkép: ${listingSnapshotDate}`);
for(const p of properties){
 const warnings=propertyWarnings(p);
 if(keys.has(p.code)){warnings.push('DUPLIKÁLT AZONOSÍTÓ');errors++;}keys.add(p.code);
 if(slugs.has(p.slug)){warnings.push('DUPLIKÁLT SLUG');errors++;}slugs.add(p.slug);
 if(isPublicationApproved(p))approved++;
 console.log(`\n${p.code} · ${p.title} · ${p.status}`);
 for(const issue of warnings)console.log(` - ${issue}`);
 if(!warnings.length)console.log(' - rendben');
}
console.log(`\nÖsszesen ${properties.length} ingatlan · ${approved} tulajdonos által jóváhagyott, indexelhető adatlap.`);
if(process.argv.includes('--strict')&&(approved!==properties.filter(p=>p.status==='Eladó').length||errors))process.exitCode=1;
