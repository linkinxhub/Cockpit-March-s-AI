import{requirePageMembership}from'@/lib/access-control';
export const dynamic='force-dynamic';
export default async function WatchlistLayout({children}:{children:React.ReactNode}){await requirePageMembership('/watchlist');return children;}
