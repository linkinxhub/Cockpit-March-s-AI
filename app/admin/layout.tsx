import'../account/account.css';import'./admin.css';import{requirePageMembership}from'@/lib/access-control';
export const dynamic='force-dynamic';
export default async function AdminLayout({children}:{children:React.ReactNode}){await requirePageMembership('/admin',{roles:['ADMIN']});return children;}
