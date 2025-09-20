// /src/lib/theme.js
import faviconUrl from "@/assets/favicon.ico?url"; // ✅ resolve URL do ícone dentro de src/assets

const KEY = "progem.theme"; // "light" | "dark" | "auto" | "system"

let autoTimer = null;
let visUnsub = null;
let systemUnsub = null;

export const getStoredMode = () => localStorage.getItem(KEY) || "auto";
export const persistMode   = (m) => localStorage.setItem(KEY, m);

export const getSystemPrefersDark = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

// “Auto por horário local”: noite = 18h–05h59
export const computeAutoMode = (d = new Date()) => {
  const h = d.getHours();
  return (h >= 18 || h < 6) ? "dark" : "light";
};

export const resolveIsDark = (mode) => {
  if (mode === "dark")  return true;
  if (mode === "light") return false;
  if (mode === "auto")  return computeAutoMode() === "dark";
  return getSystemPrefersDark(); // system
};

export const applyHtmlDarkClass = (isDark) => {
  const r = document.documentElement;
  isDark ? r.classList.add("dark") : r.classList.remove("dark");
};

export const applyMetaThemeColor = (isDark) => {
  const color = isDark ? "#0b1220" : "#ffffff";
  let m = document.querySelector('meta[name="theme-color"]');
  if (!m) {
    m = document.createElement("meta");
    m.setAttribute("name","theme-color");
    document.head.appendChild(m);
  }
  m.setAttribute("content", color);
};

const applyNow = (mode) => {
  const dark = resolveIsDark(mode);
  applyHtmlDarkClass(dark);
  applyMetaThemeColor(dark);
  applyFavicon(); // usa o import do Vite
};

const stopAutoTimer = () => {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  if (visUnsub) { visUnsub(); visUnsub = null; }
};

const stopSystemWatch = () => {
  if (systemUnsub) { systemUnsub(); systemUnsub = null; }
};

const startAutoTimer = () => {
  stopAutoTimer();
  const tick = () => applyNow("auto");
  tick();
  autoTimer = setInterval(tick, 60 * 1000);
  const onVis = () => { if (!document.hidden) tick(); };
  document.addEventListener("visibilitychange", onVis, { passive: true });
  visUnsub = () => document.removeEventListener("visibilitychange", onVis, { passive: true });
};

const startSystemWatch = () => {
  stopSystemWatch();
  const m = window.matchMedia("(prefers-color-scheme: dark)");
  const h = () => applyNow("system");
  if (m.addEventListener) m.addEventListener("change", h);
  else m.addListener(h);
  systemUnsub = () => {
    if (m.removeEventListener) m.removeEventListener("change", h);
    else m.removeListener(h);
  };
  h();
};

const ensureWatchers = (mode) => {
  stopAutoTimer();
  stopSystemWatch();
  if (mode === "auto")   startAutoTimer();
  if (mode === "system") startSystemWatch();
};

export const setThemeMode = (mode) => {
  persistMode(mode);
  ensureWatchers(mode);
  applyNow(mode);
};

export const initTheme = () => {
  const mode = getStoredMode();
  ensureWatchers(mode);
  applyNow(mode);
};

function applyFavicon(){
  const href = faviconUrl || "/favicon.ico"; // ✅ usa o asset importado; fallback para /public
  let link = document.querySelector('link#favicon[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.id = "favicon";
    link.rel = "icon";
    link.type = "image/x-icon";
    document.head.appendChild(link);
  }
  if (link.href !== href) link.href = href;
}
