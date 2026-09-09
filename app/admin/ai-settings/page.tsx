import AISettingsPanel from '@/components/ai-settings-panel';
import {requireAISettingsOwner} from '@/lib/ai-settings-store';
import {redirect} from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Page(){try{await requireAISettingsOwner();}catch{redirect('/account');}return <AISettingsPanel/>;}
