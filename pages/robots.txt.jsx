import {INDEXABLE,SITE_URL} from '../lib/seo';
export async function getServerSideProps({res}){res.setHeader('Content-Type','text/plain; charset=utf-8');res.write(INDEXABLE?`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');res.end();return {props:{}}}
export default function Robots(){return null}
