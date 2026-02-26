/**
 * NovaScope v2.0 — Utility Functions
 * DOM helpers · number formatting · i18n helpers
 * Nova Team · Hamza Samier · 2026
 */

'use strict';

// ---- Number formatting ----
function formatNum(n) {
  if (n == null || isNaN(n)) return n;
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return n.toString();
}

function parseNum(str) {
  if (!str) return null;
  const s = str.replace(/,/g, "").trim();
  const match = s.match(/^([\d.]+)\s*(billion|million|thousand|b|m|k)?/i);
  if (!match) return null;
  let val = parseFloat(match[1]);
  const unit = (match[2] || "").toLowerCase();
  if (unit === "billion" || unit === "b") val *= 1e9;
  else if (unit === "million" || unit === "m") val *= 1e6;
  else if (unit === "thousand" || unit === "k") val *= 1e3;
  return val;
}

// ---- DOM helpers ----
function el(id) {
  return document.getElementById(id);
}
function qs(sel, ctx = document) {
  return ctx.querySelector(sel);
}
function qsa(sel, ctx = document) {
  return Array.from(ctx.querySelectorAll(sel));
}

function show(elem) {
  if (elem) elem.classList.remove("hidden");
}
function hide(elem) {
  if (elem) elem.classList.add("hidden");
}

function setActiveNav(sectionId) {
  qsa(".topbar-link, .sidebar-link").forEach((a) => {
    if (a.dataset.section === sectionId) a.classList.add("active");
    else a.classList.remove("active");
  });
}

// ---- Throttle / Debounce ----
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// ---- Country flag from URL ----
function getCountryFlag(url) {
  const map = {
    egypt: "🇪🇬",
    "saudi-arabia": "🇸🇦",
    uae: "🇦🇪",
    "united-arab-emirates": "🇦🇪",
    jordan: "🇯🇴",
    kuwait: "🇰🇼",
    qatar: "🇶🇦",
    bahrain: "🇧🇭",
    oman: "🇴🇲",
    morocco: "🇲🇦",
    algeria: "🇩🇿",
    tunisia: "🇹🇳",
    libya: "🇱🇾",
    sudan: "🇸🇩",
    "united-states": "🇺🇸",
    usa: "🇺🇸",
    "united-kingdom": "🇬🇧",
    uk: "🇬🇧",
    france: "🇫🇷",
    germany: "🇩🇪",
    spain: "🇪🇸",
    italy: "🇮🇹",
    india: "🇮🇳",
    china: "🇨🇳",
    japan: "🇯🇵",
    "south-korea": "🇰🇷",
    brazil: "🇧🇷",
    mexico: "🇲🇽",
    argentina: "🇦🇷",
    nigeria: "🇳🇬",
    "south-africa": "🇿🇦",
    kenya: "🇰🇪",
    indonesia: "🇮🇩",
    thailand: "🇹🇭",
    turkey: "🇹🇷",
    russia: "🇷🇺",
    canada: "🇨🇦",
    australia: "🇦🇺",
    global: "🌍",
    "global-overview": "🌍",
    world: "🌍",
    iraq: "🇮🇶",
    lebanon: "🇱🇧",
    yemen: "🇾🇪",
    syria: "🇸🇾",
    pakistan: "🇵🇰",
    bangladesh: "🇧🇩",
    philippines: "🇵🇭",
    malaysia: "🇲🇾",
    vietnam: "🇻🇳",
    "new-zealand": "🇳🇿",
    sweden: "🇸🇪",
    norway: "🇳🇴",
    denmark: "🇩🇰",
    finland: "🇫🇮",
    netherlands: "🇳🇱",
    belgium: "🇧🇪",
    switzerland: "🇨🇭",
    austria: "🇦🇹",
    poland: "🇵🇱",
    ukraine: "🇺🇦",
    romania: "🇷🇴",
    czech: "🇨🇿",
    portugal: "🇵🇹",
    greece: "🇬🇷",
    israel: "🇮🇱",
    iran: "🇮🇷",
    ghana: "🇬🇭",
  };
  const lower = url.toLowerCase();
  for (const [key, flag] of Object.entries(map)) {
    if (lower.includes(key)) return flag;
  }
  return "📊";
}

// ---- Extract report title from URL ----
function extractTitleFromUrl(url) {
  const match = url.match(/reports\/(.+?)\/?$/);
  if (!match) return "Digital Report";
  return match[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---- Animation helpers ----
function animateCounter(el, target, duration = 1200) {
  const start = 0;
  const step = (timestamp) => {
    if (!el._startTime) el._startTime = timestamp;
    const progress = Math.min((timestamp - el._startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatNum(Math.round(start + eased * target));
    if (progress < 1) requestAnimationFrame(step);
    else el._startTime = null;
  };
  requestAnimationFrame(step);
}

// ---- Sanitize HTML ----
function sanitize(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- Intersection Observer for section tracking ----
function initScrollSpy() {
  const sections = qsa("section[id]");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActiveNav(e.target.id);
      });
    },
    { threshold: 0.3, rootMargin: "-60px 0px -60px 0px" },
  );
  sections.forEach((s) => obs.observe(s));
}

// ── isDarkTheme helper (used by export.js) ───────────
function isDarkTheme() {
  return document.documentElement.getAttribute('data-theme') !== 'light';
}
