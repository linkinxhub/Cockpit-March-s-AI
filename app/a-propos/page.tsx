import PublicInfoPage from '@/components/public-info-page';
import {getPublicContent} from '@/lib/public-content-service';
export const dynamic='force-dynamic';
export default async function Page(){const data=await getPublicContent();return <PublicInfoPage page="about" content={data.content} updatedAt={data.updatedAt}/>;}
