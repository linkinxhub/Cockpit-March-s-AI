import FeedbackCenter from "@/components/feedback-center";
import UpdateCenter from "@/components/update-center";
import { BUILD_ID } from "@/lib/build-version";
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
      <body className="antialiased">{children}<FeedbackCenter/><UpdateCenter runningBuild={BUILD_ID}/></body>
    </html>
  );
}
