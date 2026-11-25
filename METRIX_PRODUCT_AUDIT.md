# METRIX — Product & Engineering Gap Audit (Tier 1, Tier 2, Tier 3)

> **Audit Date:** November 25, 2026  
> **Scope:** Direct code audit of `portal.html`, `portal.js`, `dashboard.html`, `live.html`, `flyer.html`, `studio.html`, `supabase_config.js`, and `admin.html`.  
> **Purpose:** Document every broken link, missing feature, and data sync gap before shipping production builds across Tiers 1, 2, and 3.

---

## 🔴 TIER 1 — STARTER (Capture, Floor Shield & Table Service)
*Target: Must work 100% reliably on two separate devices (Diner's phone at Table 4 + Restaurant Manager's phone/tablet at the floor desk).*

### 1. Broken: Live Floor Radar (`dashboard.html`) Is Static / Non-Functional
* **What happens today:** In `portal.js`, when a guest taps `Water Refill`, `Call Waiter`, `Request Bill`, or `Special Note`, `triggerServiceRequest()` writes a row to the Supabase `feedback` table with `clientName: "Resident / Seated Guest (Table X)"`.
* **What is broken:**
  * In `dashboard.html`, the **Live Floor Radar** tab (`#tab-radar` / `#radarEmptyState`) has **zero JavaScript**. Nothing ever renders there—it stays permanently on `"No pending service calls right now"`.
  * `fetchRealVIPData()` reads *all* rows from `feedback` and dumps table service alerts straight into `realVIPList` (**VIP Guest Database Vault**). This pollutes the venue's VIP CRM with fake customer entries named `"Resident / Seated Guest"`.
  * There is no live polling or Supabase Realtime subscription, no browser/mobile audio alert chime, and no **"Mark Resolved / Attended"** workflow.

### 2. Broken: Venue Settings Do Not Sync to Cloud (`dashboard.html` → `portal.html`)
* **What happens today:** `saveVenueSettings()` in `dashboard.html` only writes the Floor WhatsApp Alert Number (`cfgWhatsapp`), Google Maps Review URL (`cfgGoogleReview`), Digital Menu URL (`cfgMenuUrl`), and Venue Name (`cfgBizName`) to `localStorage` on that single browser.
* **What is broken:**
  * If an owner updates their Google Review link, Menu link, or Floor WhatsApp number in `dashboard.html`, **nothing updates in Supabase**.
  * A diner scanning the table QR on their own phone does not see the updated links unless they were hardcoded into the QR URL at print time.
  * If the manager opens `dashboard.html` on a different device (e.g., phone vs. counter laptop), all saved settings disappear.

### 3. Missing: Instant Manager Alert Delivery on Mobile
* **What happens today:** Submitting a table call in `portal.js` calls Supabase and optionally a generic `webhookUrl` if passed via URL parameter.
* **What is broken:**
  * If no Google Apps Script / custom webhook is manually wired into every QR link, **the floor manager gets zero notification on their phone** unless they stare at `dashboard.html` continuously.
  * `dashboard.html` needs:
    1. Live auto-refresh / Supabase Realtime listener with visual alert cards + optional sound chime (works on any open browser/tablet tab at the host desk).
    2. Webhook / WhatsApp alert bridge support stored in the venue's cloud config (not hardcoded per QR URL).
    3. An optional direct WhatsApp fallback / escalation link or ntfy/push notification channel for phone lock screens.

### 4. Incomplete: `dashboard.html` "Test Tabletop VIP Scan" & Cross-App Wiring
* **What happens today:** Clicking *"Test Tabletop VIP Scan"* (`openLiveDemo()`) in `dashboard.html` opens `/portal.html?name=...` without passing the venue's configured Google Review URL, Menu URL, or theme colors.
* **Also missing in `portal.html`:** While `Special Note` exists inside `Call Table Service`, there is no prominent, non-gating **"Need Quick Help / Feedback for Management?"** trigger card on the main screen to explicitly serve as the **3-Second Floor Shield** while remaining 100% compliant (no star-gating).

### 5. Incomplete: Multi-Table Printing & QR Provisioning (`flyer.html` / `live.html`)
* **What happens today:** `live.html` supports `?id=...&table=...` and passes `table` to `portal.html`, which displays `#table-badge` (`Table 04`).
* **What is missing:** In `dashboard.html` (Tab 4: Tabletop Standee Station), there is a link to `/flyer.html`, but no simple **Table Range Generator** (e.g., *"Generate printable QR set for Tables 1 to 15"*) tied directly to the venue's cloud campaign ID.

---

## 🟡 TIER 2 — GROWTH (Retention, Birthdays & Loyalty)
*Target: Turn Tier 1 captured diner data into automated repeat visits and higher weekday revenue.*

### 1. Broken: Upcoming Birthdays Counter Is Hardcoded to `0`
* **Where:** `dashboard.html` line 787 (`<div class="stat-card-val" id="statBirthdays">0</div>`).
* **What is missing:** Logic to parse `client_dob` (`DD/MM/YYYY`) across all captured VIPs, filter guests whose birthday falls in the next 7 or 30 days, and surface them in a dedicated **Birthday Action Queue**.

### 2. Missing: 1-Click Birthday & VIP Broadcast Studio (`dashboard.html`)
* **What is missing:**
  * A **1-Click "Send Birthday Treat on WhatsApp"** button beside upcoming birthday guests that opens WhatsApp pre-filled with a personalized venue message (e.g., *"Hi [Name], happy birthday week from [Venue]! Show this message for a complimentary dessert..."*).
  * A **VIP Broadcast Tab / Composer** with ready-to-use hospitality templates (*Weekend Chef Special*, *Slow Tuesday VIP Perk*, *New Menu Launch*) and audience filters.

### 3. Missing: Digital Stamp Card / Visit Loyalty (`portal.html` + `dashboard.html`)
* **What is missing:**
  * No repeat-visit stamp tracker in `portal.html` (e.g., *"Visit 5/10 times — Unlock a free coffee/dessert"*).
  * Needs lightweight phone-number lookup + **4-digit Staff/Venue PIN verification** so guests cannot tap and fake stamps themselves, working cleanly across 100% of Android and iOS browsers (no Apple Wallet lock-in).

---

## 🔵 TIER 3 — PRO (Direct Monetization, D2C Ordering & Tier Gating)
*Target: 0%-commission direct orders, table payments, and plan enforcement.*

### 1. Missing: Built-In D2C Ordering Menu & Cart (`portal.html`)
* **What is missing:** Currently `portal.html` only opens an external `menuUrl` link. There is no interactive dish menu + cart inside the portal that calculates a **transparent ₹20 METRIX Convenience Fee** line item and dispatches an itemized order directly to the venue's WhatsApp (or settles via Razorpay).

### 2. Missing: Table Payment / UPI Settlement Integration
* **What is missing:** `razorpay_config.js` exists in the repository, but is not integrated into `portal.html` for optional D2C checkout or bill settlement.

### 3. Missing: Venue Subscription Tier Control (`Starter` / `Growth` / `Pro`)
* **What is missing:** `admin.html`, `partner.html`, and `dashboard.html` do not currently store or enforce a venue's active tier (`starter`, `growth`, `pro`). Once built, Tier 1 accounts should cleanly display Tier 2/3 upgrade previews rather than broken tabs.

---

## 🗺️ Recommended Execution Sequence

1. **Step 1 (Discuss & Fix Tier 1 First):** Fix Live Floor Radar separation + real-time polling/sound chime, sync Venue Settings to Supabase so `portal.html` loads them live, and verify mobile alert flow end-to-end.
2. **Step 2 (Tier 2 Build):** Activate live Birthday Radar + 1-click WhatsApp Birthday & Broadcast Studio + PIN-protected Digital Stamp Card.
3. **Step 3 (Tier 3 Build):** Add Tier switching (`Starter` / `Growth` / `Pro`) + D2C Direct Ordering Cart with ₹20 convenience fee + WhatsApp/UPI dispatch.
