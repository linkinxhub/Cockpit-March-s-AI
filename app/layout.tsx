import type { Metadata } from "next";
import "./globals.css";
import'./auth.css';
import{ClerkProvider}from'@clerk/nextjs';

export const metadata: Metadata = {
  title: "Cockpit Marchés AI",
  description: "Scanner éducatif pour cryptomonnaies, Forex et indices.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content=process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    ? <ClerkProvider>{children}</ClerkProvider>
    : children;

  return (
    <html lang="fr">
      <body className="antialiased">{content}</body>
    </html>
  );
}
