# Geotrax website

AI-powered global DMC network for travel agents, advisors and tour operators. Static site, no build step.

## Run locally

```
npx http-server -p 8080 .
# open http://127.0.0.1:8080/
```

Any static host works (GitHub Pages, Netlify, Vercel, S3). Deploy the repository root.

## Structure

| Path | What it is |
|---|---|
| `index.html` | The whole site: homepage, explore (destinations + globe), inquiry flow, dashboards, inner pages container, all CSS |
| `js/pages.js` | Site config, inner pages (How it works, For agents, Partners, About, Contact), partner/contact forms, mobile menu, localStorage persistence |
| `js/data.js` | 130 countries, cities/regions per country, signature packages (large, generated) |
| `js/dashboards.js` | Client and supplier dashboard templates rendered into iframes (powered by Hyperporter OS) |
| `assets/` | Images, favicon, wordmarks |

Routes are hash based: `#/`, `#/explore`, `#/how-it-works`, `#/for-agents`, `#/partners`, `#/about`, `#/contact`, `#/track/GT-XXXXXX`.

## Configuration (`js/pages.js`, top of file)

- `endpoint`: URL that accepts JSON POSTs. When set, every inquiry (`kind: "inquiry"`), partner application (`partner-application`), contact message (`contact`) and offer selection (`offer-selected`) is sent there. Point it at a CRM webhook, Zapier/Make, Formspree, or your own API.
- `contactEmail`: public inbox. Until `endpoint` is set, the partner and contact forms fall back to opening the visitor's email app with the form contents.
- `phone`: optional, shown on the contact page.
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
- Geotrax fee level and partner reply time
- public email, phone and office address
- founding year, HQ and leadership
- testimonials and client logos (placeholders only; none are invented)
