# METRIX — Product & Engineering Audit (Tier 1, Tier 2, Mobile App & Tier 3)

> **Last Updated:** November 25, 2026  
> **Scope:** Live verification across `portal.html`, `portal.js`, `portal.css`, `menu.html`, `dashboard.html`, `admin.html`, `sales.html`, `supabase_config.js`, and `api/whatsapp-alert.js`.  
> **Purpose:** Maintain an accurate source of truth tracking every resolved Tier 1 issue, current architectural constraints, and remaining builds for Tier 2, Companion Mobile App, and Tier 3.

---

## 🔴 TIER 1 — STARTER (Customer Capture, Wi-Fi Lock & Table Operations)
**Status: ✅ RESOLVED & LOCKED IN PRODUCTION**

### What Was Fixed & Verified
1. **Live Floor Radar Separation & Audio Alerts (`✅ Fixed`):**
   * `dashboard.html` now cleanly separates `[TABLE_CALL]` and urgent red `[FLOOR_SHIELD]` rows from the VIP Guest Vault, polls every 6s, plays a Web Audio bell chime, and supports cross-device `Mark Attended` via `[ALERT_RESOLVED:<key>]`.
2. **Multi-Device Cloud Config Sync (`✅ Fixed`):**
   * `supabase_config.js` (`window.MetrixCloud`) packs/unpacks venue settings (`whatsapp`, `gmbUrl`, `menuUrl`, `ntfyTopic`, `alertWebhook`, `wifiSsid`, `wifiPass`, `vipOffer`, `vipSub`, `features`, `tier`, `status`, `ownerPassword`) in Supabase `campaigns`. Both `dashboard.html` and `admin.html` update live; `portal.html` hydrates dynamically.
3. **Table Service & Visual Menu Cleanup (`✅ Fixed`):**
   * Built dedicated `menu.html` gallery supporting dashboard-uploaded dish photos (`__METRIX_MENU_GALLERY__`) and sample dishes.
   * Removed clutter (`Food Delay`, `Food Issue`, `Wrong Item`, duplicate buttons) inside `Call Table Service` (`portal.html`/`portal.js`); streamlined to 4 service tiles + `Call Manager` + `Complaint` (`Complaint Box`).
4. **Mobile Layout & VIP-Gated Wi-Fi Security (`✅ Fixed`):**
   * Fixed mobile horizontal overflow/sideways movement in `portal.css?v=4.0`.
   * Added `Free Wi-Fi` alongside `Browse Menu` with **VIP-Gated Wi-Fi Lock ON by default (`wifiGate: true`)** so non-customers outside cannot view raw passwords without completing VIP check-in.
   * Added **8 instant Feature Control toggles** in `dashboard.html` and `admin.html`.
5. **High-Converting Safe VIP Capture Form (`✅ Fixed`):**
   * Updated default copy to **Option 1**: *"Claim Free Birthday & VIP Perks 🎁"* / *"Get complimentary birthday treats & secret chef offers"*, plus editable `vipOffer` / `vipSub` in `dashboard.html` & `admin.html`.
   * Added auto country code (`🇮🇳 +91` in India, `🇦🇪 +971` in Dubai, full A–Z tourist list), strict Indian (`^[6-9]\d{9}$`) & anti-junk validator, optional 2-tap **Birthday (Day + Month)**, expandable optional **`💍 + Add Anniversary Date` (Day + Month)**, and optional discovery source.
6. **Repeat Guest Detection, Anti-Screenshot Pass & Exact Client Isolation (`✅ Fixed`):**
   * Same-phone recognition (`Welcome Back, <Name>! ✓`), live 1.2s cloud WhatsApp repeat check (`Visit #2+`), deduplicated `VIP Guest Vault` (`🆕 NEW VIP` vs `🔁 REPEAT · X Visits` — zero bulk CSV export for venue accounts), and **Live Ticking Verification Pass** (`DD MMM · HH:MM:SS AM/PM`).
   * Tightened all `business_name=ilike.*...*` queries to exact case-insensitive `ilike.<Name>` across `portal.js`, `dashboard.html`, and `menu.html`.
7. **WhatsApp Cloud API Backend Route Built (`✅ Code Ready / ⏳ Pending Meta Keys`):**
   * Created strict server-side `api/whatsapp-alert.js` (Meta Cloud API `v21.0`, server-side `venueId` lookup, up to 3 comma-separated floor numbers) + `Test WA` button in `dashboard.html`.
   * **Action Needed Later (Ops):** Link 1 central METRIX SIM in Meta Developers and paste `WHATSAPP_PHONE_NUMBER_ID` + `WHATSAPP_ACCESS_TOKEN` into Vercel Environment Variables.

### Remaining Low-Priority Tier 1 Notes (Non-Blocking)
* **Weak Cellular Signal Optimization:** `live.html` currently loads `@supabase/supabase-js@2` from `cdn.jsdelivr.net` with a `300ms` delay before redirecting, and `portal.html`/`menu.html` rely on external Google Fonts & FontAwesome CDNs plus ~2.5 MB sample menu images. Can be streamlined (`< 1s` featherweight first paint + compressed images) whenever prioritized.
* **Venue Naming Rule:** Since `feedback` rows isolate clients by exact `business_name`, every outlet/branch must use a unique trade name until a future `venue_id` column migration is added.
* **Upgrade Button Placeholder:** Replace placeholder `919999999999` on Tier 2/3 upgrade links in `dashboard.html` (`lines 1114, 1134`) with Founder's live WhatsApp number during Tier 2 build.

---

## 🟡 TIER 2 — GROWTH / ENGAGE (Retention, Loyalty, Reviews & Geofencing Prep)
**Status: ⏳ NEXT TO BUILD (Tier 2 Lock UI & Admin Tier Switching Ready; Functional Modules Remaining)**

### Missing Modules to Build
1. **Digital VIP Stamp Card (`portal.html` + `dashboard.html` — Not Yet Built):**
   * Guest module `My Loyalty Stamp Card ⭐` (unlocked for `growth` & `pro` tiers) showing live stamps (`X / Y Visits`) synced to Supabase via WhatsApp number (`[STAMP_CHECKIN]`, `[STAMP_REDEEM]`).
   * Anti-fraud protection: **4-Digit Secret Staff PIN** + **4-Hour Cooldown Lock** + **Live Clock Verification** for reward redemption.
   * Owner settings & **Cashier Counter Quick-Stamp** box inside `dashboard.html` Tab 5.
2. **Birthday & Anniversary Radar (`dashboard.html` — `#statBirthdays` Still Static `0`):**
   * Live parser reading both **Birthday** and **Anniversary** (`Day + Month`) from `client_dob`, surfacing **`Today`**, **`Next 7 Days`**, and **`Next 30 Days`** queues with pre-written WhatsApp invites & sequential `wa.me` send tracking (`₹0` Meta Marketing cost).
3. **Post-Meal "Google Review + Check-In" Ping (`dashboard.html` — Not Yet Built):**
   * Lists Today’s Checked-In VIPs with 1-click `Send Review Ping` (`wa.me`) bundling the venue’s `gmbUrl` alongside a private management reply invitation (100% policy-compliant).
4. **Smart VIP Broadcast & Win-Back Studio (`dashboard.html` — Not Yet Built):**
   * Built-in segments (**All VIPs**, **Repeat 2+ Visits**, **30-Day Inactive Win-Back**) without exposing bulk CSV download, plus optional **"Save Cafe Contact (.vcf)"** button for native WhatsApp Business Broadcast Lists and webhook/credit-pack support.
5. **Cafe Nearby GPS & Cloud Geofence API (`dashboard.html` + `/api/nearby-venues.js` — Not Yet Built):**
   * Owner GPS Pin (`lat`, `lng`), Radius (`200m–1km`), and Nearby Deal copy in `dashboard.html`, exposed via `/api/nearby-venues.js` for the mobile app.

---

## 📱 SHARED COMPANION APP — `METRIX Rewards` (Android & iOS)
**Status: ⏳ PLANNED RIGHT AFTER TIER 2 WEB & APIs**

* **Purpose:** One shared consumer app across all partner cafes (never forced at the table—table capture stays 100% browser QR).
* **Capabilities:**
  1. **Background GPS Geofencing ("Close-By Alerts"):** Real lock-screen notifications when a diner walks within 200–500m of any METRIX partner cafe (the only reliable method on Indian Android + iOS phones).
  2. **₹0 Unlimited Push Notifications:** Slow-day & weekend offers at zero Meta ₹0.85/msg marketing fee.
  3. **Unified Stamp Card Wallet** + **Live Tier 3 Order Tracking** (`Confirmed ➔ Cooking ➔ Out for Delivery`).
* **Store Prerequisites for Publishing:** Google Play Console (`$25` one-time) + Apple Developer Account (`$99/year`), built via **React Native / Expo (EAS Cloud Build)**.

---

## 🔵 TIER 3 — PRO (0% Commission D2C Ordering, Payments & Bag Hijacking)
**Status: ⏳ PLANNED (Admin Tier Switching & Locked Preview Tab Only)**

### Missing Modules to Build
1. **Built-In D2C Ordering Menu & Cart (`portal.html`):** Interactive menu catalog with dish modifiers, transparent `Subtotal + ₹20 Convenience Fee`, and direct order dispatch (`[D2C_ORDER]`) + live status updates (`dashboard.html` ➔ Companion App).
2. **Direct UPI / Card Settlement:** Connect `razorpay_config.js` directly into direct checkout routing funds straight to venue accounts.
3. **Delivery Bag vs. Dine-In ROI Tracking:** Separate `?table=Delivery%20Bag` stickers (`flyer.html`) inside owner analytics to measure Zomato/Swiggy/Talabat customer conversion.

---

## 🗺️ Updated Execution Sequence

1. **Tier 1 (Capture & Floor Operations):** ✅ **DONE & LOCKED** *(Meta WhatsApp SIM tokens can be pasted in Vercel anytime)*.
2. **Tier 2 Web + App-Ready Cloud Backend (`⏳ NEXT`):** Build unlocked Tab 5 in `dashboard.html` (Stamp Config + Cashier Stamp, Live Birthday/Anniversary Radar, Post-Meal Review Pings, Broadcast Studio, Cafe GPS Pin) + `portal.html` Stamp Card + `/api/nearby-venues.js`.
3. **Companion Mobile App (`METRIX Rewards`):** Build Expo React Native app wired to `/api/nearby-venues.js`, Stamp Wallet, and Push Notifications (`$25` Play / `$99/yr` Apple for live store release).
4. **Tier 3 (D2C Direct Ordering + Live Order Tracking):** Build interactive cart, Razorpay UPI link, Delivery Bag ROI tagging, and real-time order tracking in Web + App.
