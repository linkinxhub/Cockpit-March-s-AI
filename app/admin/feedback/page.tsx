import FeedbackInbox from '@/components/feedback-inbox';
import {requirePageMembership} from '@/lib/access-control';
export default async function Page(){await requirePageMembership('/admin/feedback',{roles:['ADMIN']});return <FeedbackInbox/>;}
