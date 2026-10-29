/**
 * Only real, finished, permission-cleared sales may be added here.
 * Each entry must include: slug, title, propertyType, area, challenge,
 * strategy, process, outcome, evidence, approvalDate, ownerPermission, verified.
 * Do not add active listings as completed cases.
 */
export const caseStudies=[];
export const publishedCaseStudies=caseStudies.filter(c=>
 c.verified===true&&c.ownerPermission===true&&Boolean(c.approvalDate)&&
 Boolean(c.title&&c.slug&&c.challenge&&c.strategy&&c.process&&c.outcome&&c.evidence)
);
