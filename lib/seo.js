export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
// The uploaded project is a demo. Indexing must be explicitly enabled only after content, rights and contact flows are approved.
export const INDEXABLE = process.env.NEXT_PUBLIC_SITE_LIVE === 'true' && Boolean(SITE_URL);
export const ROBOTS = INDEXABLE ? 'index,follow,max-image-preview:large' : 'noindex,nofollow';
export const canonical = path => INDEXABLE ? `${SITE_URL}${path === '/' ? '/' : path}` : null;
export const jsonLd = value => JSON.stringify(value).replace(/</g, '\\u003c');
export const mailto = (subject, body='') => `mailto:ingatlan@kisszoltan.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
