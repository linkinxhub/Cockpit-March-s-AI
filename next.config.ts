import type { NextConfig } from "next";

// Use the configured instance, including custom production Clerk domains.
// Never put a secret key or an unrestricted https: source in script-src.
export function contentSecurityPolicy(publishableKey?: string) {
  let clerkOrigin = "";
  if (publishableKey) {
    const encoded = /^pk_(?:test|live)_([A-Za-z0-9+/]+={0,2})$/.exec(publishableKey)?.[1];
    const decoded = encoded ? Buffer.from(encoded, "base64").toString("utf8") : "";
    const hostname = decoded.endsWith("$") ? decoded.slice(0, -1) : "";
    if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(hostname)) {
      throw new Error("Invalid Clerk publishable key: cannot configure authentication CSP");
    }
    clerkOrigin = ` https://${hostname.toLowerCase()}`;
  }
  // https://clerk.com/docs/guides/secure/best-practices/csp-headers
  const clerkScripts = clerkOrigin ? `${clerkOrigin} https://challenges.cloudflare.com https://*.protect.clerk.com` : "";
  const clerkFrames = clerkOrigin ? " https://challenges.cloudflare.com https://*.protect.clerk.com" : "";
  const clerkConnections = clerkOrigin ? `${clerkOrigin} https://*.protect.clerk.com:*` : "";
  return `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self' https://chatgpt.com; form-action 'self'; script-src 'self' 'unsafe-inline'${clerkScripts}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:${clerkConnections}; frame-src 'self' https://*.stripe.com https://*.link.com${clerkFrames}; worker-src 'self' blob:; upgrade-insecure-requests`;
}

const nextConfig: NextConfig = {
  async headers(){return[{source:'/(.*)',headers:[
    {key:'Content-Security-Policy',value:contentSecurityPolicy(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)},
    {key:'Strict-Transport-Security',value:'max-age=63072000; includeSubDomains; preload'},
    {key:'X-Content-Type-Options',value:'nosniff'},
    {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
    {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=(), payment=(self)'},
    {key:'X-Frame-Options',value:'SAMEORIGIN'},
  ]}]},
};

export default nextConfig;
