# Kiss Zoltán – SEO és technikai javítások (2026.10.29.)

**A noindex / nofollow NEM lett feloldva.** A demó továbbra is kizárt az indexelésből. Az ehhez kapcsolódó `robots.txt`, sitemap és az admin/auth X-Robots-Tag szabályok nem változtak.

## Elvégzett javítások

1. **Title** – a főoldal rövidebb címet kapott: `Kiss Zoltán | Prémium ingatlanok Budapesten`.
2. **Canonical** – abszolút, önmagára mutató canonical a demón, indexeléstől függetlenül. Demó alapesetben: `https://kisszoltan-q2r9.vercel.app/`; egyedi demó URL-hez: `NEXT_PUBLIC_DEMO_URL`. Az indexelés jóváhagyása után a `NEXT_PUBLIC_SITE_URL` a végleges domainre mutasson.
3. **HTML lang és JavaScript nélküli tájékoztatás** – új `pages/_document.jsx`, amely `lang="hu"` attribútumot és egy `<noscript>` figyelmeztetést állít be.
4. **Schema.org** – minden nyilvános oldalhoz `WebPage`; főoldalhoz valós közölt adatokon alapuló `RealEstateAgent` és `WebSite`; ahol rendelkezésre állnak jóváhagyott oldalspecifikus adatok, ezek is bekerülnek. Nincsenek kitalált értékelések, lezárt eladások vagy pontos cím.
5. **Címsorok** – a footer hibás H4 oszlopfeliratai változatlan stílussal szöveges címkékre kerültek, a duplázódó „Kiss Zoltán” címsor helyett „További oldalak” szerepel.
6. **Akadálymentesség** – a főoldali inputok, selectek, textarea-k és interaktív ársávok explicit hozzáférhető nevet kaptak, az eredeti vizuális label-ek megmaradtak.
7. **Security headers** – HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, és szűk, biztonságosan érvényesíthető CSP (`frame-ancestors`, `object-src`, `base-uri`). **A szkriptekre és CSS-re vonatkozó szigorú CSP-t nem kényszerítettük ki**, mert ez működő Next.js / Supabase / admin / űrlap folyamatokat törhetne.
8. **Modern képformátumok** – a fő képmegjelenítő és több ingatlanblokk Next Image optimalizációra állt át (AVIF/WebP támogatással), az eredeti JPG-re visszaváltással, ha a külső képszerver az optimalizálást akadályozza. A publikált képek eredeti forrása változatlan.
9. **CSS** – a 16 globális CSS import eredeti sorrendben egy `styles/kz-site.css` fájlba került; a megjelenés szándékosan változatlan. A régi stílusfájlok archívumként megmaradtak, de az alkalmazás már a `kz-site.css`-t tölti be. A Next.js által generált CSS és a betűkészletek egy része továbbra is renderblokkoló lehet – ezt a kész deployn kell mérni.
10. **Config ütközés** – a duplikált, felesleges `next.config.mjs` törölve; a tényleges `next.config.js` eredeti átirányításai és privát cache szabályai megmaradtak.

## Deploy és ellenőrzés

- `npm install` és `npm run build` egy Linuxra telepített függőségekkel rendelkező gépen, vagy a Vercel buildjén.
- Vercel projektbe a csomag tartalma kerüljön, majd redeploy; a `noindex` ne változzon.
- Nyissa meg a demó főoldalának HTML-forrását: `<html lang="hu">`, `rel="canonical"`, `application/ld+json`, `meta name="robots" content="noindex,nofollow"`.
- Browser Network / Response Headers: HSTS, CSP, X-Frame-Options, nosniff.
- Ellenőrizze az admin bejelentkezést, űrlapküldést, ingatlan-adatlap fotóit, galériáját és CMS képeit éles deployon.
- Futtassa újra a ReadyTools auditot ugyanarra a URL-re. A külső kép CDN, a renderblokkoló stílusok és a biztonsági pontszám egy része a tényleges HTTP-válaszoktól függ.

## Ellenőrzési korlát

A csomag JavaScript/JSX/TypeScript állományai szintaktikailag ellenőrizve. A teljes Next.js build a jelenlegi futtatókörnyezetben **nem volt futtatható**: az eredeti ZIP macOS ARM64 SWC függőséget tartalmaz, a Linuxos `@next/swc-linux-x64-gnu` letöltését pedig a hálózat/névfeloldás megakadályozta (`EAI_AGAIN registry.npmjs.org`). Ez nem jelenti azt, hogy a Vercel build hibás; sikeres deploy után ott ellenőrizendő.
