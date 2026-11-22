# METRIX Technologies — Product Roadmap & Feature Backlog

> **Last Updated:** November 2026  
> **Core Rule:** Never build Phase 2 or Phase 3 features before closing the first 10 paying clients on the Phase 1 product.

---

## 💰 PRICING TIER ARCHITECTURE (Future Upgrade — Implement After Phase 3 is Live)

The 3-tier structure follows a **Capture → Retain → Monetize** progression. Venues naturally self-upgrade as their diner database grows and they see direct revenue from it.

| | **Tier 1 — Starter** | **Tier 2 — Growth** | **Tier 3 — Pro** |
| :--- | :--- | :--- | :--- |
| **Core Job** | Capture customers | Retain & re-engage | Monetize directly |
| **Features** | VIP Capture, Floor Shield, Google Reviews, Table Service Calls | Tier 1 + WhatsApp Broadcasts, Birthday Auto-trigger, Stamp Card Loyalty | Tier 2 + D2C WhatsApp Ordering, Table Payments, 3PL Fleet Dispatch |
| **Price** | ₹2,500 / month | ₹4,500 / month | ₹7,500 / month + ₹20 D2C service fee per order |
| **Who buys** | First-time venues testing METRIX | Venues with 2–3 months of diner data wanting repeat visits | Established venues ready to eliminate Zomato / Swiggy |
| **Phase** | Live today | Phase 2 | Phase 3 |

> **D2C Service Fee Note:** The ₹20 per D2C order fee is charged to the **customer** (not the restaurant) as a transparent convenience fee — shown as a separate line item at checkout. Razorpay settles ₹20 to ONEGRV and food revenue directly to the venue. Zero RBI PA licence risk.

> **Sales Narrative:** *"We start you on Starter at ₹2,500/month. In 90 days, you will have 500–1,000 local diners in your private database. At that point, Growth at ₹4,500/month lets you broadcast directly to all of them and bring them back automatically on their birthdays. When you are ready to fully cut out Zomato — Pro handles your direct deliveries end-to-end."*

---

## ✅ PHASE 1 — Live & Deployed (Core MVP)
Features actively selling to restaurants and cafes today:

- **VIP Guest Capture:** Diner scans QR → enters Name, WhatsApp, Birthday → joins VIP Dining Club in <3 seconds.
- **3-Second Floor Shield:** Diner taps "Call Server / Water / Bill" → instant WhatsApp ping to floor manager with table number.
- **Google Review Routing:** Happy diners get 1-tap redirect to Google Maps review page.
- **Dynamic Metallic Flyer Generator:** 3-color customizable 100mm × 155mm standee PDF, print-ready, branded per venue.
- **Client Dashboard:** Venue operator view — live VIP database, CSV export, floor alert routing, Google URL config.
- **Partner Portal:** Agency partner onboarding, multi-venue portfolio management.
- **Admin Console (God Mode):** Founder impersonation, emergency overrides, global Supabase telemetry.
- **Live Demo Redirector (`live.html`):** Scanned standees hit this URL, pulls latest campaign from Supabase, redirects to custom branded portal instantly.

---

## 🔜 PHASE 2 — Next 3 to 6 Months (After First 10 Clients)

### 1. Digital Stamp Card / Punch Card Loyalty
- **What:** A "Buy 9 coffees, get 1 free" digital stamp card mechanic embedded inside the METRIX portal.
- **Why:** Directly competes with Stampmate and Apple Wallet loyalty platforms. Powerful for high-frequency venues (specialty coffee roasters, shisha lounges).
- **How:** Each venue visit, diner opens their QR portal and taps "Stamp My Card". Owner dashboard shows stamp progress per diner. Automated WhatsApp fires when reward is unlocked.
- **Dev Effort:** ~2 to 3 days.
- **Inspiration:** Stampmate, Stamp Me, Apple Wallet passes.

### 2. WhatsApp D2C Direct Ordering — Manual Bridge (Zero Dev Required)
- **What:** Once METRIX captures a diner's WhatsApp number at the table, the restaurant can instantly start receiving direct orders via WhatsApp — no portal, no tech build, no aggregator commission.
- **How it works:** Diner craves the restaurant on a Wednesday night → they already have the restaurant's WhatsApp number (shared via VIP welcome message) → they message directly → restaurant staff confirms and shares a UPI payment link → owner arranges own delivery or books Borzo/Yango on-demand.
- **METRIX's role:** We capture the relationship. The commerce happens naturally on WhatsApp. Zero build required from engineering.
- **Why Phase 2:** This is the fastest possible path to proving the anti-aggregator value proposition to restaurant owners. No dev time, no compliance overhead — just results.
- **Dev Effort:** 0 days. Already enabled the moment VIP capture is live.

### 3. WhatsApp Broadcast Campaign Engine (Owner Dashboard)
- **What:** Venue owner opens dashboard, selects diner segments (e.g., "All diners who visited in October"), types a message, hits Send.
- **Why:** Turns the captured VIP database into an active revenue channel. Owners can fill slow Tuesdays or promote seasonal specials.
- **How:** Integrates with WhatsApp Business API (360dialog or Gupshup as middleware).
- **Dev Effort:** ~1 week.

### 3. Birthday Auto-Trigger WhatsApp Engine
- **What:** 3 days before a captured diner's birthday, system automatically sends a personalized WhatsApp from the restaurant: *"🎂 Your birthday is on Friday! Chef has something special reserved for you at Peep Kitchen. Bring the gang!"*
- **Why:** Birthday tables = groups of 4 to 8 people = highest-bill tables of the month. Fully automated, zero owner effort.
- **Dev Effort:** ~2 days (Supabase scheduled function + WhatsApp API trigger).

---

## 🔭 PHASE 3 — 6 to 12 Months (Post Product-Market Fit)

### 1. Table Payment Gateway (In-Portal Bill Settlement)
- **What:** Diner can scan the QR, view their table's bill, and pay directly via UPI / Apple Pay / Card inside the METRIX portal — without waiting for a waiter to bring the POS machine.
- **Why:** Completes the full diner journey (Arrive → Scan → Order → Pay → Leave). Makes METRIX the complete table OS and dramatically increases stickiness and exit valuation.
- **Compliance Path:**
  - METRIX never touches principal funds.
  - Embed a licensed gateway (Razorpay, PhonePe for Business, or Pine Labs terminal API) inside the portal.
  - Payments route directly to venue's bank account.
  - METRIX bills venue via flat monthly SaaS — zero transaction liability.
- **Blocker:** Requires RBI-licensed payment aggregator integration (Razorpay already active under ONEGRV). Petpooja / Posist POS sync needed for bill generation.
- **Dev Effort:** ~3 to 4 weeks including compliance testing.

### 2. Geofencing / Proximity Notifications
- **What:** When a diner who has METRIX loyalty pass is within 500m of a venue, their phone lock screen shows a notification (e.g., *"🍕 You have 7/10 stamps at Peep Kitchen — you're close!"*).
- **Why:** Directly competes with Stampmate's Apple Wallet geofencing feature.
- **Feasibility Note:** Requires Apple Wallet pass generation (PKPass format) for iOS OR a lightweight PWA (Progressive Web App) with Push Notifications for Android. Pure browser portals cannot access background GPS.
- **India Market Reality:** 75% of India uses Android. PWA push notifications are the right approach, not Apple Wallet exclusively.
- **Dev Effort:** ~2 to 3 weeks.

### 3. Automated WhatsApp D2C with Catalog + 3PL Fleet Dispatch (Anti-Aggregator Full Build)
- **What:** Diners order food directly from the METRIX portal (branded as the restaurant). Payment goes direct to venue. METRIX dispatches order to kitchen and triggers 3PL fleet (Yango, Borzo, Careem) for delivery.
- **Why:** Eliminates Zomato / Swiggy 25–30% commission. Venue saves ₹30–40 per order on average.
- **Status:** Architecture fully designed (see Section 6, Business Architecture). Pending Phase 3 execution.

---

## 🧊 FROZEN / REJECTED IDEAS

| Feature | Reason Rejected / Frozen |
| :--- | :--- |
| **Canvas-based QR on mobile** | Unreliable on mobile browsers for complex strings. Use SVG with injected viewBox only. |
| **Iframe src reload on keystroke** | Causes page flicker and state resets. Use postMessage for real-time sync. |
| **Static CSS themes** | Permanently deleted. 3-color dynamic metallic engine is the locked master layout. |
| **Standalone native iOS/Android app (early)** | Kills zero-friction advantage. Web-first always. App only if a major chain demands it. |

---

*All features are logged by the METRIX Founder. Engineering decisions are final and committed to `METRIX_BUSINESS_ARCHITECTURE.md`.*  
*Corporate Entity: METRIX Technologies (A ONEGRV Enterprise)*
