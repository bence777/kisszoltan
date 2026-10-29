/**
 * Publication gates are independent of the demo/global launch switch.
 * The owner must approve service commitments and reviewed editorial content
 * before these URLs may enter an indexable sitemap.
 */
export const isArticleApproved = article => Boolean(
 article?.publicationApproved === true &&
 article?.authorApproved === true &&
 typeof article?.authorName === 'string' && article.authorName.trim() &&
 article?.factChecked === true &&
 /^\d{4}-\d{2}-\d{2}$/.test(article?.publishedAt || '') &&
 !Number.isNaN(Date.parse(article.publishedAt))
);
export const isServiceApproved = (service) => service?.publicationApproved === true && service?.contractTermsApproved === true;
