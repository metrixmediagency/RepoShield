# METRIX — Master 3-Tier Product Architecture Blueprint

> **Status:** Architectural Skeleton (Locked before code implementation)  
> **Rule:** Build and verify step-by-step in order: **Shared Foundation ➔ Tier 1 ➔ Tier 2 ➔ Tier 3**.

---

## 0. Shared Cloud Foundation (Connects Everything)

All screens (`portal.html`, `dashboard.html`, `admin.html`, `partner.html`, `live.html`, `flyer.html`) share two clean data layers in Supabase:

1. **Venue Cloud Configuration (`campaigns` table):**
   * Stores **Venue Identity & Theme:** `id`, `name`, `category`, `flyerBg`, `flyerAccent`, `flyerText`, `font`, `logo`.
   * Stores **Plan Tier:** `tier` (`"starter"` | `"growth"` | `"pro"`).
   * Stores **Tier 1 Operational Links:** `whatsapp`, `gmbUrl`, `menuUrl`, `alertChannel` (Push/Webhook).
   * Stores **Tier 2 Retention Config:** `stampGoal`, `stampReward`, `stampPin`, `birthdayOffer`.
   * Stores **Tier 3 D2C Config:** `d2cEnabled`, `menuItems[]`, `serviceFee` (default `20`), `razorpayLink`.
2. **Unified Activity Stream (`feedback` table — Cleanly Tagged):**
   * `[VIP_OPTIN]` ➔ VIP Guest Vault only (Name, Phone, DOB, Source)
   * `[TABLE_CALL]` ➔ Live Floor Radar (Water, Waiter, Bill)
   * `[FLOOR_SHIELD]` ➔ Live Floor Radar (Urgent Red Alert — Private Manager Help)
   * `[ALERT_RESOLVED]` ➔ Marks a Radar call attended across devices
   * `[STAMP_CHECKIN]` ➔ Digital Stamp Card visit log
   * `[D2C_ORDER]` ➔ Incoming Tier 3 direct orders

---

## 1. Guest Experience Structure (`portal.html` — Mobile Tabletop Console)

Every physical standee points to `live.html?id=<VENUE_ID>&table=<TABLE_NO>`, which loads `portal.html`. `portal.html` dynamically displays only the modules enabled for that venue's active tier:

### 🔴 Tier 1 — Starter (Always Active)
| Slot | Module Name | What It Does |
| :--- | :--- | :--- |
| **1.1** | **Header & Table Identity** | Metallic venue name, logo/icon, and `Table 04` badge. |
| **1.2** | **Join VIP Dining Club 🥂** | Captures Name, WhatsApp, Date of Birth, Discovery Source. |
| **1.3** | **Call Table Service 🛎️** | 1-tap request tiles (`Water Refill`, `Call Waiter`, `Request Bill`, `Extra Cutlery`). |
| **1.4** | **Private Floor Shield 🛡️** | Prominent *"Need Help or Issue with Order? Alert Manager Privately"* card (100% non-gating, instant escalation). |
| **1.5** | **Table Arcade ("Play While You Wait" 🎮)** | Zero-lag 1-phone Pass-and-Play games: **Couples Mode** (*This or That / Icebreakers*) & **Friends Mode** (*Who's Most Likely To / Tic-Tac-Toe*) with VIP reward prompt. |
| **1.6** | **Browse Menu 📖** | Opens venue's live synced menu URL. Automatically hidden if no menu URL is configured (never falls back to Google Maps). |

*(Public Google Maps review link is intentionally moved out of the pre-meal table screen and triggered cleanly post-meal).*

### 🟡 Tier 2 — Growth (Unlocks on `growth` & `pro`)
| Slot | Module Name | What It Does |
| :--- | :--- | :--- |
| **2.1** | **Digital VIP Stamp Card ⭐** | Guest enters WhatsApp to see visit stamps (e.g., `4 / 8`). Staff enters 4-digit Venue PIN to stamp a visit or redeem a free reward. |
| **2.2** | **Post-Meal WhatsApp Flow 📲** | Sent after the meal via 1-click/API: includes both *"Reply here if anything felt off"* and *"Share a Google Review"* transparently side by side. |

### 🔵 Tier 3 — Pro (Unlocks on `pro`)
| Slot | Module Name | What It Does |
| :--- | :--- | :--- |
| **3.1** | **Built-In D2C Ordering Menu 🛒** | Upgrades `Browse Menu` into an interactive food catalog with dish search, add-to-cart, and modifiers. |
| **3.2** | **Direct Checkout & ₹20 Fee 💳** | Shows transparent `Subtotal + ₹20 METRIX Convenience Fee`, then sends itemized order directly to venue WhatsApp / Razorpay UPI link. |

---

## 2. Restaurant Owner Cockpit Structure (`dashboard.html`)

### 🔴 Tier 1 — Starter Tabs (Active for All Venues)
| Tab | Name | Core Capabilities |
| :--- | :--- | :--- |
| **Tab 1** | **Live Floor Radar 📡** | Real-time polling/push stream of `[TABLE_CALL]` and urgent red `[FLOOR_SHIELD]` alerts, elapsed wait timer, loud service bell chime toggle, **"Mark Attended"** button, and 1-tap phone push setup (`ntfy.sh` / Telegram / Webhook). |
| **Tab 2** | **VIP Guest Vault 🥂** | Strictly clean list of verified `[VIP_OPTIN]` diners (Name, WhatsApp link, DOB, Source), search filter, 1-click CSV export. |
| **Tab 3** | **Venue Settings & Cloud Sync ⚙️** | Edits and saves Venue Name, Floor WhatsApp, Google Review URL, Menu URL, and Alert Push channel directly to Supabase `campaigns` so standees update instantaneously. |
| **Tab 4** | **Tabletop Print Station 🖨️** | Batch Table QR selector (`Table 01` – `Table 25`) wired to `live.html?id=...&table=...` + `flyer.html` launch. |

### 🟡 Tier 2 — Growth Tabs *(Shows interactive upgrade lock screen on Tier 1)*
| Tab | Name | Core Capabilities |
| :--- | :--- | :--- |
| **Tab 5** | **Birthday Radar & Post-Meal Pings 🎂** | Live `Upcoming Birthdays (7d / 30d)` calculator, 1-click **"Send Birthday Treat on WhatsApp"**, and **"Today's Diners — Send Post-Meal Check-in & Review Ping"**. |
| **Tab 6** | **VIP Broadcast Studio 📢** | Filter VIPs (`All`, `This Month Birthdays`, `Repeat Visitors`), pre-written promo templates (*Slow Tuesday Special*, *Weekend Catch*), rapid WhatsApp launch queue. |
| **Tab 7** | **Stamp Card Config 🏆** | Set stamp target (e.g. `8 visits`), reward text, 4-digit Staff Verification PIN, and view repeat visit stats. |

### 🔵 Tier 3 — Pro Tabs *(Shows interactive upgrade lock screen on Tier 1/2)*
| Tab | Name | Core Capabilities |
| :--- | :--- | :--- |
| **Tab 8** | **D2C Menu & Direct Orders 🍽️** | Manage digital menu items/prices, toggle D2C ordering live, monitor incoming `[D2C_ORDER]` tickets, and track commission saved vs. Zomato/Swiggy. |

---

## 3. Operational Role Hierarchy (Locked 5-Door Separation)

| Who | Exact Page | Core Operational Responsibility |
| :--- | :--- | :--- |
| **Founder (Superior Control)** | `admin.html` | Overarching business HQ: network telemetry, emergency overrides, **Tier 1 / 2 / 3 upgrades & downgrades**, and sales commission payouts. |
| **All Sales & Client Onboarding** | `sales.html` | **Every direct sale and client onboarding happens here.** Reps/Founder pitch, select initial **Tier (1/2/3)**, provision venue credentials + standee ID in Supabase, and track commissions. |
| **Marketing Agencies** | `partner.html` | Strictly for agency partners (e.g. Blurb, GrowthGravy) managing their ongoing portfolio of client venues. |
| **Restaurant Owners / Floor Team** | `dashboard.html` | Client cockpit where owners access Live Floor Radar, VIP Vault, Settings, and unlocked Tier 2/3 benefits. |
| **Seated Diners** | `portal.html` | Mobile tabletop screen dynamically displaying features matching the venue's active Tier (`starter` / `growth` / `pro`). |

* Switching a venue's tier in `admin.html` (or provisioning via `sales.html`) updates Supabase immediately—unlocking or locking Tier 2 & Tier 3 features across both `portal.html` and `dashboard.html` automatically.

