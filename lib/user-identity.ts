import { headers } from 'next/headers';

export type SharedUserIdentity={
  id:string;
  email:string;
  displayName:string;
  source:'chatgpt';
};

function stableId(email:string){
  return `chatgpt:${email.trim().toLowerCase()}`;
}

export async function getSharedUserIdentity():Promise<SharedUserIdentity|null>{
  const h=await headers();
  const email=h.get('oai-authenticated-user-email');
  if(!email)return null;
  const encoded=h.get('oai-authenticated-user-full-name');
  let fullName:string|null=null;
  if(encoded&&h.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8'){
    try{fullName=decodeURIComponent(encoded);}catch{fullName=null;}
  }
  return{id:stableId(email),email,displayName:fullName||email,source:'chatgpt'};
}
