/**
 * NovaScope v2.0 — Main Application Controller
 * Tab navigation · Translation (EN/AR) · Analysis flow · Dashboard
 * Nova Team · Hamza Samier · 2026
 */

'use strict';

// ═══════════════════════════════════════
// I18N — Translations
// ═══════════════════════════════════════
const TRANSLATIONS = {
  en: {
    nav_home: 'Home', nav_dashboard: 'Dashboard', nav_charts: 'Charts', nav_export: 'Export',
    hero_eyebrow: 'Powered by DataReportal · Open Source',
    hero_title: 'Turn Digital Reports Into<br>Visual Intelligence',
    hero_desc: 'Paste any DataReportal report link and get an instant analytics dashboard — charts, KPIs, platform breakdowns, and exportable data.',
    stat_data: 'Data Points', stat_charts: 'Chart Types', stat_exports: 'Export Formats',
    step_analyze: 'ANALYZE A REPORT',
    url_placeholder: 'https://datareportal.com/reports/digital-2026-egypt',
    btn_analyze: 'Analyze',
    examples: 'Examples:',
    loader_title: 'Fetching Report',
    step1: 'Connecting to DataReportal…',
    step2: 'Extracting data points…',
    step3: 'Building visualizations…',
    how_label: 'HOW IT WORKS',
    how1_title: 'Paste a URL',   how1_desc: 'Copy any DataReportal country or global report link.',
    how2_title: 'Extract',       how2_desc: 'NovaScope pulls every statistic, figure, and demographic automatically.',
    how3_title: 'Visualize & Export', how3_desc: 'Explore interactive charts and export selected data as PDF, CSV, or text.',
    report_title: 'Report Dashboard',
    source: 'Source',
    kpi_label: 'KEY METRICS',
    kpi_placeholder: 'Analyze a report to see metrics',
    platform_label: 'PLATFORM BREAKDOWN',
    highlights_label: 'KEY HIGHLIGHTS',
    charts_label: 'INTERACTIVE CHARTS',
    ct_platform: 'Platforms', ct_overview: 'Overview', ct_radar: 'Radar',
    ct_share: 'Share', ct_gender: 'Gender', ct_urban: 'Urban/Rural', ct_growth: 'Growth',
    chart_placeholder: 'Analyze a report to view charts',
    no_chart_data: 'Not enough data for this chart.',
    export_label: 'EXPORT DATA',
    export_placeholder: 'Analyze a report first to select data for export.',
    format_label: 'FORMAT',
    select_label: 'SELECT DATA',
    select_charts: 'INCLUDE CHARTS',
    select_all: 'Select All',
    export_go: 'Export Report',
    export_empty: 'No report analyzed yet.',
    go_analyze: 'Go to Analyzer',
    footer_tagline: 'Social Media Intelligence · Open Source · Free',
    made_by: 'Made by Nova Team',
    next_charts: 'Explore Charts',
    next_export: 'Export Data',
    // KPI labels
    kpi_pop: 'Population',   kpi_internet: 'Internet Users',     kpi_social: 'Social Media Users',
    kpi_mobile: 'Mobile Connections', kpi_inet_pct: 'Internet Penetration',
    kpi_social_pct: 'Social Media Penetration', kpi_mob_pct: 'Mobile Penetration',
    kpi_growth: 'Social Media Growth',
    // KPI sub-label suffixes (i18n)
    sub_penetration: '% penetration',
    sub_population: '% of population',
    sub_yoy: '% YoY',
    unit_million: 'M',   // appended after number for millions
    // Export item labels
    exp_pop: 'Total Population', exp_internet: 'Internet Users', exp_social: 'Social Media Users',
    exp_mobile: 'Mobile Connections', exp_inet_pct: 'Internet Penetration',
    exp_social_pct: 'Social Penetration', exp_growth: 'Social Media Growth',
    exp_urban: 'Urban Population', exp_rural: 'Rural Population',
    exp_male: 'Male Share', exp_female: 'Female Share',
    // Error messages
    err_empty: 'Please enter a DataReportal URL.',
    err_fetch: 'Could not fetch the report. The proxy may be busy — try again in a few seconds.',
  },

  ar: {
    nav_home: 'الرئيسية', nav_dashboard: 'البيانات', nav_charts: 'الرسوم', nav_export: 'التصدير',
    hero_eyebrow: 'مدعوم بـ DataReportal · مفتوح المصدر',
    hero_title: 'حوّل التقارير الرقمية<br>إلى ذكاء بصري',
    hero_desc: 'الصق رابط أي تقرير من DataReportal واحصل فوراً على لوحة تحليل شاملة — رسوم بيانية ومؤشرات وتوزيع المنصات.',
    stat_data: 'نقطة بيانات', stat_charts: 'أنواع الرسوم', stat_exports: 'صيغ التصدير',
    step_analyze: 'تحليل تقرير',
    url_placeholder: 'https://datareportal.com/reports/digital-2026-egypt',
    btn_analyze: 'تحليل',
    examples: 'أمثلة:',
    loader_title: 'جارٍ جلب التقرير',
    step1: 'الاتصال بـ DataReportal…',
    step2: 'استخراج بيانات التقرير…',
    step3: 'إنشاء الرسوم البيانية…',
    how_label: 'كيف يعمل',
    how1_title: 'الصق الرابط',  how1_desc: 'انسخ رابط أي تقرير من DataReportal.',
    how2_title: 'استخراج تلقائي', how2_desc: 'يستخرج NovaScope كل إحصاء ورقم وبيانات ديموغرافية تلقائياً.',
    how3_title: 'تصوير وتصدير',  how3_desc: 'استكشف الرسوم التفاعلية وصدّر بيانات مختارة بصيغة PDF أو CSV أو نص.',
    report_title: 'لوحة التقرير',
    source: 'المصدر',
    kpi_label: 'المؤشرات الرئيسية',
    kpi_placeholder: 'حلّل تقريراً لعرض المؤشرات',
    platform_label: 'توزيع المنصات',
    highlights_label: 'أبرز النتائج',
    charts_label: 'الرسوم التفاعلية',
    ct_platform: 'المنصات', ct_overview: 'نظرة عامة', ct_radar: 'الرادار',
    ct_share: 'الحصص', ct_gender: 'الجنس', ct_urban: 'حضر / ريف', ct_growth: 'النمو',
    chart_placeholder: 'حلّل تقريراً لعرض الرسوم',
    no_chart_data: 'لا توجد بيانات كافية لهذا الرسم.',
    export_label: 'تصدير البيانات',
    export_placeholder: 'حلّل تقريراً أولاً لاختيار بيانات للتصدير.',
    format_label: 'الصيغة',
    select_label: 'اختر البيانات',
    select_charts: 'تضمين الرسوم',
    select_all: 'تحديد الكل',
    export_go: 'تصدير التقرير',
    export_empty: 'لم يتم تحليل أي تقرير بعد.',
    go_analyze: 'اذهب إلى التحليل',
    footer_tagline: 'ذكاء وسائل التواصل · مفتوح المصدر · مجاني',
    made_by: 'صنع بواسطة فريق Nova',
    next_charts: 'استعراض الرسوم',
    next_export: 'تصدير البيانات',
    // KPI labels — Egyptian Arabic
    kpi_pop: 'عدد السكان',      kpi_internet: 'مستخدمو الإنترنت',  kpi_social: 'مستخدمو التواصل',
    kpi_mobile: 'الاتصالات المحمولة', kpi_inet_pct: 'انتشار الإنترنت',
    kpi_social_pct: 'انتشار التواصل', kpi_mob_pct: 'انتشار المحمول',
    kpi_growth: 'نمو التواصل الاجتماعي',
    sub_penetration: '% انتشار',
    sub_population: '% من السكان',
    sub_yoy: '% نمو سنوي',
    unit_million: 'م',   // مليون abbreviation in Arabic context — keep 'M' for clarity, but using م works too
    // Export item labels
    exp_pop: 'إجمالي السكان', exp_internet: 'مستخدمو الإنترنت', exp_social: 'مستخدمو التواصل',
    exp_mobile: 'الاتصالات المحمولة', exp_inet_pct: 'نسبة انتشار الإنترنت',
    exp_social_pct: 'نسبة انتشار التواصل', exp_growth: 'نمو وسائل التواصل',
    exp_urban: 'السكان الحضريون', exp_rural: 'السكان الريفيون',
    exp_male: 'نسبة الذكور', exp_female: 'نسبة الإناث',
    // Error messages
    err_empty: 'من فضلك أدخل رابط DataReportal.',
    err_fetch: 'تعذّر جلب التقرير. قد يكون الخادم مشغولاً — حاول مجدداً بعد لحظات.',
  },
};

let currentLang = 'en';
function t(key) { return TRANSLATIONS[currentLang][key] ?? TRANSLATIONS.en[key] ?? key; }

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    const text = t(key);
    if (elem.tagName === 'INPUT') elem.placeholder = text;
    else elem.innerHTML = text;
  });
  // Update URL input placeholder separately (not data-i18n to avoid edge case)
  const urlInput = el('reportUrl');
  if (urlInput) urlInput.placeholder = t('url_placeholder');

  document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', currentLang);
  // Re-render icons after innerHTML changes may have disturbed them
  setTimeout(() => lucide.createIcons(), 10);
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem('ns_lang', currentLang);

  const label = currentLang === 'en' ? 'عربي' : 'EN';
  // Guard — elements might not exist
  const langLabel = el('langLabel');
  if (langLabel) langLabel.textContent = label;

  applyTranslations();

  // Rebuild dynamic content so labels use new language
  if (currentData) {
    buildKpiCards(currentData);
    buildPlatformList(currentData);
    buildHighlightsList(currentData);
    buildExportPanel(currentData);
  }
}

// ═══════════════════════════════════════
// VALUE FORMATTER  (fixes "121", "29.6,")
// ═══════════════════════════════════════
// Keys where the raw scraper value is in millions
const MILLION_KEYS = new Set(['population','internetUsers','socialMediaUsers','mobileConnections']);

/**
 * Format a raw scraped value to a display string.
 * "119 million" → "119M"   "29.6 million" → "29.6M"
 * "34.4" (for internetUsers) → "34.4M"
 * "29,640,000" → "29.6M"
 * "82.7" (for a pct key) → left as-is (suffix '%' is applied separately)
 */
function formatDataValue(rawVal, key) {
  if (rawVal == null) return null;
  // Clean trailing commas and whitespace
  const str = String(rawVal).trim().replace(/,\s*$/, '');

  // Already has "billion" in string
  if (/billion/i.test(str)) {
    const n = parseFloat(str);
    if (!isNaN(n)) return n >= 1 ? n.toFixed(0) + 'B' : (n * 1000).toFixed(0) + 'M';
    return str;
  }

  // Already has "million" in string → strip it and add M
  if (/million/i.test(str)) {
    const n = parseFloat(str);
    if (!isNaN(n)) return smartM(n);
    return str;
  }

  // Pure numeric (possibly with thousands commas like "29,640,000")
  const n = parseFloat(str.replace(/,/g, ''));
  if (isNaN(n)) return str;

  if (MILLION_KEYS.has(key)) {
    // Heuristic: if value > 500 it's probably raw (thousands) not already in millions
    if (n >= 1_000_000) return smartM(n / 1_000_000);
    if (n >= 1_000)     return smartM(n / 1_000);  // in thousands
    return smartM(n);  // already assumed to be in millions
  }

  return str;
}

function smartM(n) {
  // e.g. 119.0 → "119M", 29.6 → "29.6M", 8.05 → "8.1M"
  const fixed = n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(1);
  return fixed.replace(/\.0$/, '') + 'M';
}

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let currentData = null;
let isLoading   = false;
let activeTab   = 'home';
let activeChartKey = 'platformBar';
const chartKeyList = ['platformBar','overviewDonut','penetrationRadar','platformShare','genderChart','urbanRural','platformGrowth'];

// ═══════════════════════════════════════
// THEME
// ═══════════════════════════════════════
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ns_theme', theme);
  if (currentData && activeTab === 'charts') renderChartInStage(activeChartKey);
}
function toggleTheme() {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

// ═══════════════════════════════════════
// TAB NAVIGATION
// ═══════════════════════════════════════
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const panel = el(`tab-${tab}`);
  if (panel) panel.classList.add('active');

  document.querySelectorAll('.nav-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.bn-item').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.sidebar-nav-item').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab));

  if (tab === 'charts' && currentData) renderChartInStage(activeChartKey);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMobileSidebar();
}

// ═══════════════════════════════════════
// MOBILE SIDEBAR
// ═══════════════════════════════════════
function openMobileSidebar() {
  el('mobSidebar')?.classList.add('open');
  el('mobOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileSidebar() {
  el('mobSidebar')?.classList.remove('open');
  el('mobOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════
// LOADER
// ═══════════════════════════════════════
function showLoader() {
  show(el('loaderPanel'));
  hide(el('resultsCTA'));
  ['loadStep1','loadStep2','loadStep3'].forEach(id => {
    el(id)?.classList.remove('active','done');
    setStepIcon(id, 'circle');
  });
  el('loadStep1')?.classList.add('active');
  setStepIcon('loadStep1', 'loader');
}
function hideLoader() { hide(el('loaderPanel')); }

function setStepIcon(id, iconName) {
  const step = el(id);
  if (!step) return;
  const old = step.querySelector('svg, i[data-lucide]');
  if (old) old.remove();
  const i = document.createElement('i');
  i.setAttribute('data-lucide', iconName);
  step.prepend(i);
  lucide.createIcons({ nodes: [step] });
}

async function advanceStep(n) {
  if (n > 1) {
    const prev = el(`loadStep${n-1}`);
    prev?.classList.remove('active');
    prev?.classList.add('done');
    setStepIcon(`loadStep${n-1}`, 'check-circle');
  }
  el(`loadStep${n}`)?.classList.add('active');
  setStepIcon(`loadStep${n}`, 'loader');
  return new Promise(r => setTimeout(r, 650));
}

function completeSteps() {
  ['loadStep1','loadStep2','loadStep3'].forEach(id => {
    el(id)?.classList.remove('active');
    el(id)?.classList.add('done');
    setStepIcon(id, 'check-circle');
  });
}

// ═══════════════════════════════════════
// ERROR
// ═══════════════════════════════════════
function showError(msg) {
  const box = el('analyzerError');
  const txt = el('analyzerErrorMsg');
  if (txt) txt.textContent = msg;
  show(box);
  lucide.createIcons({ nodes: [box] });
}
function clearError() { hide(el('analyzerError')); }

// ═══════════════════════════════════════
// KPI CARDS
// ═══════════════════════════════════════
// subSuffixKey → i18n lookup; fallback to English literal
const KPI_DEFS = [
  { key:'population',             icon:'users',       color:'--blue',   bg:'--blue-dim',
    labelKey:'kpi_pop',     subSuffixKey: null },
  { key:'internetUsers',          icon:'wifi',        color:'--teal',   bg:'--teal-dim',
    labelKey:'kpi_internet',sub:'internetPenetration',    subSuffixKey:'sub_penetration' },
  { key:'socialMediaUsers',       icon:'share-2',     color:'--purple', bg:'--purple-dim',
    labelKey:'kpi_social',  sub:'socialMediaPenetration', subSuffixKey:'sub_population', growthKey:'socialMediaGrowth' },
  { key:'mobileConnections',      icon:'smartphone',  color:'--green',  bg:'--green-dim',
    labelKey:'kpi_mobile',  sub:'mobilePenetration',      subSuffixKey:'sub_penetration' },
  { key:'internetPenetration',    icon:'globe',       color:'--teal',   bg:'--teal-dim',
    labelKey:'kpi_inet_pct', suffix:'%' },
  { key:'socialMediaPenetration', icon:'radio',       color:'--purple', bg:'--purple-dim',
    labelKey:'kpi_social_pct', suffix:'%' },
  { key:'mobilePenetration',      icon:'signal',      color:'--green',  bg:'--green-dim',
    labelKey:'kpi_mob_pct',    suffix:'%' },
  { key:'socialMediaGrowth',      icon:'trending-up', color:'--orange', bg:'--orange-dim',
    labelKey:'kpi_growth',     suffix:'%', prefix:'+' },
];

function buildKpiCards(data) {
  const grid = el('kpiGrid');
  if (!grid) return;
  grid.innerHTML = '';
  let count = 0;

  for (const def of KPI_DEFS) {
    const rawVal = data[def.key];
    if (rawVal == null) continue;
    count++;

    // Build display value
    let displayVal;
    if (def.suffix) {
      // Percentage / prefixed value — just show raw number + suffix
      const numStr = String(rawVal).trim().replace(/,\s*$/, '');
      const n = parseFloat(numStr);
      displayVal = (def.prefix || '') + (isNaN(n) ? numStr : n) + def.suffix;
    } else {
      // User counts — format with M units
      displayVal = formatDataValue(rawVal, def.key);
    }

    // Build sub-label (e.g. "82.7% penetration")
    let subHtml = '';
    if (def.sub && data[def.sub] != null) {
      const subVal = parseFloat(String(data[def.sub]).replace(/[^0-9.]/g, ''));
      if (!isNaN(subVal)) {
        const suffix = t(def.subSuffixKey || '');
        subHtml = `<div class="kpi-sub">${subVal}${suffix}</div>`;
      }
    }

    // Growth badge
    let growthHtml = '';
    if (def.growthKey && data[def.growthKey] != null) {
      const g = parseFloat(data[def.growthKey]);
      if (!isNaN(g))
        growthHtml = `<div class="kpi-change up"><svg data-lucide="trending-up" width="10" height="10"></svg>+${g}${t('sub_yoy')}</div>`;
    }

    const card = document.createElement('div');
    card.className = 'kpi-card anim-in';
    card.style.animationDelay = (count * 0.04) + 's';
    card.innerHTML = `
      <div class="kpi-icon" style="background:var(${def.bg}); color:var(${def.color})">
        <svg data-lucide="${def.icon}" width="16" height="16"></svg>
      </div>
      <div class="kpi-cat">${t(def.labelKey)}</div>
      <div class="kpi-val">${sanitize(displayVal)}</div>
      ${subHtml}
      ${growthHtml}`;
    grid.appendChild(card);
  }

  if (count === 0) {
    grid.innerHTML = `<div class="kpi-placeholder"><i data-lucide="bar-chart-2"></i><p>${t('kpi_placeholder')}</p></div>`;
  }
  lucide.createIcons({ nodes: [grid] });
}

// ═══════════════════════════════════════
// PLATFORM LIST
// ═══════════════════════════════════════
const PLATFORM_COLORS = [
  '#0a84ff','#bf5af2','#ff375f','#30d158',
  '#ff9f0a','#5ac8fa','#ffd60a','#ff6b6b',
  '#1da1f2','#e1306c',
];

function buildPlatformList(data) {
  const list  = el('platformList');
  const label = el('platformSectionLabel');
  if (!list || !data.platforms?.length) {
    if (label) label.style.display = 'none';
    if (list)  list.innerHTML = '';
    return;
  }
  if (label) label.style.display = '';
  label.setAttribute('data-i18n', 'platform_label');
  label.textContent = t('platform_label');

  const sorted = [...data.platforms].sort((a, b) => b.users - a.users);
  const max    = sorted[0].users;

  list.innerHTML = sorted.map((p, i) => {
    const pct   = Math.round((p.users / max) * 100);
    const color = PLATFORM_COLORS[i % PLATFORM_COLORS.length];
    return `
      <div class="platform-row anim-in" style="animation-delay:${i * 0.04}s">
        <div class="platform-name-cell">
          <div class="platform-dot" style="background:${color}"></div>
          ${sanitize(p.name)}
        </div>
        <div class="platform-bar-wrap">
          <div class="platform-bar-fill" style="width:0; background:${color}" data-width="${pct}"></div>
        </div>
        <div class="platform-val-cell">
          ${p.users}M
          ${p.growth != null ? `<span class="platform-growth">+${p.growth}%</span>` : ''}
        </div>
      </div>`;
  }).join('');

  // Animate bars in on next frame
  requestAnimationFrame(() => {
    list.querySelectorAll('.platform-bar-fill').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 60);
    });
  });
}

// ═══════════════════════════════════════
// HIGHLIGHTS
// ═══════════════════════════════════════
const HL_ICON_MAP = {
  'Internet':        { icon: 'wifi',         bg: '#5ac8fa' },
  'Social Media':    { icon: 'share-2',      bg: '#bf5af2' },
  'Mobile':          { icon: 'smartphone',   bg: '#0a84ff' },
  'Population':      { icon: 'users',        bg: '#30d158' },
  'Demographics':    { icon: 'pie-chart',    bg: '#ff9f0a' },
  'Growth':          { icon: 'trending-up',  bg: '#30d158' },
  'Internet Growth': { icon: 'trending-up',  bg: '#5ac8fa' },
  'Advertising':     { icon: 'target',       bg: '#ff375f' },
  'Speed':           { icon: 'zap',          bg: '#ffd60a' },
  'Engagement':      { icon: 'clock',        bg: '#bf5af2' },
};

function buildHighlightsList(data) {
  const list  = el('highlightsList');
  const label = el('highlightSectionLabel');
  if (!list || !data.highlights?.length) {
    if (label) label.style.display = 'none';
    if (list)  list.innerHTML = '';
    return;
  }
  if (label) { label.style.display = ''; label.textContent = t('highlights_label'); }

  list.innerHTML = data.highlights.slice(0, 10).map((h, i) => {
    const def = HL_ICON_MAP[h.cat] || { icon: 'info', bg: '#0a84ff' };
    return `
      <div class="highlight-row anim-in" style="animation-delay:${i * 0.03}s">
        <div class="hl-icon" style="background:${def.bg}22; color:${def.bg}">
          <svg data-lucide="${def.icon}"></svg>
        </div>
        <div class="hl-body">
          <div class="hl-cat">${sanitize(h.cat)}</div>
          <div class="hl-text">${sanitize(h.text)}</div>
        </div>
      </div>`;
  }).join('');

  lucide.createIcons({ nodes: [list] });
}

// ═══════════════════════════════════════
// REPORT META
// ═══════════════════════════════════════
function setReportMeta(data, url) {
  const flag    = el('reportFlag');
  const titleEl = el('reportTitleEl');
  const subEl   = el('reportSubEl');
  const link    = el('sourceLink');

  if (flag)    flag.textContent = getCountryFlag(url);
  if (titleEl) titleEl.textContent = data.title || extractTitleFromUrl(url);
  if (subEl)   subEl.textContent = `Source: DataReportal · ${new Date().toLocaleDateString()}`;
  if (link)    link.href = url;
}

// ═══════════════════════════════════════
// CHART STAGE
// ═══════════════════════════════════════
function renderChartInStage(chartKey) {
  if (!currentData) return;
  activeChartKey = chartKey;

  document.querySelectorAll('.ct-tab').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.chart === chartKey));

  const idx = chartKeyList.indexOf(chartKey);
  const counter = el('chartCounter');
  if (counter) counter.textContent = `${idx + 1} / ${chartKeyList.length}`;

  const stage = el('chartStage');
  if (!stage) return;

  const def = getSingleChartDef(chartKey, currentData);
  if (!def) {
    stage.innerHTML = `<div class="chart-placeholder"><i data-lucide="bar-chart-2"></i><p>${t('no_chart_data')}</p></div>`;
    lucide.createIcons({ nodes: [stage] });
    return;
  }

  stage.innerHTML = `
    <div class="chart-stage-header">
      <div>
        <div class="chart-title">${sanitize(def.title)}</div>
        <div class="chart-subtitle">${sanitize(def.subtitle)}</div>
      </div>
      <div class="chart-badge">Live</div>
    </div>
    <div class="chart-canvas-wrap">
      <canvas id="stageCanvas" role="img" aria-label="${sanitize(def.title)}"></canvas>
    </div>`;

  const canvas = el('stageCanvas');
  if (canvas) {
    destroyChart('stageCanvas');
    registerChart('stageCanvas', new Chart(canvas, def.config));
  }
  show(el('chartNav'));
}

function navigateChart(dir) {
  const idx  = chartKeyList.indexOf(activeChartKey);
  const next = (idx + dir + chartKeyList.length) % chartKeyList.length;
  renderChartInStage(chartKeyList[next]);
}

// ═══════════════════════════════════════
// EXPORT PANEL
// ═══════════════════════════════════════
const EXPORT_DEFS = [
  { key:'population',            labelKey:'exp_pop',        icon:'users',       color:'#0a84ff', isMillion: true },
  { key:'internetUsers',         labelKey:'exp_internet',   icon:'wifi',        color:'#5ac8fa', isMillion: true },
  { key:'socialMediaUsers',      labelKey:'exp_social',     icon:'share-2',     color:'#bf5af2', isMillion: true },
  { key:'mobileConnections',     labelKey:'exp_mobile',     icon:'smartphone',  color:'#30d158', isMillion: true },
  { key:'internetPenetration',   labelKey:'exp_inet_pct',   icon:'globe',       color:'#5ac8fa', suffix:'%' },
  { key:'socialMediaPenetration',labelKey:'exp_social_pct', icon:'radio',       color:'#bf5af2', suffix:'%' },
  { key:'socialMediaGrowth',     labelKey:'exp_growth',     icon:'trending-up', color:'#30d158', suffix:'%', prefix:'+' },
  { key:'urbanPct',              labelKey:'exp_urban',      icon:'building-2',  color:'#ff9f0a', suffix:'%' },
  { key:'ruralPct',              labelKey:'exp_rural',      icon:'trees',       color:'#30d158', suffix:'%' },
  { key:'malePct',               labelKey:'exp_male',       icon:'user',        color:'#0a84ff', suffix:'%' },
  { key:'femalePct',             labelKey:'exp_female',     icon:'user',        color:'#ff375f', suffix:'%' },
];

function buildExportPanel(data) {
  if (!data) return;
  hide(el('exportEmpty'));
  hide(el('exportIntro'));
  show(el('exportReady'));

  // Data items
  const items = el('exportItems');
  if (!items) return;
  items.innerHTML = '';

  EXPORT_DEFS.forEach(def => {
    const rawVal = data[def.key];
    if (rawVal == null) return;

    let displayVal;
    if (def.isMillion) displayVal = formatDataValue(rawVal, def.key);
    else displayVal = (def.prefix || '') + rawVal + (def.suffix || '');

    const row = document.createElement('div');
    row.className = 'export-item';
    row.dataset.key   = def.key;
    row.dataset.label = t(def.labelKey);
    row.dataset.value = displayVal;
    row.innerHTML = `
      <div class="export-checkbox checked"><svg data-lucide="check" width="12" height="12"></svg></div>
      <div class="export-item-icon" style="background:${def.color}20; color:${def.color}">
        <svg data-lucide="${def.icon}" width="14" height="14"></svg>
      </div>
      <span class="export-item-label">${t(def.labelKey)}</span>
      <span class="export-item-value">${sanitize(displayVal)}</span>`;
    row.addEventListener('click', () => toggleExportItem(row));
    items.appendChild(row);
  });

  // Platform rows
  data.platforms?.forEach(p => {
    const row = document.createElement('div');
    row.className = 'export-item';
    row.dataset.key   = `platform_${p.key}`;
    row.dataset.label = p.name + ' Users';
    row.dataset.value = p.users + 'M';
    row.innerHTML = `
      <div class="export-checkbox checked"><svg data-lucide="check" width="12" height="12"></svg></div>
      <div class="export-item-icon" style="background:#0a84ff20; color:#0a84ff">
        <svg data-lucide="bar-chart-2" width="14" height="14"></svg>
      </div>
      <span class="export-item-label">${sanitize(p.name)}</span>
      <span class="export-item-value">${p.users}M</span>`;
    row.addEventListener('click', () => toggleExportItem(row));
    items.appendChild(row);
  });

  // Chart picks
  const picks = el('exportChartPicks');
  if (picks) {
    picks.innerHTML = '';
    const chartNames = {
      platformBar: t('ct_platform'), overviewDonut: t('ct_overview'),
      penetrationRadar: t('ct_radar'), platformShare: t('ct_share'),
      genderChart: t('ct_gender'), urbanRural: t('ct_urban'), platformGrowth: t('ct_growth'),
    };
    chartKeyList.forEach(ck => {
      const btn = document.createElement('button');
      btn.className = 'chart-pick selected';
      btn.dataset.chart = ck;
      btn.innerHTML = `<svg data-lucide="bar-chart-2" width="12" height="12"></svg> ${chartNames[ck]}`;
      btn.addEventListener('click', () => btn.classList.toggle('selected'));
      picks.appendChild(btn);
    });
  }

  lucide.createIcons({ nodes: [el('exportReady')] });
}

function toggleExportItem(row) {
  const cb = row.querySelector('.export-checkbox');
  const wasChecked = cb.classList.contains('checked');
  cb.classList.toggle('checked', !wasChecked);
  cb.innerHTML = !wasChecked ? '<svg data-lucide="check" width="12" height="12" stroke-width="3"></svg>' : '';
  lucide.createIcons({ nodes: [cb] });
}

function selectAllExportItems(all) {
  document.querySelectorAll('.export-item').forEach(row => {
    const cb = row.querySelector('.export-checkbox');
    cb.classList.toggle('checked', all);
    cb.innerHTML = all ? '<svg data-lucide="check" width="12" height="12" stroke-width="3"></svg>' : '';
  });
  document.querySelectorAll('.chart-pick').forEach(p => p.classList.toggle('selected', all));
  lucide.createIcons({ nodes: [el('exportItems'), el('exportChartPicks')].filter(Boolean) });
}

function getSelectedExportData() {
  return Array.from(document.querySelectorAll('.export-item'))
    .filter(r => r.querySelector('.export-checkbox.checked'))
    .map(r => ({ label: r.dataset.label, value: r.dataset.value }));
}
function getSelectedCharts() {
  return Array.from(document.querySelectorAll('.chart-pick.selected')).map(p => p.dataset.chart);
}
function getSelectedFormat() {
  const pill = document.querySelector('.format-pill.active');
  return pill ? pill.dataset.format : 'pdf';
}

// ═══════════════════════════════════════
// NEXT STEPS CTA (shown after analysis)
// ═══════════════════════════════════════
function showNextStrips() {
  const ds = el('dashNextStrip');
  const cs = el('chartsNextStrip');
  if (ds) { show(ds); lucide.createIcons({ nodes: [ds] }); }
  if (cs) { show(cs); lucide.createIcons({ nodes: [cs] }); }
}

// ═══════════════════════════════════════
// MAIN ANALYZE FLOW
// ═══════════════════════════════════════
async function analyze(url) {
  if (isLoading) return;
  clearError();
  hide(el('dashNextStrip'));
  hide(el('chartsNextStrip'));

  const validation = validateDatareportalUrl(url.trim());
  if (!validation.valid) { showError(validation.error); return; }

  isLoading = true;
  const btn = el('analyzeBtn');
  if (btn) btn.disabled = true;
  showLoader();

  try {
    await advanceStep(1);
    const html = await fetchWithProxy(url.trim());

    await advanceStep(2);
    const data = extractDataFromHtml(html, url.trim());
    currentData = data;

    await advanceStep(3);

    setReportMeta(data, url.trim());
    buildKpiCards(data);
    buildPlatformList(data);
    buildHighlightsList(data);
    buildExportPanel(data);

    completeSteps();

    setTimeout(() => {
      hideLoader();
      switchTab('dashboard');
      showNextStrips();
    }, 400);

  } catch (err) {
    console.error('[NovaScope]', err);
    hideLoader();
    showError(t('err_fetch'));
  } finally {
    isLoading = false;
    if (btn) btn.disabled = false;
  }
}

// ═══════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════
function initEvents() {
  // Theme (header only — sidebar controls removed)
  el('themeToggle')?.addEventListener('click', toggleTheme);

  // Language
  el('langToggle')?.addEventListener('click', toggleLanguage);

  // Mobile sidebar
  el('mobileMenuBtn')?.addEventListener('click', openMobileSidebar);
  el('mobSidebarClose')?.addEventListener('click', closeMobileSidebar);
  el('mobOverlay')?.addEventListener('click', closeMobileSidebar);

  // All [data-tab] buttons (header nav, bottom nav, sidebar, next-strips)
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Analyze button + Enter key
  el('analyzeBtn')?.addEventListener('click', () => {
    const url = el('reportUrl')?.value?.trim();
    if (url) analyze(url);
    else showError(t('err_empty'));
  });
  el('reportUrl')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const url = el('reportUrl')?.value?.trim();
      if (url) analyze(url);
    }
  });

  // Live URL validation
  el('reportUrl')?.addEventListener('input', debounce(() => {
    const val = el('reportUrl').value.trim();
    if (!val) { clearError(); return; }
    const v = validateDatareportalUrl(val);
    if (!v.valid) showError(v.error); else clearError();
  }, 500));

  // Example chips
  document.querySelectorAll('.chip[data-url]').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = el('reportUrl');
      if (input) input.value = chip.dataset.url;
      clearError();
      // If not on home tab, switch home so user can see the filled URL
      if (activeTab !== 'home') switchTab('home');
      el('analyzerSection')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Chart selector tabs
  document.querySelectorAll('.ct-tab').forEach(btn => {
    btn.addEventListener('click', () => renderChartInStage(btn.dataset.chart));
  });

  // Chart prev/next arrows
  el('chartPrev')?.addEventListener('click', () => navigateChart(-1));
  el('chartNext')?.addEventListener('click', () => navigateChart(1));

  // Export format pills
  document.querySelectorAll('.format-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.format-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Select all toggle
  let allSel = true;
  el('selectAllBtn')?.addEventListener('click', () => {
    allSel = !allSel;
    selectAllExportItems(allSel);
  });

  // Export go
  el('exportGoBtn')?.addEventListener('click', () => {
    if (!currentData) return;
    const format = getSelectedFormat();
    const data   = getSelectedExportData();
    const charts = getSelectedCharts();
    if (format === 'pdf')      exportPDF(currentData, data, charts);
    else if (format === 'csv') exportCSV(currentData, data);
    else                       exportTXT(currentData, data);
  });
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Restore theme
  const savedTheme = localStorage.getItem('ns_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Restore language
  currentLang = localStorage.getItem('ns_lang') || 'en';
  applyTranslations();
  // Update toggle label
  const langLabel = el('langLabel');
  if (langLabel) langLabel.textContent = currentLang === 'en' ? 'عربي' : 'EN';

  initEvents();
  lucide.createIcons();

  // URL param auto-analyze
  const params = new URLSearchParams(window.location.search);
  const urlParam = params.get('url');
  if (urlParam?.includes('datareportal.com')) {
    const input = el('reportUrl');
    if (input) input.value = urlParam;
    setTimeout(() => analyze(urlParam), 700);
  }

  console.log(
    '%c NovaScope v2.0 %c · Hamza Samier · Nova Team ',
    'background:#0a84ff;color:#fff;font-weight:700;padding:2px 8px;border-radius:4px 0 0 4px',
    'background:#1c1c1e;color:#aaa;padding:2px 8px;border-radius:0 4px 4px 0'
  );
});
