import 'server-only';
import {readPublicContentRow,writePublicContentRow} from './public-content-store';
import {contentSchema,defaultContent,type PublicContent} from './public-content';
export async function getPublicContent(){const row=await readPublicContentRow();return row?{content:contentSchema.parse(JSON.parse(row.encrypted_key)),updatedAt:Number(row.updated_at)}:{content:defaultContent,updatedAt:0};}
export async function savePublicContent(content:PublicContent,actor:string,previous:number){const now=Date.now();await writePublicContentRow(JSON.stringify(content),'public-content-v1',actor,now,previous);return now;}
