# NovaScope

A browser-based analytics tool that converts DataReportal digital reports into structured visual dashboards. No server, no build step, no dependencies beyond a CDN.

---

## Overview

DataReportal publishes annual digital reports for 60+ countries and global overviews. These reports contain dense statistical text covering internet usage, mobile penetration, social media reach, platform audiences, and demographic breakdowns.

NovaScope extracts that data automatically and presents it as an interactive dashboard — KPI cards, seven chart types, platform rankings, and key highlights — all renderable in a browser with zero configuration.

---

## Features

- **Automatic data extraction** — Paste any `datareportal.com/reports/...` URL. NovaScope fetches the page through a CORS proxy chain, parses the HTML, and extracts every numeric data point it can identify.
- **Interactive charts** — Platform user rankings, digital overview doughnut, penetration radar, market share polar area, gender split, urban/rural breakdown, and platform growth rates. Charts are rendered using Chart.js and switch between dark and light palettes automatically.
- **Export** — Select individual data points and charts, then export as:

  - **PDF** — Formatted A4 document with metric cards, platform bar charts, embedded chart images, and a branded Nova credits page.
  - **CSV** — Structured spreadsheet-ready output.
  - **TXT** — Clean plain-text report for copy-paste use.
- **Arabic translation** — Full UI translation to Egyptian Arabic with RTL layout support. Toggle via the language button in the header.
- **Dark / Light theme** — System preference respected on first load; toggleable at any time.
- **Mobile layout** — Bottom navigation bar, touch-scrollable chart tabs, and readable card grids down to 320px viewport width.

---

## How to Use

1. Open the site (or `index.html` locally).
2. On the **Home** tab, paste a DataReportal report URL into the input field.
3. Press **Analyze** or hit Enter.
4. NovaScope fetches the report, extracts the data, and switches automatically to the **Dashboard** tab.
5. Use the **Charts** tab to browse individual visualizations.
6. Use the **Export** tab to select what to include and download in your chosen format.

**Example URLs:**

```
https://datareportal.com/reports/digital-2026-egypt
https://datareportal.com/reports/digital-2026-saudi-arabia
https://datareportal.com/reports/digital-2026-global-overview
https://datareportal.com/reports/digital-2026-uae
```

---

## Project Structure

```
/
├── index.html          Main HTML — tab panels, navigation, export modal
├── css/
│   ├── style.css       Complete design system (dark/light, RTL, responsive)
│   └── NOVA Mono logo.png  Brand logo (used in footer and PDF exports)
├── js/
│   ├── utils.js        DOM helpers, number formatting, country flags
│   ├── scraper.js      CORS proxy chain, URL validation, data extraction
│   ├── charts.js       Chart.js configuration for all seven chart types
│   ├── export.js       PDF, CSV, and TXT export logic with Nova branding
│   └── app.js          Tab navigation, translations, analysis flow, UI rendering
└── README.md
```

---

## Architecture Notes

### Data Extraction

The scraper fetches raw HTML via a chain of free CORS proxies (allorigins.win → corsproxy.io → codetabs.com → thingproxy). It does not execute JavaScript on the target page, so only server-rendered HTML is available. DataReportal's textual report body is sufficient for most statistics.

Extraction uses regex patterns matched against the full text content of the page body. Patterns cover:

- Absolute user counts (population, internet users, social media users, mobile connections)
- Penetration percentages for internet, mobile, and social media
- Year-on-year growth rates
- Urban/rural and gender demographic splits
- Per-platform audience figures and growth rates for 14 platforms

### Proxy Failover

When the primary proxy (allorigins) fails or times out (15-second limit), the scraper automatically tries the next proxy in the chain without user intervention. A console warning is logged for each failed attempt.

### Chart Stage

Rather than rendering all charts at once, NovaScope renders one chart at a time into a shared "stage" canvas. This keeps memory usage low and makes the mobile experience navigable. Arrow buttons and tab pills switch the active chart; the previous canvas is destroyed before the new one is initialized.

### Export Engine

PDF export uses jsPDF. Chart images are captured by rendering each chart off-screen onto a temporary canvas, calling `toDataURL()`, and embedding the result in the PDF. The final page of every PDF export contains the Nova logo, developer credit, and contact information.

---

## Deployment (GitHub Pages)

1. Fork or clone this repository.
2. Push to a GitHub repository.
3. Go to **Settings → Pages**.
4. Set source to **main branch / root (/)**.
5. GitHub will serve the site at `https://your-username.github.io/repository-name`.

No build step is required. The entire project is static HTML, CSS, and JavaScript.

---

## Limitations

- DataReportal must be accessible via the proxy at request time. Proxy availability is not guaranteed.
- Reports that are heavily JavaScript-rendered may return incomplete data.
- Regex patterns are tuned to DataReportal's current report text format. If DataReportal changes its writing style, some patterns may need updating.
- PDF chart image quality depends on browser canvas rendering.

---

## Dependencies

| Library              | Version | Purpose                 |
| -------------------- | ------- | ----------------------- |
| Chart.js             | 4.4.4   | Chart rendering         |
| Lucide               | latest  | Icon set                |
| jsPDF                | 2.5.1   | PDF generation          |
| html2canvas          | 1.4.1   | Canvas-to-image for PDF |
| Google Fonts (Inter) | —      | Typography              |

All loaded via CDN. No npm, no bundler.

---

## License

MIT. See `LICENSE`.

---

Developed by **Hamza Samier**
Nova Team · Egypt · 2026
WhatsApp: [+20 122 776 8855](https://wa.me/201227768855)
