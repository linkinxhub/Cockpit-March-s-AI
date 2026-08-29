export async function GET(){
 const publicKey=process.env.WEB_PUSH_PUBLIC_KEY||'';
 return Response.json({configured:Boolean(publicKey),publicKey:publicKey||null},{headers:{'Cache-Control':'public, max-age=300'}});
}
