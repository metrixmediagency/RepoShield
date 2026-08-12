# RepoShield / MetrixMedia Project Rules & Architecture

This document serves as the permanent memory, architectural blueprint, and strictly enforced system rules for the MetrixMedia business and its digital infrastructure.

## 1. Business Model
MetrixMedia is a B2B SaaS and Digital Marketing Agency. The core value proposition is generating hyper-personalized, interactive digital demos (digital menus, portals, and QR-based physical standees) for local hospitality businesses (cafes, bars, restaurants, clinics). 
The goal is to provide a "Toast" or "Olo" style digital infrastructure to local businesses, using the automated interactive demos as the primary sales hook.

## 2. Core Project Files & Data Pipeline
The frontend infrastructure allows the user to generate, preview, and download custom digital assets.
* **`sales.html`**: The monolithic control center. Configures campaigns (business name, styling) and pushes generated campaigns directly into the Supabase database. It also features a "Master QR" button in the top navigation that dynamically generates the static QR code for the `live.html` redirector.
* **`portal.html`**: The interactive "Digital Demo" portal that simulates the client's mobile experience. Features a premium "Unlock VIP Privileges 🥂" gate for 5-star ratings and a private negative feedback gate for 1-3 stars. BOTH gates capture Name, Phone, and Date of Birth (DOB) and send this data to custom Google Sheets webhooks.
* **`live.html`**: The Master Demo redirector. Scanned physical standees hit this URL, which queries the Supabase `campaigns` table for the most recent entry and dynamically redirects the user to the custom generated `portal_url`. The loading screen mirrors the premium portal UI to ensure a seamless transition.
* **`flyer.html`**: The physical print asset generator. Sizes QR codes and elements for physical standees and stickers using `@media print` CSS rules.

## 3. The Telegram Bot Engine (`bot-engine/`)
To automate prospecting and lead generation, a custom Telegram bot was built natively in Python for Linux compatibility.
* **Architecture**: The bot runs in the cloud via `metrix_bot.py`. It listens for commands (e.g., `Pune - Bars`) 24/7.
* **Lead Generation**: Scrapes Google Maps via SERP API.
* **Image Compositing**: Uses Python's `Pillow` (PIL) library to dynamically composite a transparent standee onto the lead's Google Maps photo with a sleek dark overlay.

## 4. Strict Coding Rules & Technical Guidelines
- **Business Names**: Dom elements representing the business name capsule use class `.biz-title-placeholder` (typically inside `.standee-header h2`). Do NOT overwrite this with the custom flyer headline.
- **Headline Text**: Custom flyer headlines must strictly target `.standee-body h3` (not the general h2 tags in headers).
- **Campaign Config Scope**: Campaign styling data includes `theme`, `font`, `logo`, `qrSettings` (`qrDotStyle`, `qrCornerStyle`), and `flyerSettings` (`flyerHeadline`, `flyerSub`, `flyerFooter`, `flyerTextStyle`).
- **No Keystroke Reloads**: Never dynamically reassign iframe `src` URLs on text input changes or keystrokes. This causes page flicker, resets states, and drops payload messages.
- **Iframe Initialization**: Set the iframe `src` once during initial page load or when the campaign type changes.
- **Real-time Sync**: Apply all text, color, font, and theme changes instantly using window `postMessage` (`type: 'UPDATE_FLYER'`).
- **Print Media Queries**: Ensure `@media print` CSS rules preserve theme backgrounds, gradients, and images. Use `-webkit-print-color-adjust: exact !important`.
- **Template Parity**: Any changes made to the HTML/CSS template structures in `flyer.html` must be manually aligned inside the JavaScript printing loop of `bulk_flyer.html`.
- **No `canvas` for QR Codes on Mobile**: The QR code rendering must always use `type: "svg"` with an injected `viewBox` attribute. Canvas rendering on mobile browsers is unreliable for complex strings.
- **No CORS Blocks**: External API calls for URL shortening MUST be routed through a CORS proxy (e.g., `allorigins.win`) to prevent browser fetch blocking on Vercel.
