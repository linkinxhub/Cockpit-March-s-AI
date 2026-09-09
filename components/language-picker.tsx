"use client";
import type { Lang } from "@/lib/i18n";
import "./language-picker.css";
const languages = [
  { code: "fr", name: "Français" }, { code: "en", name: "English" },
  { code: "de", name: "Deutsch" }, { code: "nl", name: "Nederlands" },
] as const;
export function LanguagePicker({language, onChange}: {language: Lang; onChange: (language: Lang) => void}) {
  return <div className="locale-picker" role="group" aria-label="Français / English / Deutsch / Nederlands" translate="no">
    {languages.map(({code,name}) => <button type="button" key={code} lang={code} title={name} aria-label={name} aria-pressed={language===code} onClick={()=>onChange(code)}>
      <svg viewBox="0 0 24 16" aria-hidden="true" className="locale-flag">
        {code==="fr" ? <><path fill="#fff" d="M0 0h24v16H0z"/><path fill="#2443a7" d="M0 0h8v16H0z"/><path fill="#e14750" d="M16 0h8v16h-8z"/></> : code==="de" ? <><path fill="#151515" d="M0 0h24v16H0z"/><path fill="#d4383c" d="M0 5.33h24v10.67H0z"/><path fill="#f5c844" d="M0 10.67h24V16H0z"/></> : code==="nl" ? <><path fill="#2443a7" d="M0 0h24v16H0z"/><path fill="#fff" d="M0 0h24v10.67H0z"/><path fill="#d4383c" d="M0 0h24v5.33H0z"/></> : <><path fill="#233778" d="M0 0h24v16H0z"/><path d="m0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="4"/><path d="m0 0 24 16M24 0 0 16" stroke="#d4383c" strokeWidth="1.5"/><path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="6"/><path d="M12 0v16M0 8h24" stroke="#d4383c" strokeWidth="3"/></>}
      </svg><span>{code.toUpperCase()}</span>
    </button>)}
  </div>;
}
