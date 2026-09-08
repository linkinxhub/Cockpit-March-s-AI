"use client";
import { useEffect, useSyncExternalStore } from "react";
import type { Lang } from "./i18n";
const key = "cockpit-language";
const event = "cockpit-language-change";
let fallback: Lang = "fr";
function valid(value: string | null): value is Lang { return value !== null && ["fr", "en", "de", "nl"].includes(value); }
function snapshot(): Lang {
  try { const saved = localStorage.getItem(key); return valid(saved) ? saved : fallback; } catch { return fallback; }
}
function subscribe(notify: () => void) {
  const storage = (e: StorageEvent) => { if (e.key === key || e.key === null) notify(); };
  window.addEventListener(event, notify);
  window.addEventListener("storage", storage);
  return () => { window.removeEventListener(event, notify); window.removeEventListener("storage", storage); };
}
export function setLanguage(language: Lang) {
  fallback = language;
  try { localStorage.setItem(key, language); } catch { /* Keep the choice in memory when browser storage is unavailable. */ }
  window.dispatchEvent(new Event(event));
}
export function useLanguage() {
  const language = useSyncExternalStore(subscribe, snapshot, () => "fr" as Lang);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  return [language, setLanguage] as const;
}
