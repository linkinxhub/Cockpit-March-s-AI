import type { Metadata } from "next";
import "./globals.css";
import'./auth.css';

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
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
