# MetrixMedia Business Architecture & System Documentation

This document serves as the permanent memory and architectural blueprint for the MetrixMedia business and its digital infrastructure. It ensures that any developer or AI assistant working on this project instantly understands the complete business model, the codebase, and the deployment strategies.

## 1. Business Model
MetrixMedia is a B2B SaaS and Digital Marketing Agency. The core value proposition is generating hyper-personalized, interactive digital demos (digital menus, portals, and QR-based physical standees) for local hospitality businesses (cafes, bars, restaurants, clinics). 

The goal is to provide a "Toast" or "Olo" style digital infrastructure to local businesses, using the automated interactive demos as the primary sales hook.

## 2. Core Project Files & Data Pipeline
The frontend infrastructure allows the user to generate, preview, and download custom digital assets.
* **`sales.html`**: The monolithic control center. This UI allows the user to configure the campaign (business name, colors, styling, fonts). It contains direct links and generates the customized sales script. **It pushes generated campaigns directly into the Supabase database.**
* **`demo.html` / `portal.html`**: The interactive "Digital Demo" portal that simulates what the client's customers will see on their mobile phones. It features a responsive SVG QR code generator, an urgency expiry banner, and dynamic glassmorphism styling. **It now features a VIP Club Lead Capture gate for 5-star ratings (capturing Name, Phone, and DOB), sending data to both Supabase and custom Google Sheets webhooks.**
* **`live.html`**: The Master Demo redirector. Scanned physical standees hit this URL, which queries the Supabase `campaigns` table for the most recent entry and dynamically redirects the user to the custom generated `portal_url`.
* **`flyer.html`**: The physical print asset generator. It sizes QR codes and elements specifically for physical standees and stickers using `@media print` CSS rules.
* **`bulk_flyer.html`**: The automated printing loop that processes multiple leads instantly.

## 3. The Telegram Bot Engine (`bot-engine/`)
To automate prospecting and lead generation, a custom Telegram bot was built natively in Python for Linux compatibility.
* **Architecture**: The bot runs in the cloud via `metrix_bot.py`. It listens for commands (e.g., `Pune - Bars`) 24/7.
* **Lead Generation**: The script hits the SERP API to scrape Google Maps for leads, filtering out poor ratings and finding premium pricing brackets.
* **Image Compositing**: The bot uses Python's `Pillow` (PIL) library to dynamically composite a transparent standee (`assets/test_silver_transparent.png`) onto the lead's Google Maps photo with a sleek dark overlay.
* **Delivery**: The bot writes a custom sales script and pushes the image, lead details, and script back to the user's phone via the Telegram API.

## 4. Cloud Deployment Strategy (AWS)
The Telegram bot is currently configured and deployed on the user's AWS Ubuntu Server.
* **Linux Compatibility**: The bot engine was rewritten into Python specifically to run flawlessly on Ubuntu alongside the user's existing trading bots, completely bypassing Windows dependencies.
* **Deployment Package**: The isolated bot files have been packaged into `bot_deploy_ubuntu.zip`. It requires three environment variables on the host machine: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and `SERP_API_KEY`, and is launched via `start_bot.sh`.
* **Physical Sales Strategy**: The physical product pitched to clients is a "Master Demo Standee" containing a static QR code and/or NFC chip that redirects dynamically to specific custom pitches, preventing the need to print custom QR codes for every pitch.

## 5. Critical Technical Rules
* **No `canvas` for QR Codes on Mobile**: The QR code rendering in `demo.html` must always use `type: "svg"` with an injected `viewBox` attribute. Canvas rendering on mobile browsers is unreliable for complex strings.
* **No CORS Blocks**: External API calls for URL shortening MUST be routed through a CORS proxy (e.g., `allorigins.win`) to prevent browser fetch blocking on Vercel.
* **Print Parity**: Any visual changes made to `flyer.html` must be manually synchronized inside the JavaScript printing loop of `bulk_flyer.html`.
