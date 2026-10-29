/** Server-only transactional mail. Store first: mail outages never delete a lead. */
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function sendEmail(message){
 const {RESEND_API_KEY,LEAD_FROM_EMAIL}=process.env;
 if(!RESEND_API_KEY||!LEAD_FROM_EMAIL)throw new Error('email_not_configured');
 const response=await fetch('https://api.resend.com/emails',{
  method:'POST',headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json'},
  body:JSON.stringify({from:LEAD_FROM_EMAIL,...message}),signal:AbortSignal.timeout(12000)
 });
 if(!response.ok){console.error('Lead email provider status',response.status);throw new Error('email_provider_failed');}
}
export async function notifyOwner(details,leadId){
 if(!process.env.LEAD_TO_EMAIL)throw new Error('email_recipient_not_configured');
 const rows=[['Megkeresés',details.type],['Azonosító',leadId],['Név',details.name],['E-mail',details.email],['Telefon',details.phone],['Ingatlan',details.propertyCode],['Belépési oldal',details.landingPath],['Küldési oldal',details.source],['Forráscsatorna',details.utmSource],['Üzenet',details.message]];
 await sendEmail({to:[process.env.LEAD_TO_EMAIL],reply_to:details.email,subject:`Kiss Zoltán | ${details.type}${details.propertyCode?' | '+details.propertyCode:''}`,
  html:`<h2>Új rögzített érdeklődés</h2><p>Belső azonosító: ${escapeHtml(leadId)}</p>${rows.map(([k,v])=>`<p><b>${escapeHtml(k)}:</b> ${escapeHtml(v).replace(/\n/g,'<br>')}</p>`).join('')}`,
  text:rows.map(([k,v])=>`${k}: ${v||'—'}`).join('\n\n')});
}
export async function notifyVisitor(details){
 await sendEmail({to:[details.email],subject:'Megkeresésének fogadása | Kiss Zoltán',
  text:`Tisztelt ${details.name}!\n\nMegkeresését rögzítettük. Ez a levél nem időpont-visszaigazolás; a továbbiakról személyesen egyeztetünk.\n\nÜdvözlettel:\nKiss Zoltán\n${process.env.LEAD_TO_EMAIL||''}`,
  html:`<p>Tisztelt ${escapeHtml(details.name)}!</p><p>Megkeresését rögzítettük. Ez a levél nem időpont-visszaigazolás; a továbbiakról személyesen egyeztetünk.</p><p>Üdvözlettel:<br>Kiss Zoltán</p>`});
}
