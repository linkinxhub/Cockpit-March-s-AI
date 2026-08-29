import fs from 'node:fs';

const path='app/page.tsx';
let source=fs.readFileSync(path,'utf8');

const oldEffects=`  useEffect(() => {\n    try {\n      const saved = localStorage.getItem("cockpit-favorites");\n      setFavorites(saved ? JSON.parse(saved) : []);\n    } catch {\n    } finally {\n      setFavoritesReady(true);\n    }\n  }, []);\n  useEffect(() => {\n    if (favoritesReady)\n      localStorage.setItem("cockpit-favorites", JSON.stringify(favorites));\n  }, [favorites, favoritesReady]);`;

const newEffects=`  useEffect(() => {\n    const controller = new AbortController();\n    fetch("/api/user-sync/snapshot", { cache: "no-store", signal: controller.signal })\n      .then(async (response) => {\n        if (response.status === 401) return { watchlist: [] };\n        if (!response.ok) throw new Error("watchlist_load_failed");\n        return response.json();\n      })\n      .then((snapshot) =>\n        setFavorites(Array.isArray(snapshot?.watchlist) ? snapshot.watchlist : []),\n      )\n      .catch((error) => {\n        if (error?.name !== "AbortError") setFavorites([]);\n      })\n      .finally(() => {\n        if (!controller.signal.aborted) setFavoritesReady(true);\n      });\n    return () => controller.abort();\n  }, []);`;

const oldToggle=`  const toggleFavorite = (key: string) =>\n    setFavorites((f) =>\n      f.includes(key) ? f.filter((x) => x !== key) : [...f, key],\n    );`;

const newToggle=`  const toggleFavorite = async (key: string) => {\n    if (!favoritesReady) return;\n    const previous = favorites;\n    const next = previous.includes(key)\n      ? previous.filter((item) => item !== key)\n      : [...previous, key];\n    setFavorites(next);\n    try {\n      const response = await fetch("/api/user-sync/watchlist", {\n        method: "PUT",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({ assetKeys: next }),\n      });\n      if (!response.ok) throw new Error("watchlist_save_failed");\n      const payload = await response.json();\n      setFavorites(Array.isArray(payload?.watchlist) ? payload.watchlist : next);\n    } catch {\n      setFavorites(previous);\n    }\n  };`;

const oldCopy='Vos favoris sont conservés sur cet appareil. Cliquez sur';
const newCopy='Vos favoris sont synchronisés avec votre compte Web et Flutter. Cliquez sur';

for (const [before, after, label] of [
  [oldEffects,newEffects,'effects'],
  [oldToggle,newToggle,'toggle'],
  [oldCopy,newCopy,'copy'],
]) {
  if (!source.includes(before)) throw new Error(`Expected ${label} fragment not found; refusing to patch`);
  source=source.replace(before,after);
}

if (source.includes('localStorage.getItem("cockpit-favorites")') || source.includes('localStorage.setItem("cockpit-favorites"')) {
  throw new Error('Local-only favorites storage remains after patch');
}

fs.writeFileSync(path,source);
console.log('Main cockpit favorites now use shared Neon watchlist APIs.');
