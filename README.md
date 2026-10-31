# Grounder website

AI-powered global DMC network for travel agents, advisors and tour operators. Static site, no build step.

## Run locally

```
npx http-server -p 8080 .
# open http://127.0.0.1:8080/
```

Any static host works (GitHub Pages, Netlify, Vercel, S3). Deploy the repository root.

## Languages

English (default, `/`), French (`/fr/`), German (`/de/`) and Spanish (`/es/`). Each language is a pre-rendered copy of `index.html` that loads its own translated scripts (`js/pages.fr.js`, `js/dashboards.fr.js`, `js/trips.fr.js`, …). No translation library runs in the browser.

- Translations live in `i18n/{fr,de,es}.json` as `{ "English text": "translation" }`. After changing copy, run `node scripts/i18n.mjs build` to regenerate the language folders, the translated scripts and the sitemap (`check` also lists missing strings).
- Translated: navigation, all pages (home, how it works, for agents, partners, about, contact), the legal pages, the inquiry, check and partner forms with their messages, meta descriptions, and the signature-package titles and filters shown in Explore.
- Stays in English: country and city names (they are lookup keys for the globe, search and data), the long package bodies in `js/trips.js` (pitch, highlights, day-by-day, inclusions: 2.5 MB), the text the simulated dashboards generate at runtime, and the example client email (the brief reader parses English).
- The EN · FR · DE · ES switch sits in the header and the mobile menu and keeps the current view (`#/for-agents` stays `#/for-agents`).

## Structure

| Path | What it is |
|---|---|
| `index.html` | The whole site: homepage, explore (destinations + globe), inquiry flow, dashboards, inner pages container, all CSS |
| `js/pages.js` | Site config, inner pages (How it works, For agents, Partners, About, Contact), partner/contact forms, mobile menu, localStorage persistence |
| `js/data.js` | 130 countries and cities/regions per country (small; loads with the page) |
| `js/trips.js` | Signature packages (2.7 MB, generated); loaded on first interaction or on any route that needs it |
| `js/dashboards.js` | Client and supplier dashboard templates rendered into iframes (powered by Hyperporter OS); loaded lazily like `trips.js` |
| `assets/` | Images, favicon, wordmarks |

Routes are hash based: `#/`, `#/explore`, `#/how-it-works`, `#/for-agents`, `#/partners`, `#/about`, `#/contact`, `#/track/GT-XXXXXX`.

## Configuration (`js/pages.js`, top of file)

- `endpoint`: URL that accepts JSON POSTs. When set, every inquiry (`kind: "inquiry"`), partner application (`partner-application`), contact message (`contact`) and offer selection (`offer-selected`) is sent there. Point it at a CRM webhook, Zapier/Make, Formspree, or your own API.
- `contactEmail`: `grounder@tourground.com`. Until `endpoint` is set, the partner and contact forms fall back to opening the visitor's email app with the form contents.
- `address`: the business address (Second Home Spitalfields, London), shown on the contact page, footer and legal pages.

By owner decision (October 2026) the site shows no phone, WhatsApp, social links, licence numbers or testimonials. Legal pages: `#/privacy`, `#/terms`, `#/cookies` (have a lawyer review them before launch).
- `demoQuotes`: `true` shows illustrative offers on the dashboard a few seconds after an inquiry. Set to `false` once real partners are connected.

Inquiries are also stored in the visitor's browser (localStorage), so a reference entered in "Check an inquiry" works after a reload on the same device.

## What is real and what is simulated

Real: AI parsing of pasted briefs (destination, cities, dates, travellers, budget, style, contact), inquiry references, dashboards populated from the inquiry, partner and contact forms, persistence, all navigation.

Simulated until a backend exists: DMC offers on the dashboard (`demoQuotes`), message replies on the tracking page, email delivery of the dashboard link.

## Claims to verify before launch

Flagged in the copy with a yellow VERIFY badge:

- 130+ countries (from the brief)
- number of vetted partners and agencies served (placeholders `[X]`)
- 48-hour first-response commitment
- partner vetting threshold (years operating, references)
- Grounder fee level and partner reply time
- founding year, HQ and leadership
- testimonials and client logos (placeholders only; none are invented)
