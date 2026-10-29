import {db,configured} from './db';
import {properties} from '../data/properties';
export async function publishedPosts(){
 if(!configured())return [];
 const {data,error}=await db().from('kz_blog_posts').select('id,slug,title,excerpt,content,cover_url,category_slug,tags,related_mode,related_ids,seo_title,seo_description,published_at,updated_at,author_name').eq('status','published').order('published_at',{ascending:false}).limit(100);
 if(error)throw error;return data||[];
}
export async function publishedPost(slug){
 if(!configured())return null;
 const {data,error}=await db().from('kz_blog_posts').select('id,slug,title,excerpt,content,cover_url,category_slug,tags,related_mode,related_ids,seo_title,seo_description,published_at,updated_at,author_name').eq('slug',slug).eq('status','published').maybeSingle();
 if(error)throw error;return data;
}
export async function propertyOverrides(){
 if(!configured())return {};
 const {data,error}=await db().from('kz_property_overrides').select('slug,title,description,price,status,images,updated_at').limit(250);
 if(error)throw error;
 return Object.fromEntries((data||[]).map(x=>[x.slug,x]));
}
export function mergedProperty(p,overrides){
 if(!p)return null;
 const o=overrides?.[p.slug];if(!o)return p;
 return {...p,...Object.fromEntries(['title','description','price','status','images'].filter(k=>o[k]!=null).map(k=>[k,o[k]]))};
}
export async function currentProperties(){
 try{const overrides=await propertyOverrides();return properties.map(p=>mergedProperty(p,overrides));}
 catch(error){console.error('[property overrides]',error.message);return properties;}
}

export async function publishedRedirect(oldSlug){
 if(!configured())return null;
 const {data,error}=await db().from('kz_blog_slug_redirects').select('post_id').eq('old_slug',oldSlug).maybeSingle();
 if(error)throw error;if(!data)return null;
 const {data:post,error:second}=await db().from('kz_blog_posts').select('slug').eq('id',data.post_id).eq('status','published').maybeSingle();if(second)throw second;return post?.slug||null;
}
