export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
// The uploaded project is a demo. Indexing must be explicitly enabled only after content, rights and contact flows are approved.
export const INDEXABLE = process.env.NEXT_PUBLIC_SITE_LIVE === 'true' && Boolean(SITE_URL);
export const ROBOTS = INDEXABLE ? 'index,follow,max-image-preview:large' : 'noindex,nofollow';
// Staging canonical remains self-referential even if production SITE_URL is configured.
export const CANONICAL_ORIGIN = INDEXABLE ? SITE_URL : (process.env.NEXT_PUBLIC_DEMO_URL || 'https://kisszoltan-q2r9.vercel.app').replace(/\/$/, '');
export const canonical = path => `${CANONICAL_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
export const jsonLd = value => JSON.stringify(value).replace(/</g, '\\u003c');
export const mailto = (subject, body='') => `mailto:ingatlan@kisszoltan.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
