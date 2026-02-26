/**
 * NovaScope – Data Scraper / Extractor
 * Uses CORS proxies to fetch DataReportal pages and extract statistics.
 * Open Source · Nova Team · 2026
 */

'use strict';

// ---- CORS Proxy list (fallback chain) ----
const PROXY_LIST = [
  url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  url => `https://thingproxy.freeboard.io/fetch/${url}`,
];

async function fetchWithProxy(targetUrl) {
  let lastError;
  for (let i = 0; i < PROXY_LIST.length; i++) {
    const proxyUrl = PROXY_LIST[i](targetUrl);
    try {
      const res = await fetch(proxyUrl, {
        headers: { 'Accept': 'text/html,application/xhtml+xml,application/json,*/*' },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // allorigins.win returns JSON wrapper
      if (proxyUrl.includes('allorigins')) {
        const json = await res.json();
        if (json && json.contents) return json.contents;
        throw new Error('Empty content from allorigins');
      }
      // Others return raw HTML
      const text = await res.text();
      if (text && text.length > 500) return text;
      throw new Error('Response too short');
    } catch (err) {
      console.warn(`[NovaScope] Proxy ${i + 1} failed:`, err.message);
      lastError = err;
    }
  }
  throw new Error(`All proxies failed: ${lastError?.message}`);
}

// ---- Validate DataReportal URL ----
function validateDatareportalUrl(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('datareportal.com')) {
      return { valid: false, error: 'Only DataReportal URLs are supported (datareportal.com).' };
    }
    if (!u.pathname.startsWith('/reports/')) {
      return { valid: false, error: 'URL must be a report page (datareportal.com/reports/...).' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Please enter a valid URL.' };
  }
}

// ---- Main Extraction Engine ----
function extractDataFromHtml(html, sourceUrl) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract all text content
  const bodyText = doc.body?.innerText || doc.body?.textContent || html;

  const result = {
    title: '',
    country: '',
    year: '',
    population: null,
    internetUsers: null,
    internetPenetration: null,
    mobileConnections: null,
    mobilePenetration: null,
    socialMediaUsers: null,
    socialMediaPenetration: null,
    socialMediaGrowth: null,
    urbanPct: null,
    ruralPct: null,
    malePct: null,
    femalePct: null,
    platforms: [],
    highlights: [],
    keywords: [],
    rawSections: {},
    sourceUrl,
    fetchedAt: new Date().toISOString(),
  };

  // --- Title ---
  result.title = (doc.querySelector('h1')?.innerText || doc.querySelector('title')?.innerText || '').trim();
  if (!result.title) result.title = extractTitleFromUrl(sourceUrl);

  // --- Extract year ---
  const yearMatch = sourceUrl.match(/digital-(\d{4})/);
  if (yearMatch) result.year = yearMatch[1];

  // --- Extract country name from title/URL ---
  result.country = result.title
    .replace(/Digital \d{4}[:\s]*/i, '')
    .replace(/DataReportal.*/i, '')
    .trim();

  // ---- Pattern extractors ----

  // Population
  result.population = extractPattern(bodyText, [
    /population\s+(?:of\s+\S+\s+)?(?:stood at|was|reached|of)\s+([\d.,]+\s*(?:million|billion)?)/i,
    /total population.*?([\d.,]+\s*million)/i,
    /([\d.,]+)\s*million\s*(?:people|individuals|residents)/i,
  ]);

  // Internet users
  result.internetUsers = extractPattern(bodyText, [
    /([\d.,]+)\s*million\s*individuals?\s*using\s*the\s*internet/i,
    /internet\s*users?\s+(?:in\s+\S+\s+)?at\s+[\w\s]+?([\d.,]+)\s*million/i,
    /there\s+were\s+([\d.,]+\s*million)\s*(?:people|individuals)?\s*using\s*the\s*internet/i,
    /internet\s+users?[^.]*?([\d.,]+\s*(?:million|billion))/i,
  ]);

  // Internet penetration
  result.internetPenetration = extractPct(bodyText, [
    /internet\s+(?:use\s+)?penetration\s+stood\s+at\s+([\d.]+)\s*percent/i,
    /online\s+penetration\s+(?:stood\s+at\s+)?([\d.]+)\s*percent/i,
    /internet\s+penetration\s*(?:rate\s+)?(?:was\s+|of\s+|=\s+)?([\d.]+)%/i,
    /(?:[\d.,]+\s*million)\s+internet\s+users.*?([\d.]+)\s*percent/i,
  ]);

  // Mobile connections
  result.mobileConnections = extractPattern(bodyText, [
    /([\d.,]+)\s*million\s*(?:cellular\s+)?mobile\s+connections/i,
    /mobile\s+connections\s+(?:were\s+)?(?:active\s+)?(?:at\s+)?([\d.,]+\s*million)/i,
    /([\d.,]+)\s*(?:million\s+)?(?:cellular\s+)?mobile\s+connections\s+were\s+active/i,
  ]);

  // Mobile penetration
  result.mobilePenetration = extractPct(bodyText, [
    /mobile\s+connections\s+(?:were\s+)?equivalent\s+to\s+([\d.]+)\s*percent/i,
    /mobile\s+penetration\s+(?:of\s+|was\s+|at\s+)?([\d.]+)\s*percent/i,
    /mobile\s+connections.*?([\d.]+)%\s+of\s+(?:the\s+)?(?:total\s+)?population/i,
  ]);

  // Social media users
  result.socialMediaUsers = extractPattern(bodyText, [
    /([\d.,]+)\s*million\s*(?:active\s+)?social\s*media\s*users?\s*(?:identities)?/i,
    /social\s*media.*?([\d.,]+)\s*million\s+(?:active\s+)?user/i,
    /there\s+were\s+([\d.,]+\s*million)\s+(?:active\s+)?social\s*media/i,
  ]);

  // Social media penetration
  result.socialMediaPenetration = extractPct(bodyText, [
    /social\s*media.*?equivalent\s+to\s+([\d.]+)\s*percent/i,
    /social\s*media.*?equating\s+to\s+([\d.]+)\s*percent/i,
    /([\d.]+)\s*percent\s+of\s+(?:the\s+)?(?:total\s+)?population.*?social\s*media/i,
    /social\s*media.*?([\d.]+)%\s+of.*?population/i,
  ]);

  // Social media growth
  result.socialMediaGrowth = extractPct(bodyText, [
    /social\s*media\s*users?\s+(?:identities\s+)?(?:in\s+\S+\s+)?increased\s+by\s+[\d.,]+\s*(?:thousand|million)?\s*\(\+([\d.]+)\s*percent\)/i,
    /\+?(\d+\.?\d*)\s*percent\s*\)\s*between.*?social\s*media/i,
    /social\s*media.*?growth.*?\(?\+?([\d.]+)\s*percent\)?/i,
  ]);

  // Urban / Rural
  result.urbanPct = extractPct(bodyText, [
    /([\d.]+)\s*percent\s+of\s+\S+(?:'s)?\s+population\s+lived\s+in\s+urban/i,
    /urban\s+(?:areas?|centres?|population).*?([\d.]+)\s*percent/i,
  ]);
  result.ruralPct = extractPct(bodyText, [
    /([\d.]+)\s*percent\s+(?:lived|living)\s+in\s+rural/i,
    /rural.*?([\d.]+)\s*percent/i,
  ]);

  // Gender
  result.femalePct = extractPct(bodyText, [
    /([\d.]+)\s*percent\s+(?:of\s+\S+(?:'s)?\s+)?(?:total\s+)?population\s+was\s+female/i,
    /female.*?([\d.]+)\s*percent/i,
  ]);
  result.malePct = extractPct(bodyText, [
    /([\d.]+)\s*percent\s+(?:of\s+the\s+)?population\s+was\s+male/i,
    /male.*?([\d.]+)\s*percent/i,
  ]);

  // ---- Platform extraction ----
  result.platforms = extractPlatforms(bodyText);

  // ---- Highlights ----
  result.highlights = extractHighlights(bodyText, result);

  // ---- Keywords ----
  result.keywords = extractKeywords(bodyText, result);

  return result;
}

// ---- Pattern extractors ----
function extractPattern(text, patterns) {
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      const raw = m[1]?.trim();
      if (raw) return raw;
    }
  }
  return null;
}

function extractPct(text, patterns) {
  const raw = extractPattern(text, patterns);
  if (!raw) return null;
  const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? null : n;
}

// ---- Platforms ----
const PLATFORM_DEFS = [
  { name: 'YouTube',    icon: '▶️', color: '#ef4444', key: 'youtube' },
  { name: 'Facebook',   icon: '📘', color: '#1877f2', key: 'facebook' },
  { name: 'Instagram',  icon: '📸', color: '#e1306c', key: 'instagram' },
  { name: 'TikTok',     icon: '🎵', color: '#ff0050', key: 'tiktok' },
  { name: 'LinkedIn',   icon: '💼', color: '#0077b5', key: 'linkedin' },
  { name: 'Snapchat',   icon: '👻', color: '#fffc00', key: 'snapchat' },
  { name: 'X (Twitter)',icon: '𝕏',  color: '#000000', key: 'x' },
  { name: 'Twitter',    icon: '🐦', color: '#1da1f2', key: 'twitter' },
  { name: 'Pinterest',  icon: '📌', color: '#e60023', key: 'pinterest' },
  { name: 'Reddit',     icon: '🤖', color: '#ff4500', key: 'reddit' },
  { name: 'Messenger',  icon: '💬', color: '#0084ff', key: 'messenger' },
  { name: 'WhatsApp',   icon: '📱', color: '#25d366', key: 'whatsapp' },
  { name: 'Threads',    icon: '🧵', color: '#000000', key: 'threads' },
  { name: 'BeReal',     icon: '📷', color: '#1e1e1e', key: 'bereal' },
];

function extractPlatforms(text) {
  const platforms = [];
  for (const pDef of PLATFORM_DEFS) {
    const patterns = [
      new RegExp(`${pDef.key}\\s+(?:ad\\s+reach|users?)[^.]*(\\d+\\.?\\d*)\\s*million`, 'i'),
      new RegExp(`there\\s+were\\s+(\\d+\\.?\\d*)\\s*million[^.]*${pDef.key}`, 'i'),
      new RegExp(`${pDef.key}.*?(?:users?|audience)[^.]*(\\d+\\.?\\d*)\\s*million`, 'i'),
      new RegExp(`(\\d+\\.?\\d*)\\s*million[^.]*${pDef.key}\\s*users?`, 'i'),
      new RegExp(`${pDef.key}[\\s\\S]{0,80}?(\\d+\\.?\\d*)\\s*million\\s*(?:users?|people|identities)`, 'i'),
    ];

    // For X platform, also check 'twitter' legacy pattern
    const keyForSearch = (pDef.key === 'x') ? '(?:x|twitter)' : pDef.key;
    const flexPatterns = [
      new RegExp(`${keyForSearch}[\\s\\S]{0,150}?(\\d+\\.?\\d*)\\s*million`, 'i'),
    ];

    let users = null;
    for (const p of [...patterns, ...flexPatterns]) {
      const m = text.match(p);
      if (m) {
        const val = parseFloat(m[1]);
        if (!isNaN(val) && val > 0.1) {
          users = val;
          break;
        }
      }
    }

    // Extract platform growth %
    const growthPat = new RegExp(
      `${pDef.key}[\\s\\S]{0,500}?(?:increased|grew|growth)[\\s\\S]{0,200}?\\+(\\d+\\.?\\d*)\\s*percent`,
      'i'
    );
    const growthM = text.match(growthPat);
    const growth = growthM ? parseFloat(growthM[1]) : null;

    if (users) {
      // Avoid duplicate Twitter vs X
      if (pDef.key === 'twitter' && platforms.some(p => p.key === 'x')) continue;
      platforms.push({ ...pDef, users, growth });
    }
  }
  return platforms;
}

// ---- Highlights ----
function extractHighlights(text, data) {
  const highlights = [];
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 30 && s.length < 400);

  const keyTerms = [
    { pat: /\d+.*million.*internet/i, icon: '🌐', cat: 'Internet' },
    { pat: /\d+.*million.*social\s*media/i, icon: '📱', cat: 'Social Media' },
    { pat: /\d+.*million.*mobile/i, icon: '📡', cat: 'Mobile' },
    { pat: /internet.*penetration|online.*penetration/i, icon: '📶', cat: 'Internet' },
    { pat: /\d+.*percent.*urban|urban.*\d+.*percent/i, icon: '🏙️', cat: 'Population' },
    { pat: /social\s*media.*increased|increased.*social\s*media/i, icon: '📈', cat: 'Growth' },
    { pat: /mobile.*increased|increased.*mobile/i, icon: '📊', cat: 'Mobile' },
    { pat: /internet.*year.*growth|internet.*grew/i, icon: '📈', cat: 'Internet Growth' },
    { pat: /ad\s*reach|advertising/i, icon: '🎯', cat: 'Advertising' },
    { pat: /download\s*speed|upload\s*speed/i, icon: '⚡', cat: 'Speed' },
    { pat: /time\s+spent|hours\s+per\s+day/i, icon: '⏱️', cat: 'Engagement' },
    { pat: /female.*percent|percent.*female/i, icon: '👥', cat: 'Demographics' },
  ];

  for (const s of sentences) {
    for (const t of keyTerms) {
      if (t.pat.test(s) && highlights.length < 12 && !highlights.some(h => h.text === s)) {
        highlights.push({ text: s.trim(), icon: t.icon, cat: t.cat });
        break;
      }
    }
    if (highlights.length >= 12) break;
  }
  return highlights;
}

// ---- Keywords ----
function extractKeywords(text, data) {
  const candidates = [
    data.population && { word: data.population + ' Population', weight: 5, color: 'purple' },
    data.internetUsers && { word: data.internetUsers + ' Internet Users', weight: 5, color: 'cyan' },
    data.socialMediaUsers && { word: data.socialMediaUsers + ' Social Media', weight: 5, color: 'pink' },
    data.mobileConnections && { word: data.mobileConnections + ' Mobile', weight: 4, color: 'emerald' },
    data.internetPenetration && { word: data.internetPenetration + '% Online', weight: 4, color: 'cyan' },
    data.socialMediaPenetration && { word: data.socialMediaPenetration + '% Social', weight: 4, color: 'pink' },
    data.mobilePenetration && { word: data.mobilePenetration + '% Mobile', weight: 3, color: 'emerald' },
    data.urbanPct && { word: data.urbanPct + '% Urban', weight: 3, color: 'amber' },
    data.ruralPct && { word: data.ruralPct + '% Rural', weight: 3, color: 'amber' },
    data.malePct && { word: data.malePct + '% Male', weight: 2, color: 'purple' },
    data.femalePct && { word: data.femalePct + '% Female', weight: 2, color: 'pink' },
    data.socialMediaGrowth && { word: '+' + data.socialMediaGrowth + '% Growth', weight: 4, color: 'emerald' },
    { word: 'Digital ' + (data.year || '2026'), weight: 3, color: 'purple' },
    { word: data.country || 'Report', weight: 2, color: 'cyan' },
    { word: 'Social Media Trends', weight: 2, color: 'pink' },
    { word: 'Mobile Internet', weight: 2, color: 'emerald' },
    { word: 'Digital Adoption', weight: 2, color: 'amber' },
    { word: 'Internet Growth', weight: 2, color: 'cyan' },
    { word: 'DataReportal', weight: 1, color: 'purple' },
    { word: 'Online Penetration', weight: 1, color: 'cyan' },
    ...data.platforms.map(p => ({
      word: p.name + ' ' + p.users + 'M',
      weight: Math.min(4, Math.ceil(p.users / 10)),
      color: ['purple', 'cyan', 'pink', 'emerald', 'amber'][data.platforms.indexOf(p) % 5],
    })),
  ].filter(Boolean);

  return candidates;
}
