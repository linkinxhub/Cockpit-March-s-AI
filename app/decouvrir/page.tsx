import type { Metadata } from "next";
import Discovery from "./discovery";
import "./discovery.css";

export const metadata: Metadata = {
  title: "Comprendre les marchés, éclairer vos décisions | Cockpit Marchés AI",
  description: "Découvrez Cockpit Marchés AI : panorama des marchés, analyse technique et IA, scénarios et horizons multiples. Vous gardez la décision finale.",
};

export default function Page() { return <Discovery />; }
