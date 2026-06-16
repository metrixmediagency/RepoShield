# 🤖 ManyChat Flow Configuration Blueprint - Universal Lead Funnel

**Campaign Goal**: Bypassing ManyChat Pro costs ($15+/month) by setting up a single, 100% free universal DM redirect trigger that routes all prospects to our custom lead capture form (`try.html`).

---

## ⚡ 1. The Universal Trigger Setup
Instead of building complex question blocks and saving data inside ManyChat (which requires a paid Pro subscription), we configure **one single keyword trigger rule** inside ManyChat.

### Trigger Settings:
* **Automation Type**: Keywords / DM Triggers
* **Condition**: Message **is** or **contains** (case-insensitive) any of the following:
  * `AEGIS`
  * `CAFE`
  * `CLINIC`
  * `ZOMATO`
  * `SWIGGY`
  * `AMAZON`
  * `FLIPKART`
  * `MEESHO`
  * `SELLER`

---

## 💬 2. The Universal DM Response Block
When a user triggers the chatbot with any of the launch keywords, they receive a single, high-impact message that fits every business niche (Cafes, Restaurants, Clinics, Salons, or Shops).

### DM Text:
> "Hey there! 🛡️ Let's get your business out of the Google Maps review 'Danger Zone' and generate your custom review-gating portal.
> 
> Click the button below to set up your profile and generate your live review portal + custom desk standee in 10 seconds!"

### Button Configuration:
* **Button Text**: `🛡️ Generate Free Demo`
* **Button Action**: Open Website
* **Target URL**: `https://metrixmedia.vercel.app/try.html`

---

## ⚙️ 3. How the Form Handles Niches Dynamically
When the prospect clicks the button and opens the live web form [try.html](file:///c:/Users/sunny/.gemini/antigravity/scratch/MetrixMedia/try.html), the page handles all custom niche variables dynamically:

1. **Information Captured**: Business Name, Email, Google Maps URL.
2. **Category Selection**: The prospect clicks their category on the form's interactive grid, which automatically maps niche-specific styles:
   * **Cafe / Eatery**: Sets niche to `cafe`, icon to `fa-mug-hot`, and accent color to `#FFB300` (Warm Amber).
   * **Dental / Clinic**: Sets niche to `dental`, icon to `fa-tooth`, and accent color to `#00FF87` (Clinical Green).
   * **Salon / Spa**: Sets niche to `salon`, icon to `fa-scissors`, and accent color to `#FF3366` (Vibrant Pink/Red).
   * **Other Business**: Sets niche to `other`, icon to `fa-store`, and accent color to `#00F2FE` (Cyan Tech).
3. **Database Insertion**: The form sends a POST request to `/api/leads.js` which logs the prospect in Supabase and maps the correct setup price (e.g. Rs 1,999 for Cafes vs Rs 2,499 for Clinics).
4. **Instant Link Generation**: The portal loads the customized links right in the browser, showing:
   * **Your Portal**: `https://metrixmedia.vercel.app/portal.html?name=[Name]&category=[Niche]&color=[Color]&email=[Email]`
   * **Your Standee**: `https://metrixmedia.vercel.app/flyer.html?name=[Name]&category=[Niche]&color=[Color]&portalUrl=[PortalUrl]`

---

## 🔬 4. Dry-Run Quality Assurance Checklist
Verify the following steps to ensure the entire flow is working:

- [ ] **Keyword Test**: DM `CAFE`, `CLINIC`, or `AEGIS` to your profile from a personal account. Ensure that you receive the universal message and link.
- [ ] **Form Submission**: Click the button, fill in test details on `try.html`, select **Dental / Clinic**, and click submit.
- [ ] **Supabase Verification**: Log in to your [admin.html](file:///c:/Users/sunny/.gemini/antigravity/scratch/MetrixMedia/admin.html) dashboard and confirm the lead is captured and correct pricing is registered.
- [ ] **Flyer Icon Check**: Open the generated flyer. Verify that selecting "Dental / Clinic" printed a tooth icon on the standee flyer, while selecting "Cafe / Eatery" printed a coffee cup.
