/**
 * NovaScope v2.0 — Chart Builder
 * Individual chart definitions + touch-friendly rendering
 * Nova Team · Hamza Samier · 2026
 */

'use strict';

// ─── Instance registry ───────────────────────────────
const _chartInstances = {};
function destroyChart(id) {
  if (_chartInstances[id]) { _chartInstances[id].destroy(); delete _chartInstances[id]; }
}
function registerChart(id, inst) { _chartInstances[id] = inst; }

// ─── Theme-aware defaults ────────────────────────────
function chartDefaults(dark) {
  return {
    font:   { family: "'Inter', 'Helvetica Neue', sans-serif", size: 11 },
    color:  dark ? 'rgba(255,255,255,0.5)'  : 'rgba(0,0,0,0.45)',
    grid:   dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    tick:   dark ? 'rgba(255,255,255,0.3)'  : 'rgba(0,0,0,0.30)',
    tip: {
      bg:     dark ? '#1c1c1e' : '#ffffff',
      title:  dark ? '#ffffff' : '#000000',
      body:   dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
      border: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    },
  };
}

// ─── Common scale options ────────────────────────────
function mkScales(d, axisX = '', axisY = '') {
  return {
    x: {
      grid: { color: d.grid, drawBorder: false },
      ticks: { color: d.tick, font: { family: d.font.family, size: 10 }, maxRotation: 30 },
      ...(axisX ? { title: { display: true, text: axisX, color: d.tick, font: { size: 10 } } } : {}),
    },
    y: {
      grid: { color: d.grid, drawBorder: false },
      ticks: { color: d.tick, font: { family: d.font.family, size: 10 } },
      ...(axisY ? { title: { display: true, text: axisY, color: d.tick, font: { size: 10 } } } : {}),
    },
  };
}

// ─── Common tooltip ─────────────────────────────────
function mkTooltip(d) {
  return {
    backgroundColor: d.tip.bg,
    titleColor:      d.tip.title,
    bodyColor:       d.tip.body,
    borderColor:     d.tip.border,
    borderWidth: 1,
    padding:     12,
    cornerRadius: 10,
    titleFont: { family: d.font.family, weight: '600', size: 12 },
    bodyFont:  { family: d.font.family, size: 11 },
    displayColors: true,
    boxPadding: 4,
  };
}

// ─── Platform color palette ──────────────────────────
const PALETTE = [
  { solid: '#0a84ff', dim: '#0a84ff33' },
  { solid: '#bf5af2', dim: '#bf5af233' },
  { solid: '#ff375f', dim: '#ff375f33' },
  { solid: '#30d158', dim: '#30d15833' },
  { solid: '#ff9f0a', dim: '#ff9f0a33' },
  { solid: '#5ac8fa', dim: '#5ac8fa33' },
  { solid: '#ffd60a', dim: '#ffd60a33' },
  { solid: '#64d2ff', dim: '#64d2ff33' },
];
// legacy alias
const COLOR_LIST = PALETTE.map(c => ({ solid: c.solid, bg: c.dim, border: c.solid }));
const CHART_COLORS = {
  purple: COLOR_LIST[1], cyan: COLOR_LIST[5], pink: COLOR_LIST[2],
  emerald: COLOR_LIST[3], amber: COLOR_LIST[4], red: COLOR_LIST[2],
  blue: COLOR_LIST[0], violet: COLOR_LIST[1],
};

// ════════════════════════════════════════════════════
// CHART DEFINITIONS (return def objects, not rendered)
// ════════════════════════════════════════════════════

// ─── 1 · Platform bar (horizontal) ──────────────────
function buildPlatformBarChart(data, dark) {
  const d = chartDefaults(dark);
  const sorted = [...data.platforms].sort((a, b) => b.users - a.users).slice(0, 10);
  const colors = sorted.map((_, i) => PALETTE[i % PALETTE.length].solid);

  return {
    id: 'platformBar',
    title: 'Platform Users',
    subtitle: 'Active users by platform (millions)',
    config: {
      type: 'bar',
      data: {
        labels: sorted.map(p => p.name),
        datasets: [{
          label: 'Users (M)',
          data: sorted.map(p => p.users),
          backgroundColor: colors.map(c => c + 'bb'),
          borderColor: colors,
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { ...mkTooltip(d), callbacks: { label: ctx => ` ${ctx.parsed.x.toFixed(1)}M users` } },
        },
        scales: {
          x: {
            grid: { color: d.grid, drawBorder: false },
            ticks: { color: d.tick, font: { family: d.font.family, size: 10 }, callback: v => v + 'M' },
          },
          y: {
            grid: { display: false },
            ticks: { color: d.color, font: { family: d.font.family, size: 11, weight: '500' } },
          },
        },
        animation: { duration: 600, easing: 'easeOutQuart' },
      },
    },
  };
}

// ─── 2 · Overview doughnut ──────────────────────────
function buildOverviewDonut(data, dark) {
  const d = chartDefaults(dark);
  const items = [];
  if (data.population)        items.push({ label: 'Population',    val: parseNum(data.population)||0,      color: PALETTE[0].solid });
  if (data.internetUsers)     items.push({ label: 'Internet Users', val: parseNum(data.internetUsers)||0,   color: PALETTE[5].solid });
  if (data.socialMediaUsers)  items.push({ label: 'Social Media',   val: parseNum(data.socialMediaUsers)||0,color: PALETTE[1].solid });
  if (data.mobileConnections) items.push({ label: 'Mobile',         val: parseNum(data.mobileConnections)||0,color: PALETTE[3].solid });
  if (items.length < 2) return null;

  return {
    id: 'overviewDonut',
    title: 'Digital Overview',
    subtitle: 'Population vs connected users',
    config: {
      type: 'doughnut',
      data: {
        labels: items.map(i => i.label),
        datasets: [{ data: items.map(i => i.val/1e6), backgroundColor: items.map(i => i.color+'bb'),
          borderColor: items.map(i => i.color), borderWidth: 2, hoverOffset: 10 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '62%',
        plugins: {
          legend: { position: 'bottom', labels: { color: d.color, font: { family: d.font.family, size: 11 }, boxWidth: 10, padding: 12 } },
          tooltip: { ...mkTooltip(d), callbacks: { label: ctx => ` ${ctx.parsed.toFixed(1)}M` } },
        },
        animation: { duration: 700, easing: 'easeOutQuart' },
      },
    },
  };
}

// ─── 3 · Gender pie ─────────────────────────────────
function buildGenderChart(data, dark) {
  const d = chartDefaults(dark);
  if (!data.malePct || !data.femalePct) return null;
  return {
    id: 'genderChart',
    title: 'Gender Distribution',
    subtitle: 'Male vs Female (%)',
    config: {
      type: 'pie',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{ data: [data.malePct, data.femalePct],
          backgroundColor: [PALETTE[0].solid+'bb', PALETTE[2].solid+'bb'],
          borderColor: [PALETTE[0].solid, PALETTE[2].solid],
          borderWidth: 2, hoverOffset: 10 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: d.color, font: { family: d.font.family, size: 11 }, boxWidth: 10, padding: 10 } },
          tooltip: { ...mkTooltip(d), callbacks: { label: ctx => ` ${ctx.parsed.toFixed(1)}%` } },
        },
        animation: { duration: 600 },
      },
    },
  };
}

// ─── 4 · Urban / Rural doughnut ─────────────────────
function buildUrbanRuralChart(data, dark) {
  const d = chartDefaults(dark);
  if (!data.urbanPct || !data.ruralPct) return null;
  return {
    id: 'urbanRural',
    title: 'Urban vs Rural',
    subtitle: 'Population distribution by area (%)',
    config: {
      type: 'doughnut',
      data: {
        labels: ['Urban', 'Rural'],
        datasets: [{ data: [data.urbanPct, data.ruralPct],
          backgroundColor: [PALETTE[1].solid+'bb', PALETTE[4].solid+'bb'],
          borderColor: [PALETTE[1].solid, PALETTE[4].solid],
          borderWidth: 2, hoverOffset: 10 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '55%',
        plugins: {
          legend: { position: 'bottom', labels: { color: d.color, font: { family: d.font.family, size: 11 }, boxWidth: 10, padding: 10 } },
          tooltip: { ...mkTooltip(d), callbacks: { label: ctx => ` ${ctx.parsed.toFixed(1)}%` } },
        },
      },
    },
  };
}

// ─── 5 · Platform growth bar ────────────────────────
function buildPlatformGrowthChart(data, dark) {
  const d = chartDefaults(dark);
  const withG = data.platforms.filter(p => p.growth != null).slice(0, 8);
  if (withG.length < 2) return null;
  const colors = withG.map((_, i) => PALETTE[i % PALETTE.length].solid);
  return {
    id: 'platformGrowth',
    title: 'Platform Growth',
    subtitle: 'Year-on-year change (%)',
    config: {
      type: 'bar',
      data: {
        labels: withG.map(p => p.name),
        datasets: [{ label: 'Growth %', data: withG.map(p => p.growth),
          backgroundColor: colors.map(c => c + 'aa'), borderColor: colors,
          borderWidth: 1.5, borderRadius: 6, borderSkipped: false }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...mkTooltip(d), callbacks: { label: ctx => ` +${ctx.parsed.y.toFixed(1)}%` } },
        },
        scales: mkScales(d, '', '% YoY'),
        animation: { duration: 600, easing: 'easeOutQuart' },
      },
    },
  };
}

// ─── 6 · Penetration radar ──────────────────────────
function buildPenetrationRadar(data, dark) {
  const d = chartDefaults(dark);
  const items = [];
  const addItem = (label, rawVal) => {
    const v = parseFloat(rawVal);
    if (!isNaN(v) && v > 0 && v <= 100) items.push({ label, val: v });
  };
  addItem('Internet',    data.internetPenetration);
  addItem('Social',      data.socialMediaPenetration);
  addItem('Urban',       data.urbanPct);
  // Cap mobile at 100 (can exceed 100% when connections > population)
  if (data.mobilePenetration) {
    const m = Math.min(parseFloat(data.mobilePenetration) || 0, 100);
    if (m > 0) items.push({ label: 'Mobile', val: m });
  }
  if (items.length < 3) return null;

  return {
    id: 'penetrationRadar',
    title: 'Penetration Radar',
    subtitle: 'Key metrics as % of population',
    config: {
      type: 'radar',
      data: {
        labels: items.map(i => i.label),
        datasets: [{
          label: '% of Population',
          data: items.map(i => i.val),
          backgroundColor: 'rgba(10,132,255,0.14)',
          borderColor: '#0a84ff',
          pointBackgroundColor: '#0a84ff',
          pointBorderColor: dark ? '#1c1c1e' : '#fff',
          borderWidth: 2, pointRadius: 5,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...mkTooltip(d), callbacks: { label: ctx => ` ${ctx.parsed.r.toFixed(1)}%` } },
        },
        scales: {
          r: {
            angleLines: { color: d.grid },
            grid: { color: d.grid },
            pointLabels: { color: d.color, font: { family: d.font.family, size: 12, weight: '600' } },
            ticks: { color: d.tick, backdropColor: 'transparent', font: { size: 9 }, callback: v => v + '%', stepSize: 25 },
            min: 0, max: 100,
          },
        },
      },
    },
  };
}

// ─── 7 · Platform polar area ────────────────────────
function buildPlatformShareChart(data, dark) {
  const d = chartDefaults(dark);
  const top = data.platforms.slice(0, 7);
  if (!top.length) return null;
  const colors = top.map((_, i) => PALETTE[i % PALETTE.length].solid);
  return {
    id: 'platformShare',
    title: 'Platform Market Share',
    subtitle: 'Proportional user distribution',
    config: {
      type: 'polarArea',
      data: {
        labels: top.map(p => p.name),
        datasets: [{ data: top.map(p => p.users),
          backgroundColor: colors.map(c => c + 'a8'),
          borderColor: colors, borderWidth: 1.5 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right',
            labels: { color: d.color, font: { family: d.font.family, size: 10 }, boxWidth: 10, padding: 8 }
          },
          tooltip: { ...mkTooltip(d), callbacks: { label: ctx => ` ${ctx.parsed.r.toFixed(1)}M users` } },
        },
        scales: { r: { grid: { color: d.grid }, ticks: { color: d.tick, backdropColor: 'transparent', font: { size: 9 } } } },
        animation: { duration: 700 },
      },
    },
  };
}

// ─── Rebuild on theme change ─────────────────────────
function rebuildChartsOnTheme(data) {
  if (!data || typeof renderChartInStage !== 'function') return;
  renderChartInStage(activeChartKey || 'platformBar');
}

// ─── Legacy compat (used by export) ──────────────────
function isDarkTheme() {
  return document.documentElement.getAttribute('data-theme') !== 'light';
}
function getSingleChartDef(key, data) {
  const dark = isDarkTheme();
  switch(key) {
    case 'platformBar':    return data.platforms?.length >= 2 ? buildPlatformBarChart(data, dark) : null;
    case 'overviewDonut':  return buildOverviewDonut(data, dark);
    case 'penetrationRadar': return buildPenetrationRadar(data, dark);
    case 'platformShare':  return data.platforms?.length >= 3 ? buildPlatformShareChart(data, dark) : null;
    case 'genderChart':    return (data.femalePct && data.malePct) ? buildGenderChart(data, dark) : null;
    case 'urbanRural':     return (data.urbanPct && data.ruralPct) ? buildUrbanRuralChart(data, dark) : null;
    case 'platformGrowth': return buildPlatformGrowthChart(data, dark);
    default: return null;
  }
}
