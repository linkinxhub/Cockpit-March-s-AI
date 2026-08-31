import{requirePageMembership}from'@/lib/access-control';
export const dynamic='force-dynamic';
export default async function JournalLayout({children}:{children:React.ReactNode}){await requirePageMembership('/journal');return children;}
