import fs from 'node:fs';
const path='app/page.tsx';
let source=fs.readFileSync(path,'utf8');
function replace(before,after,label){if(!source.includes(before))throw new Error(`Expected ${label} fragment not found`);source=source.replace(before,after);}

replace(`    [journal, setJournal] = useState<\n      { id: number; text: string; date: string }[]\n    >([]);`,`    [journal, setJournal] = useState<\n      { id: string; text: string; assetKey: string | null; createdAt: number }[]\n    >([]);`,'journal state');

const loadEffect=`  useEffect(() => {\n    const controller = new AbortController();\n    fetch("/api/user-sync/decision-notes", { cache: "no-store", signal: controller.signal })\n      .then(async (response) => {\n        if (response.status === 401) return { notes: [] };\n        if (!response.ok) throw new Error("journal_load_failed");\n        return response.json();\n      })\n      .then((payload) =>\n        setJournal(\n          Array.isArray(payload?.notes)\n            ? payload.notes.map((item) => ({\n                id: String(item.id),\n                text: String(item.text || ""),\n                assetKey: item.assetKey == null ? null : String(item.assetKey),\n                createdAt: Number(item.createdAt || 0),\n              }))\n            : [],\n        ),\n      )\n      .catch((error) => {\n        if (error?.name !== "AbortError") setJournal([]);\n      });\n    return () => controller.abort();\n  }, []);\n`;
replace(`  useEffect(() => {\n    try {\n      const a = localStorage.getItem("cockpit-alerts-v1"),`,loadEffect+`  useEffect(() => {\n    try {\n      const a = localStorage.getItem("cockpit-alerts-v1"),`,'journal load insertion');
replace(`        j = localStorage.getItem("cockpit-journal-v1"),\n        p = localStorage.getItem("cockpit-profile-v1"),`,`        p = localStorage.getItem("cockpit-profile-v1"),`,'local journal read');
replace(`      if (j) setJournal(JSON.parse(j));\n`,``,'local journal hydration');
replace(`    localStorage.setItem("cockpit-journal-v1", JSON.stringify(journal));\n`,``,'local journal write');
replace(`  }, [alerts, journal, profile, passports, decisionEvents, storageReady]);`,`  }, [alerts, profile, passports, decisionEvents, storageReady]);`,'local storage dependencies');

replace(`  const addNote = () => {\n    if (!note.trim()) return;\n    setJournal((j) => [\n      {\n        id: Date.now(),\n        text: note.trim(),\n        date: new Date().toLocaleString(locale),\n      },\n      ...j,\n    ]);\n    setNote("");\n  };`,`  const addNote = async () => {\n    const text = note.trim();\n    if (!text) return;\n    try {\n      const response = await fetch("/api/user-sync/decision-notes", {\n        method: "POST",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({ assetKey: active.key, text }),\n      });\n      if (!response.ok) throw new Error("journal_save_failed");\n      const payload = await response.json();\n      const saved = payload?.note;\n      if (!saved) throw new Error("journal_save_failed");\n      setJournal((items) => [{\n        id: String(saved.id),\n        text: String(saved.text || text),\n        assetKey: saved.assetKey == null ? active.key : String(saved.assetKey),\n        createdAt: Number(saved.createdAt || Date.now()),\n      }, ...items]);\n      setNote("");\n    } catch {\n      // Keep the draft visible so the user can retry without losing text.\n    }\n  };\n  const removeJournalNote = async (id: string) => {\n    const previous = journal;\n    setJournal((items) => items.filter((item) => item.id !== id));\n    try {\n      const response = await fetch(`/api/user-sync/decision-notes?id=${encodeURIComponent(id)}`, { method: "DELETE" });\n      if (!response.ok) throw new Error("journal_delete_failed");\n    } catch {\n      setJournal(previous);\n    }\n  };`,'add note');

replace(`<span>\n                  Notez votre raisonnement avant d’agir pour garder une méthode\n                  disciplinée.\n                </span>`,`<span>\n                  Notez votre raisonnement avant d’agir. Le journal est synchronisé avec votre compte Web et Flutter.\n                </span>`,'journal copy');
replace(`<small>{j.date}</small>`,`<small>{new Date(j.createdAt).toLocaleString(locale)}{j.assetKey ? ` · ${j.assetKey}` : ""}</small>`,'journal date');
replace(`                      onClick={() =>\n                        setJournal((x) => x.filter((v) => v.id !== j.id))\n                      }`,`                      onClick={() => void removeJournalNote(j.id)}`,'journal delete');

if(source.includes('cockpit-journal-v1'))throw new Error('Local journal storage remains');
if(!source.includes('/api/user-sync/decision-notes'))throw new Error('Decision notes API not wired');
fs.writeFileSync(path,source);
console.log('Decision journal now uses durable Neon APIs.');
// one-shot trigger marker
