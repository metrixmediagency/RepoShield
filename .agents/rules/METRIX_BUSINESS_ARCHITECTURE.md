---
trigger: always_on
---
# RepoShield / MetrixMedia Project Rules & Architecture

This document serves as the permanent memory, architectural blueprint, and strictly enforced system rules for the MetrixMedia business and its digital infrastructure.

## 1. Business Model
MetrixMedia is a B2B SaaS and Digital Marketing Agency. The core value proposition is generating hyper-personalized, interactive digital demos (digital menus, portals, and QR-based physical standees) for local hospitality businesses (cafes, bars, restaurants, clinics). 
The goal is to provide a "Toast" or "Olo" style digital infrastructure to local businesses, using the automated interactive demos as the primary sales hook.

## 2. Core Project Files & Data Pipeline
The frontend infrastructure allows the user to generate, preview, and download custom digital assets.
* **`sales.html`**: The monolithic control center. Configures campaigns (business name, styling) and pushes generated campaigns directly into the Supabase database. Features a "Master Standee" button in the top navigation that opens a generic `flyer.html` in a new tab, where the QR code is hardcoded to route to `live.html` (the Master Demo Redirector).
* **`portal.html`**: The interactive "Digital Demo" portal that simulates the client's mobile experience. Features a premium "Unlock VIP Privileges 🥂" gate for 5-star ratings and a private negative feedback gate for 1-3 stars. BOTH gates capture Name, Phone, and Date of Birth (DOB) and send this data to custom Google Sheets webhooks.
* **`live.html`**: The Master Demo redirector. Scanned physical standees hit this URL, which queries the Supabase `campaigns` table for the most recent entry and dynamically redirects the user to the custom generated `portal_url`. The loading screen mirrors the premium portal UI to ensure a seamless transition.
* **`flyer.html`**: The physical print asset generator. Strictly sized for 100mm x 155mm acrylic standees. It utilizes a resilient `@media print` layout that rotates the vertical standees -90 degrees and stacks them vertically on standard A4 portrait paper to completely bypass printer hardware clipping.

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
- **Print Dimensions & Scaling**: Do not alter the 100mm x 155mm hardcoded sizing in `flyer.html` or the rotational `@media print` architecture, as this guarantees a 1:1 hardware fit on A4 paper regardless of the printer model used.
- **No `canvas` for QR Codes on Mobile**: The QR code rendering must always use `type: "svg"` with an injected `viewBox` attribute. Canvas rendering on mobile browsers is unreliable for complex strings.
- **No CORS Blocks**: External API calls for URL shortening MUST be routed through a CORS proxy (e.g., `allorigins.win`) to prevent browser fetch blocking on Vercel.
- **Live Deployment Updates**: Any edits made to `portal.html` or `portal.js` must be pushed to GitHub to take effect on the live hosted site. Always bump the cache-buster string (e.g., `?v=2.4`) in `portal.html` when updating `portal.js` to clear mobile caches.

## 5. Sales Playbook & Strategy
- **The 2-Visit Walk-In Framework**: Cold calling is permanently disabled. The core sales model is a direct face-to-face walk-in with the business owner.
  - **Visit 1 (Day 1)**: Introduce the Standee on the counter, demonstrate the live portal, and attempt an immediate close (₹1000). If they object, drop the 3-Day Free Trial and leave.
  - **Visit 2 (Day 3)**: Return to reveal the captured VIP Phone Numbers and trapped complaints. Ask for the payment. If they object, deploy the Sentinel Protocol Straight Line Loops.
- **Sentinel Protocol Straight Line Loops**: On Day 3 objections, systematically build Certainty (using the "Dirty Cup" rating story and highlighting the dual benefit of Rating Protection + Database Building), lower their Action Threshold (with a 7-Day Moneyback Guarantee), and raise their Pain Threshold (bleeding customers to competitors).
- **Gatekeeper Bypass Rule**: Never pitch to employees or cashiers. If the owner is not available, ask for their name, state you will return tomorrow, pack up the standee, and leave.
- **High Rating Objection**: If a cafe has a high rating (4.5+), position it as a risk—they have a pristine reputation that could be ruined by a single 1-star review. PLUS, emphasize that they are missing out on building a customer database. The standee acts as an insurance policy and lead magnet.
- **Database Routing**: VIP leads (rating >= 4) and Complaints (rating <= 3) are both saved directly to the Supabase `feedback` table. When exporting data for clients, use the Supabase filter on `business_name` and `rating` to segregate VIPs from Angry Customers.
