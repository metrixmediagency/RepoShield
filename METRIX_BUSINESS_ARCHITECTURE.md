# MetrixMedia Business Architecture & System Documentation

This document serves as the permanent memory and architectural blueprint for the MetrixMedia business and its digital infrastructure. It ensures that any developer or AI assistant working on this project instantly understands the complete business model, the codebase, and the deployment strategies.

## 1. Business Model
MetrixMedia is a B2B SaaS and Digital Marketing Agency. The core value proposition is generating hyper-personalized, interactive digital demos (digital menus, portals, and QR-based physical standees) for local hospitality businesses (cafes, bars, restaurants, clinics). 

The goal is to provide a "Toast" or "Olo" style digital infrastructure to local businesses, using the automated interactive demos as the primary sales hook.

## 2. Core Project Files & UI Pipeline
The frontend infrastructure allows the user to generate, preview, and download custom digital assets.
* **`sales.html`**: The monolithic control center. This UI allows the user to configure the campaign (business name, colors, styling, fonts). It contains direct links and generates the customized sales script.
* **`demo.html`**: The interactive "Digital Demo" portal that simulates what the client's customers will see on their mobile phones. It features a responsive SVG QR code generator, an urgency expiry banner, and dynamic glassmorphism styling.
* **`flyer.html`**: The physical print asset generator. It sizes QR codes and elements specifically for physical standees and stickers using `@media print` CSS rules.
* **`bulk_flyer.html`**: The automated printing loop that processes multiple leads instantly.

## 3. The Telegram Bot Engine (`bot-engine/`)
To automate prospecting and lead generation, a custom Telegram bot was built using PowerShell.
* **Architecture**: The bot runs locally on the user's computer via `metrix_bot.ps1`. When it receives a command (e.g., `Pune - Bars`) from the user's phone, it executes `auto_campaign.ps1`.
* **Lead Generation**: `auto_campaign.ps1` hits the SERP API to scrape Google Maps for leads, filtering out poor ratings.
* **Image Compositing**: The bot uses Windows `.NET System.Drawing` to dynamically composite a transparent standee (`assets/test_silver_transparent.png`) onto the lead's Google Maps photo.
* **Delivery**: The bot writes a custom sales script and pushes the image, lead details, and script back to the user's phone via the Telegram API.

## 4. Cloud Deployment Strategy (AWS)
The Telegram bot is currently configured for a local Windows environment.
* **AWS Constraints**: The AWS Free Tier provides 750 hours/month, which covers exactly ONE virtual computer running 24/7.
* **Compatibility**: Because the bot uses Windows `.NET System.Drawing` to generate the mockups, it **must** run on a Windows Server instance. If the user's existing trading bot is on an AWS Linux instance (e.g., Ubuntu), the Telegram bot cannot run there without a complete rewrite of the image-generation logic into a cross-platform language (like Python with `Pillow` or Node.js with `canvas`).
* **Deployment Package**: The bot has been made portable and zipped into `deploy.zip`. It requires three environment variables on the host machine: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and `SERP_API_KEY`.

## 5. Critical Technical Rules
* **No `canvas` for QR Codes on Mobile**: The QR code rendering in `demo.html` must always use `type: "svg"` with an injected `viewBox` attribute. Canvas rendering on mobile browsers is unreliable for complex strings.
* **No CORS Blocks**: External API calls for URL shortening MUST be routed through a CORS proxy (e.g., `allorigins.win`) to prevent browser fetch blocking on Vercel.
* **Print Parity**: Any visual changes made to `flyer.html` must be manually synchronized inside the JavaScript printing loop of `bulk_flyer.html`.
