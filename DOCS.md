# mik-komerc — Project Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Structure](#2-project-structure)
3. [i18n System](#3-i18n-system)
4. [CSS Architecture](#4-css-architecture)
5. [JavaScript](#5-javascript)
6. [Forms](#6-forms)
7. [Deployment](#7-deployment)
8. [Known Issues & Future Work](#8-known-issues--future-work)

---

## 1. Project Overview

**mik-komerc** is a B2B marketing website for a Serbian family-owned manufacturer of professional cleaning products (dishwashing liquids, hand soaps, laundry detergents, plastic packaging). The site targets buyers in the restaurant, hotel, hospital, and industrial sectors across Serbia and Germany.

### Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| HTML | Vanilla HTML5 | No build step, simple hosting |
| CSS | Vanilla CSS (multi-file) | No preprocessor dependency |
| JavaScript | Vanilla ES Modules | No framework overhead |
| Fonts | Inter Variable (TTF) | Self-hosted, no external dependency |
| Forms | Formspree | Zero-backend form handling |
| Hosting | Vercel | Free tier, automatic deploys from Git |

**No build tool, no bundler, no npm.** Everything is plain files served as-is. This is intentional — the site is simple enough that a build pipeline would add complexity without benefit.

### Languages

The site supports three languages, switchable at runtime without page reload:

- **English** (`en`) — default
- **German** (`de`)
- **Serbian** (`sr`)

Language preference is stored in `localStorage` under the key `mik_lang`.

### Live URL

`https://mik-komerc.vercel.app`

---

## 2. Project Structure

```
mik-komerc-redesign/
│
├── index.html          Home page
├── products.html       Product catalog
├── about.html          About / company story
├── contact.html        Contact form + info
├── thank-you.html      Post-form-submission confirmation
│
├── css/
│   ├── variables.css   CSS custom properties (:root) — load first
│   ├── base.css        Reset, font-face declarations, body styles
│   ├── buttons.css     Button and badge component styles
│   ├── navigation.css  Nav bar, burger menu, language switcher
│   ├── hero.css        Full-bleed hero (index) and page-hero (subpages)
│   ├── features.css    Feature cards section (index)
│   ├── cta.css         Call-to-action section with steps
│   ├── footer.css      Footer layout and styles
│   ├── products.css    Product grid, filter bar, product cards
│   ├── about.css       Story, values, certifications, mission sections
│   ├── contact.css     Contact form, info card, map, certifications
│   ├── main.css        (unused — placeholder)
│   ├── reset.css       (unused — placeholder)
│   └── components/     (unused directory — placeholder)
│
├── js/
│   ├── i18n.js             Translation engine (fetch, cache, apply)
│   ├── language-switcher.js  Flag click handlers + initial load trigger
│   ├── form-validation.js  Contact form validation with i18n error messages
│   └── burger-menu.js      Mobile nav open/close logic
│
├── translations/
│   ├── en.json         English strings
│   ├── de.json         German strings
│   └── sr.json         Serbian strings
│
├── assets/
│   ├── fonts/inter/    Inter variable font (TTF — regular + italic)
│   ├── icons/          SVG icons used throughout the UI
│   │   └── favicon/    Favicon set (SVG, PNG, manifest, apple-touch)
│   └── images/         Product and hero images (JPEG)
│
├── data/
│   └── products.json   Product catalog data (not currently wired up)
│
├── sitemap.xml         XML sitemap for all five pages
├── robots.txt          Allows all crawlers, references sitemap
├── favicon.ico         Empty placeholder (real favicons are in assets/icons/favicon/)
└── DOCS.md             This file
```

### Pages and Their CSS Dependencies

Each HTML file loads only the CSS it needs. `variables.css` and `base.css` are loaded on every page first.

| Page | Extra CSS loaded |
|---|---|
| `index.html` | `navigation`, `hero`, `features`, `cta`, `footer`, `products` |
| `products.html` | `navigation`, `hero`, `footer`, `products` |
| `about.html` | `navigation`, `hero`, `footer`, `about`, `cta` |
| `contact.html` | `navigation`, `hero`, `footer`, `contact` |
| `thank-you.html` | `navigation`, `hero`, `footer`, `contact` |

### Scripts Loaded on Each Page

Every page loads (at the bottom of `<body>`):

```html
<script src="js/burger-menu.js"></script>
<script type="module" src="js/language-switcher.js"></script>
```

`contact.html` additionally loads:

```html
<script type="module" src="js/form-validation.js"></script>
```

`burger-menu.js` is a classic script (not a module). All others use `type="module"` and can use `import`/`export`.

---

## 3. i18n System

### How It Works

Translation is handled entirely client-side by two files: `js/i18n.js` (the engine) and `js/language-switcher.js` (the trigger).

**On every page load**, `language-switcher.js` runs `applyTranslations(getLang())`. This:

1. Reads the current language from `localStorage` (defaults to `'en'` if not set)
2. Fetches `translations/{lang}.json` (e.g. `translations/en.json`) — result is cached in memory so subsequent calls don't re-fetch
3. Queries every `[data-i18n]` element and sets its `textContent` to the resolved translation value
4. Queries every `[data-i18n-placeholder]` element and sets its `placeholder` attribute

**When a user clicks a language flag**, `language-switcher.js` calls `setLanguage(lang)`, which:

1. Saves the chosen language to `localStorage`
2. Sets `document.documentElement.lang` to the new language code
3. Calls `applyTranslations(lang)` — uses cache if the JSON was already fetched this session

### Translation Key Syntax

Keys use dot notation to navigate the nested JSON structure:

```html
<h2 data-i18n="index.products_heading"></h2>
<input data-i18n-placeholder="contact.placeholder_email">
```

The key `"index.products_heading"` resolves to `translations.index.products_heading` in the JSON.

**Elements with `data-i18n` must be empty in the HTML.** The i18n system sets `textContent`, which replaces all child nodes. If an element contains child elements (e.g. an icon `<img>` alongside text), wrap only the text in a `<span data-i18n="..."></span>` — see the wishlist buttons in `products.html` for an example.

### JSON Structure

All three translation files follow the same structure:

```json
{
  "nav": { ... },
  "footer": { ... },
  "index": { ... },
  "products": { ... },
  "about": { ... },
  "contact": { ... },
  "errors": { ... },
  "thankyou": { ... }
}
```

Keys are grouped by page (`index`, `products`, `about`, `contact`) except for `nav`, `footer`, and `errors`, which are shared across all pages.

### Adding a New Translation Key

**Step 1 — Add the key to all three JSON files.**

Open `translations/en.json`, `translations/de.json`, and `translations/sr.json`. Add the new key under the appropriate group. All three files must have the key or it will silently render empty on the other languages.

```json
// en.json
"index": {
  "new_section_title": "Our Certifications"
}

// de.json
"index": {
  "new_section_title": "Unsere Zertifizierungen"
}

// sr.json
"index": {
  "new_section_title": "Naši sertifikati"
}
```

**Step 2 — Add the attribute to the HTML element.**

```html
<h2 data-i18n="index.new_section_title"></h2>
```

Leave the element empty — the content is injected at runtime.

### Adding a New Language

**Step 1 — Create the translation file.**

Copy `translations/en.json` to `translations/xx.json` (where `xx` is the BCP 47 language code, e.g. `fr` for French). Translate every value. Do not change any keys.

**Step 2 — Add a flag link to the nav on every HTML page.**

In the navigation and burger menu of each HTML file, add:

```html
<li><a class="lang-switch" data-lang="fr">🇫🇷</a></li>
```

The `data-lang` value must exactly match the JSON filename prefix (`fr` → `translations/fr.json`).

That's all. No code changes are needed — `language-switcher.js` reads `data-lang` dynamically and `i18n.js` constructs the fetch URL from it.

### Adding a New Page with Translations

1. Create the HTML file. Copy nav, burger menu, footer, and script tags from any existing page.
2. Add a new key group in all three JSON files (e.g. `"impressum": { ... }`).
3. Use `data-i18n="impressum.key_name"` on elements in the new page.
4. No changes to `i18n.js` or `language-switcher.js` are needed.

---

## 4. CSS Architecture

### Loading Order

Every page loads CSS in this order:

```html
<link rel="stylesheet" href="css/variables.css">  <!-- custom properties -->
<link rel="stylesheet" href="css/base.css">        <!-- reset + fonts + body -->
<link rel="stylesheet" href="css/buttons.css">     <!-- button components -->
<link rel="stylesheet" href="css/navigation.css">  <!-- nav + burger -->
...                                                 <!-- page-specific files -->
<link rel="stylesheet" href="css/footer.css">      <!-- footer -->
```

`variables.css` must come first because all other files reference its custom properties. `base.css` must come second because it sets the global reset and body font.

### Variables (`css/variables.css`)

All design tokens live here. Any hardcoded value in other CSS files is a bug — it should be a variable.

```css
:root {
    /* Brand */
    --color-primary: #e7000b;
    --color-primary-dark: #c20009;
    --color-primary-light: #fee2e2;

    /* Neutrals */
    --color-white: #ffffff;
    --color-gray-50: #f9fafb;
    --color-gray-600: #4b5563;
    --color-gray-800: #1f2937;

    /* Spacing scale */
    --spacing-xs: 0.5rem;   /*  8px */
    --spacing-sm: 1rem;     /* 16px */
    --spacing-md: 1.5rem;   /* 24px */
    --spacing-lg: 2rem;     /* 32px */
    --spacing-xl: 3rem;     /* 48px */
    --spacing-2xl: 4rem;    /* 64px */
}
```

**Note:** The gray scale has gaps (only 50, 600, 800 are defined). Several CSS files use hardcoded hex values like `#e5e7eb` and `#9ca3af` for missing steps. These should be added as variables if needed.

### Naming Conventions

Classes follow a loose BEM-inspired convention without strict enforcement:

- **Block:** `.feature-card`, `.contact-form`, `.footer-section`
- **Element:** `.feature-icon`, `.contact-form-wrapper`, `.footer-logo`
- **Modifier:** `.nav-link.active`, `.footer-badge-red`, `.btn-wishlist`

Page-specific wrapper classes prefix with the section name: `.story`, `.values-wrapper`, `.certifications`, `.mission-wrapper`.

Utility/state classes: `.open` (burger menu), `.input-error` (form validation), `.active` (current nav link).

### Breakpoints

There is no breakpoint variable system — breakpoints are written inline in each CSS file. The project uses three consistent values:

| Name | Value | Usage |
|---|---|---|
| Mobile (default) | `< 768px` | Single-column layouts, burger menu visible |
| Tablet | `≥ 768px` | Two-column forms, desktop nav visible |
| Desktop | `≥ 1024px` | Three-column grids, larger typography |

Additionally, `hero.css` includes two max-height breakpoints (`650px`, `500px`) for landscape mobile devices.

### CSS File Responsibilities

| File | What it styles |
|---|---|
| `variables.css` | CSS custom properties only |
| `base.css` | `@font-face` for Inter, `body` defaults, global reset |
| `buttons.css` | `.btn-primary`, `.btn-secondary`, `.btn-cta`, `.badge` — used across pages |
| `navigation.css` | `.navigationWrapper`, `.navigation`, `.nav-link`, `.burger-nav`, `.burger-overlay`, `.lang-switch` |
| `hero.css` | `.hero` (full-bleed index hero), `.page-hero` (subpage header strip) |
| `features.css` | `.features`, `.feature-card`, `.feature-icon` |
| `cta.css` | `.cta`, `.cta-content`, `.cta-steps`, `.cta-step` |
| `footer.css` | `.footer`, `.footer-content`, `.footer-section`, `.footer-badges`, `.footer-bottom` |
| `products.css` | Filter bar, `.products-grid`, `.products-grid-full`, `.product-card`, `.product-card-full`, `.btn-wishlist`, `.size-btn` |
| `about.css` | `.story`, `.values-wrapper`, `.certifications`, `.certifications-card`, `.mission-wrapper` |
| `contact.css` | `.contact-form`, `.form-group`, `.contact-info-card`, `.contact-map`, `.quick-response`, `.input-error`, `.error-message` |

### Unused CSS Files

`css/main.css`, `css/reset.css`, and `css/components/` are empty placeholders not loaded by any page. They can be deleted.

---

## 5. JavaScript

### `js/i18n.js`

The translation engine. Exports three functions:

```js
getLang()              // Returns current language code from localStorage, default 'en'
applyTranslations(lang) // Fetches (or reads from cache), then updates DOM
setLanguage(lang)       // Saves to localStorage, updates html[lang], calls applyTranslations
```

**Cache:** Fetched JSON is stored in a module-level `const cache = {}` object keyed by language code. Once `en.json` is fetched, subsequent language switches back to English do not make a network request.

**DOM update:** Uses `el.textContent = value` for `[data-i18n]` elements and `el.placeholder = value` for `[data-i18n-placeholder]` elements. `textContent` replaces all child nodes, so elements with mixed content (text + icons) must wrap their text in a `<span data-i18n="...">`.

**Error handling:** If the fetch fails (network error or non-2xx response), the error is logged to console and the function returns early. Elements remain empty. There is currently no fallback rendering.

### `js/language-switcher.js`

Imported as a module on every page. Does two things:

1. **On load:** calls `applyTranslations(getLang())` immediately, so the correct language is applied as soon as the module executes (after DOM is parsed, since modules are deferred by default).
2. **On flag click:** calls `setLanguage(link.dataset.lang)` for whichever flag was clicked.

```js
import { setLanguage, applyTranslations, getLang } from './i18n.js';

applyTranslations(getLang());

document.querySelectorAll('.lang-switch').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        setLanguage(link.dataset.lang);
    });
});
```

### `js/form-validation.js`

Imported as a module on `contact.html` only. Intercepts the form's `submit` event, runs validation, and only calls `form.submit()` if all fields pass.

**Validated fields:** `firstName`, `lastName`, `email`, `company`, `businessType`, `message`.

**Validation rules:**
- All six fields: required (non-empty after `.trim()`)
- `email`: additionally checked for presence of `@`

**Error messages** are loaded from the current language's `errors` object in the translation JSON. If the fetch fails, a hardcoded English `FALLBACK_ERRORS` object is used so the form remains functional regardless.

**Error display:** Each failing field gets class `.input-error` and a `<p class="error-message">` appended to its `.form-group`. Errors are cleared and re-evaluated on every submit attempt.

### `js/burger-menu.js`

Loaded as a classic (non-module) script on every page. Handles the mobile navigation drawer.

- Opens `.burger-nav` and `.burger-overlay` when the burger button is clicked
- Closes both when the close button or overlay is clicked
- All four DOM queries are null-checked — the script is safe on any page

**Does not handle:** `Escape` key to close, focus trapping, `aria-expanded` state (known limitations — see section 8).

---

## 6. Forms

### Formspree Setup

The contact form on `contact.html` submits to Formspree:

```html
<form class="contact-form" action="https://formspree.io/f/xrerqqbl" method="POST">
    <input type="hidden" name="_next" value="https://mik-komerc.vercel.app/thank-you.html">
```

- **Endpoint:** `https://formspree.io/f/xrerqqbl`
- **Redirect:** After successful Formspree submission, the user is sent to `thank-you.html` via the hidden `_next` field
- **Account:** Managed at formspree.io — log in to view submissions, set up email notifications, or configure spam filters

The form uses `method="POST"` but `form-validation.js` calls `e.preventDefault()` and only calls `form.submit()` programmatically after client-side validation passes. Formspree then handles the actual HTTP submission and redirect.

### Changing the Formspree Endpoint

Replace `xrerqqbl` in the `action` attribute with the new form ID from Formspree. The `_next` redirect URL should also be updated if the domain changes.

### Validation Logic

Validation runs on `submit`. The flow:

```
submit event fired
  → e.preventDefault()
  → fetch translations/{lang}.json for error messages
     → if fetch fails, use FALLBACK_ERRORS (English)
  → clear all previous .error-message elements and .input-error classes
  → check each required field: if empty → showError(), isValid = false
  → check email field: if has value but no '@' → showError(), isValid = false
  → if isValid → form.submit()
```

`showError(input, message)` adds class `.input-error` to the field and appends a `<p class="error-message">` to the field's parent `.form-group`.

### Adding a New Required Field

1. Add the `<input>` or `<select>` with a unique `id` to the form in `contact.html`
2. Add an entry to the `fields` array in `form-validation.js`:
   ```js
   { id: 'newFieldId', errorKey: 'new_field_required' }
   ```
3. Add `"new_field_required": "..."` to the `errors` object in all three translation JSON files
4. Add `"new_field_required": "..."` to `FALLBACK_ERRORS` in `form-validation.js`

---

## 7. Deployment

### Platform

The site is deployed on **Vercel** at `https://mik-komerc.vercel.app`. Vercel serves static files directly with no server-side configuration required.

### How to Deploy

**First time:**

1. Push the repository to GitHub
2. Log in at vercel.com → New Project → Import the GitHub repository
3. No build command or output directory is needed — Vercel detects static files automatically
4. Click Deploy

**Subsequent deploys:**

Every push to the `main` branch triggers an automatic redeploy on Vercel. No manual action needed.

**Manual deploy (without Git):**

```bash
npm i -g vercel
vercel --prod
```

Run from the project root. Vercel CLI uploads all files and returns a deployment URL.

### What Vercel Serves

Vercel serves the root directory as-is. Requesting `/index.html` serves `index.html`. There are no server-side redirects or rewrites configured — all internal links use explicit `.html` extensions (`href="products.html"`), so no rewrite rules are needed.

### Environment Variables

There are none. The Formspree endpoint is hardcoded in `contact.html`. If the endpoint needs to change per environment, it must be updated manually in the HTML.

### Domain Setup

To connect a custom domain in Vercel:

1. Go to the project → Settings → Domains
2. Add `mik-komerc.com`
3. Update DNS records at the domain registrar as instructed by Vercel

The `robots.txt` references `www.mik-komerc.com`. Update it to match whichever domain resolves (www vs. apex) once DNS is configured.

### Local Development

No server is required for most development — open any HTML file directly in a browser. However, ES modules (`type="module"`) and `fetch()` calls for translation JSON are blocked by browsers when using `file://` protocol due to CORS restrictions.

To develop locally with the i18n system working, serve the project over HTTP:

```bash
# Python (no install needed)
python3 -m http.server 3000

# Node (if npx is available)
npx serve .
```

Then open `http://localhost:3000`.

---

## 8. Known Issues & Future Work

### Active Issues

**Blank page on JS failure.** All text content is injected by `i18n.js` — every `data-i18n` element is empty in the HTML source. If JavaScript is disabled or fails to load, the entire page is blank. Mitigation: add hardcoded text as fallback content inside each `data-i18n` element (i18n.js overwrites it on success but it serves as a fallback).

**`<html lang>` not set on initial load.** `setLanguage()` correctly updates `document.documentElement.lang`, but the initial `applyTranslations()` call on page load (in `language-switcher.js`) does not. Screen readers read the page in the wrong language until a language switch occurs. Fix: add `document.documentElement.lang = getLang()` in `language-switcher.js` before the `applyTranslations` call.

**Burger menu accessibility gaps.** The mobile drawer does not trap focus, does not respond to the `Escape` key, and does not toggle `aria-expanded` on the trigger button. These are standard requirements for a drawer/dialog pattern.

**Language switcher flag accessibility.** The flag emoji links (`🇷🇸`, `🇩🇪`, `🇬🇧`) have no `aria-label`. Screen readers announce them as flag emoji descriptions rather than "Switch to Serbian" etc.

**TTF fonts instead of WOFF2.** `InterVariable.ttf` is served for all browsers. WOFF2 compresses variable fonts to roughly one-third the size. Both formats should be declared in `base.css` with WOFF2 listed first.

**No `loading="lazy"` on images.** All product images and the contact map photo load eagerly. Below-the-fold images should use `loading="lazy"`.

**`css/main.css`, `css/reset.css`, `css/components/`** are empty and not loaded by anything. Delete them to reduce confusion.

**`data/products.json`** exists but is not connected to any JavaScript. The product cards in `products.html` are static HTML.

### Phase 2 — Planned Features

**Product filtering.** The filter bar in `products.html` (search input, category dropdown, sort dropdown) is fully styled but has no JavaScript attached. Filtering logic should read from `data/products.json` and render cards dynamically.

**Wishlist.** The heart icon in the nav and the "Add to Wishlist" button on each product card have no functionality. A wishlist stored in `localStorage` is the likely implementation path.

**Impressum / Legal page.** Required for German visitors under German law. The `/de/` subfolder structure existed in the original codebase and included an `impressum.html` — this page was not included in the root-level redesign.

**Real map.** The map in `contact.html` is a static Unsplash photograph of a city skyline. It should be replaced with an embedded map (Google Maps iframe or OpenStreetMap) showing the actual business location.

**Image optimisation.** Product images are JPEG files without responsive variants. Adding `srcset` with multiple widths and converting to WebP or AVIF would significantly reduce page weight, particularly on mobile.

**WOFF2 fonts.** Generate WOFF2 versions of `InterVariable.ttf` and `InterVariable-Italic.ttf` using a tool like `woff2_compress` or Fonttools and add them to `base.css` alongside the TTF declarations.

**Form loading state.** After the user clicks Submit, there is no visual feedback while Formspree processes the request. A loading spinner or disabled button state should be added.
