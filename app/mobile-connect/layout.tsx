import{requirePageMembership}from'@/lib/access-control';
export const dynamic='force-dynamic';
export default async function MobileConnectLayout({children}:{children:React.ReactNode}){await requirePageMembership('/mobile-connect');return children;}
