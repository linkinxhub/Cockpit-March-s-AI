import ContactPanel from '@/components/contact-panel';
import {getPublicContent} from '@/lib/public-content-service';
export const dynamic='force-dynamic';
export default async function Page(){const {content}=await getPublicContent();return <ContactPanel email={content.operator.email}/>;}
