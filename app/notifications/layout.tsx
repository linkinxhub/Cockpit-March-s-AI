import{requirePageMembership}from'@/lib/access-control';
export const dynamic='force-dynamic';
export default async function NotificationsLayout({children}:{children:React.ReactNode}){await requirePageMembership('/notifications');return children;}
