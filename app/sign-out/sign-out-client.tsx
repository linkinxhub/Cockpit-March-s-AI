'use client';
import{useClerk}from'@clerk/nextjs';import{useEffect}from'react';
export function SignOutClient(){const{signOut}=useClerk();useEffect(()=>{void signOut({redirectUrl:'/'});},[signOut]);return <main className="authShell"><p>Déconnexion sécurisée…</p></main>}
