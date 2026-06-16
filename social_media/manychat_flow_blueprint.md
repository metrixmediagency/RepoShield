# 🤖 ManyChat Flow Configuration Blueprint - @MetrixMedia Instagram Funnel
**Target Audience**: MetrixMedia Marketing & Social Media Management  
**Campaign Objective**: Automatically capture leads, dynamically generate review gating portals for prospects, and sync leads to Supabase.  
**Related Workspace Files**:
* [portal.html](file:///c:/Users/sunny/.gemini/antigravity/scratch/MetrixMedia/portal.html) (Gating Portal Frontend)
* [flyer.html](file:///c:/Users/sunny/.gemini/antigravity/scratch/MetrixMedia/flyer.html) (Standee/Flyer Builder Frontend)
* [leads.js](file:///c:/Users/sunny/.gemini/antigravity/scratch/MetrixMedia/api/leads.js) (Sync Webhook Endpoint)
* [instagram_automation_roadmap.md](file:///c:/Users/sunny/.gemini/antigravity/scratch/MetrixMedia/social_media/instagram_automation_roadmap.md) (Operations Roadmap)

---

## 📋 1. Custom User Fields (CUFs) Configuration
Configure the following Custom User Fields inside the **ManyChat Settings > Custom Fields** panel before building the conversation flows. These fields store prospect data collected during the conversation and are used to construct the dynamic demo links.

| ManyChat Field Name | Data Type | System Mapping / Description | Example Captured Value |
| :--- | :--- | :--- | :--- |
| `mm_business_name` | Text | The official public name of the prospect's business. | `Bean & Brew Cafe` |
| `mm_business_email` | Text | The email address where private customer complaints are sent. | `feedback@beanandbrew.com` |
| `mm_gmb_url` | Text | The business's current Google Maps review generation URL. | `https://gmap.link/review/beanandbrew` |
| `mm_user_phone` | Phone | The mobile contact number of the business owner/manager. | `+919876543210` |
| `mm_niche` | Text | The category identifier (used for portal styling & icons). | `cafe` |
| `mm_accent_color` | Text | Hex color code matching the business's brand identity. | `#FFB300` |
| `mm_campaign_type` | Text | The campaign layout format (defaults to `gmb`). | `gmb` |
| `mm_portal_demo_url` | Text | The generated dynamic review portal demo URL. | `https://metrixmedia.agency/portal.html...` |
| `mm_flyer_demo_url` | Text | The generated dynamic standee/flyer demo URL. | `https://metrixmedia.agency/flyer.html...` |

---

## ⚡ 2. Trigger Keyword Configuration
We utilize three specific trigger keywords corresponding to the agency launch content calendar. Configure these under **Automation > Keywords** in ManyChat.

```mermaid
graph TD
    UserDM[Incoming Instagram DM] -->|Keyword Match| Match{Check Keyword}
    Match -->|"CAFE" (Case-Insensitive) <br> Message is or Contains| CafeFlow[Init Cafe Actions]
    Match -->|"CLINIC" (Case-Insensitive) <br> Message is or Contains| ClinicFlow[Init Clinic Actions]
    Match -->|"AEGIS" (Case-Insensitive) <br> Message is or Contains| AegisFlow[Niche Selection Quick Reply]
    
    InitActions[Set CUFs:<br>mm_niche, mm_accent_color, mm_campaign_type]
    
    CafeFlow -->|Auto-Set| CafeSet[mm_niche: 'cafe'<br>mm_accent_color: '#FFB300'<br>mm_campaign_type: 'gmb']
    ClinicFlow -->|Auto-Set| ClinicSet[mm_niche: 'dental'<br>mm_accent_color: '#00FF87'<br>mm_campaign_type: 'gmb']
    AegisFlow -->|User Selects Niche| InitActions
```

### Keyword Setup Details:
1. **Keyword: `CAFE`**
   * **Rule**: Message is `CAFE` OR Message contains `CAFE` (case-insensitive).
   * **Initial Action Block**: 
     - Set Custom Field `mm_niche` to `cafe`
     - Set Custom Field `mm_accent_color` to `#FFB300` (Warm Cafe Amber)
     - Set Custom Field `mm_campaign_type` to `gmb`
   * **Outcome**: Skips category selection and jumps directly to the **Cafe-Specific Copy Flow**.

2. **Keyword: `CLINIC`**
   * **Rule**: Message is `CLINIC` OR Message contains `CLINIC` (case-insensitive).
   * **Initial Action Block**:
     - Set Custom Field `mm_niche` to `dental` (Matches standard clinical tooth icon in `portal.js`)
     - Set Custom Field `mm_accent_color` to `#00FF87` (Clinical Green)
     - Set Custom Field `mm_campaign_type` to `gmb`
   * **Outcome**: Skips category selection and jumps directly to the **Clinic-Specific Copy Flow**.

3. **Keyword: `AEGIS`**
   * **Rule**: Message is `AEGIS` OR Message contains `AEGIS` (case-insensitive).
   * **Initial Action Block**: Prompts the user with a Niche Selector Card to set parameters before starting the question funnel.

---

## 🗺️ 3. Step-by-Step Conversational Logic Mapping
Below is the block-by-block progression mapping of the Instagram DM funnel.

```mermaid
flowchart TD
    Start([Start Trigger]) --> Block1{Which Trigger?}
    
    %% Niche Paths
    Block1 -->|Keyword: CAFE| InitCafe[Action: Set Cafe Variables] --> Block2Cafe[Ask Business Name]
    Block1 -->|Keyword: CLINIC| InitClinic[Action: Set Clinic Variables] --> Block2Clinic[Ask Business Name]
    Block1 -->|Keyword: AEGIS| Block1A[Niche Selector Quick Reply]
    
    %% General Selector
    Block1A -->|Button: Cafe/Restaurant| SelectCafe[Action: Set Cafe Variables] --> Block2Cafe
    Block1A -->|Button: Dental Clinic| SelectDental[Action: Set Dental Variables] --> Block2Clinic
    Block1A -->|Button: Salon & Spa| SelectSalon[Action: Set Salon Variables] --> Block2Salon[Ask Business Name]
    Block1A -->|Button: Other Business| SelectOther[Action: Set General Variables] --> Block2Gen[Ask Business Name]
    
    %% Input Questions
    Block2Cafe -->|Save: mm_business_name| Block3Cafe[Ask Business Email]
    Block2Clinic -->|Save: mm_business_name| Block3Clinic[Ask Business Email]
    Block2Salon -->|Save: mm_business_name| Block3Salon[Ask Business Email]
    Block2Gen -->|Save: mm_business_name| Block3Gen[Ask Business Email]

    %% Email Capture & Validation
    Block3Cafe & Block3Clinic & Block3Salon & Block3Gen -->|Save & Validate: mm_business_email| Block4[Ask Google Maps URL]
    
    %% URL Capture
    Block4 -->|Save & Validate: mm_gmb_url| Block5[Ask Phone Number]
    
    %% Phone Capture
    Block5 -->|Save: mm_user_phone| ActionWebhook[Action Block: External Request POST]
    
    %% Webhook Sync
    ActionWebhook -->|Success 200 OK| MapResponse[Map Response Payload to CUFs:<br>mm_portal_demo_url & mm_flyer_demo_url]
    MapResponse --> DeliveryMessage[Send Dynamic Demo Links Card]
    
    %% Fallback
    ActionWebhook -->|Failed/Timeout| ManualURLGenerator[Fallback Action Block:<br>Construct URLs locally in ManyChat]
    ManualURLGenerator --> DeliveryMessage
```

---

## ✍️ 4. Niche-Specific Copywriting & Conversation Blocks

### Block 1A: The Niche Selector (Trigger: `AEGIS`)
> 🌟 **Chatbot**: "Hey there! Let's get your business out of the review 'Danger Zone' and generate your custom review-gating portal. 
> 
> First, which category describes your business best?"
> 
> * `[☕ Cafe / Restaurant]` -> (Sets `mm_niche: cafe`, `mm_accent_color: #FFB300`)
> * `[👩‍⚕️ Dental Practice]` -> (Sets `mm_niche: dental`, `mm_accent_color: #00FF87`)
> * `[✂️ Hair Salon / Spa]` -> (Sets `mm_niche: salon`, `mm_accent_color: #FF3366`)
> * `[🏢 Other Local Business]` -> (Sets `mm_niche: other`, `mm_accent_color: #00F2FE`)

---

### Step 2: Name Collection (Branches based on niche)

* **☕ Cafe / Restaurant Niche**:
  > 🌟 **Chatbot**: "Awesome! Let's cook up something great. What is the official name of your Cafe or Restaurant? *(Type the name exactly as you'd like it to appear on your portal)*"
  > 
  > 👉 *Wait for User Response. Save to `mm_business_name`.*

* **👩‍⚕️ Dental / Medical Niche**:
  > 🌟 **Chatbot**: "Understood. Let's protect your clinic's patient trust. What is the official name of your Dental Clinic or Medical Practice?"
  > 
  > 👉 *Wait for User Response. Save to `mm_business_name`.*

* **🏢 General/Other Niche**:
  > 🌟 **Chatbot**: "Got it! Let's lock in your reputation. What is the official name of your business?"
  > 
  > 👉 *Wait for User Response. Save to `mm_business_name`.*

---

### Step 3: Email Collection & Validation (Universal)
ManyChat prompts for a reply type of **Email**. If the text entered does not contain an `@` or domain, ManyChat triggers the Custom Error Path.

> 🌟 **Chatbot**: "Perfect. What is your business email address? 
> 
> 📩 *We will route private feedback (1-3 star customer complaints) directly to this address so you can handle issues privately before they go public.*"
> 
> 👉 *Wait for User Response. Save to `mm_business_email`.*
> 
> ⚠️ **Custom Error Path (If Invalid Email)**: 
> "Oops! That doesn't look like a valid email. Please enter a complete address (e.g., owner@yourcafe.com) so you don't miss customer alerts."

---

### Step 4: Google Maps Review Link Collection (Universal)
ManyChat prompts for a reply type of **URL**. If the user enters raw text without `http` or `google`, trigger the error helper.

> 🌟 **Chatbot**: "Now, paste your current **Google Maps Review Link**. 
> 
> 🔗 *This is where we will instantly route your 5-star happy customers to post their public reviews. (If you don't have it handy, you can paste your main Google Maps profile link, or just type 'google.com' for now and we can update it later!)*"
> 
> 👉 *Wait for User Response. Save to `mm_gmb_url`.*
> 
> ⚠️ **Custom Error Path (If Invalid URL)**:
> "Hmm, that URL looks incomplete. Make sure it starts with http:// or https://, or just type 'https://google.com' to bypass this step for the demo!"

---

### Step 5: Phone Number Collection (Universal)
ManyChat prompts for a reply type of **Phone**.

> 🌟 **Chatbot**: "Lastly, what is the best mobile number to reach you? 
> 
> 📱 *We will use this to coordinate sending your printed counter standee once your portal demo is ready.*"
> 
> 👉 *Wait for User Response. Save to `mm_user_phone`.*

---

## 🔗 5. Webhook & Database Sync Integration

Once all variables are saved to Custom User Fields, create an **External Request** block in ManyChat. This calls our vercel serverless function to write the data to the campaigns table in Supabase and generates the exact demo links.

### Webhook Configuration Setup:
* **Request Type**: `POST`
* **Request URL**: `https://metrixmedia.agency/api/leads` *(or Vercel production deployment URL)*
* **Headers**:
  * `Content-Type: application/json`
  * `Authorization: Bearer sb_publishable_b9x83p-5jrIoFJnYYGMWFg_zBKv8JHC` *(Our database authentication token)*

### Request JSON Payload Body:
Configure the body in ManyChat as **JSON** and insert the merge tags:
```json
{
  "name": "{{mm_business_name}}",
  "email": "{{mm_business_email}}",
  "phone": "{{mm_user_phone}}",
  "gmb_link": "{{mm_gmb_url}}",
  "source": "Instagram DM",
  "niche": "{{mm_niche}}",
  "color": "{{mm_accent_color}}"
}
```

### Response Mapping (Crucial):
On a successful `200 OK` response from `/api/leads.js`, ManyChat must parse the JSON response keys and map them back to the Custom User Fields:

1. Map `$.portalUrl` to Custom User Field `mm_portal_demo_url`
2. Map `$.flyerUrl` to Custom User Field `mm_flyer_demo_url`

> [!NOTE]
> In case the backend webhook times out or fails (e.g. DNS failure or Supabase downtime), configure a **Fallback Path** in ManyChat that uses the ManyChat Action block to build the portal URL locally:
> `mm_portal_demo_url` = `https://metrixmedia.agency/portal.html?name={{mm_business_name}}&url={{mm_gmb_url}}&email={{mm_business_email}}&category={{mm_niche}}&color={{mm_accent_color_urlencoded}}&demo=true`
> *(Note: Custom parameters must be URL-encoded where possible; ManyChat does this automatically when rendering user variables inside buttons).*

---

## 🚚 6. Demo Delivery & Call to Action (CTA)

Once the response is mapped (or fallback URL is constructed), send the final card carousel in the DMs containing the customized links.

### Niche-Specific Delivery Scripts:

* **☕ Cafe / Restaurant Niche Delivery Card**:
  > 🌟 **Chatbot**: "⚡ **YOUR PORTAL IS LIVE!** 
  > 
  > I've generated your custom Cafe Review Gating demo and designed your billing counter tent card.
  > 
  > Tap the buttons below on your phone to scan, test, and view your assets:"
  > 
  > * `[📱 Open Live Cafe Demo]` -> Link: `{{mm_portal_demo_url}}`
  > * `[🖨️ Print Counter Standee]` -> Link: `{{mm_flyer_demo_url}}`
  > 
  > **How to Test the Demo**:
  > 1. Open the portal. Tap **5 Stars**. You'll see how happy diners are redirected to Google.
  > 2. Open it again. Tap **2 Stars**. Type a fake complaint. Submit it, and check your email inbox at `{{mm_business_email}}`. You'll see the complaint arrived instantly and privately!

* **👩‍⚕️ Dental / Medical Niche Delivery Card**:
  > 🌟 **Chatbot**: "⚡ **YOUR CLINICAL REPUTATION SYSTEM IS READY!** 
  > 
  > I've generated your HIPAA-compliant Patient Feedback Portal and reception desk standee mockup. 
  > 
  > Tap below to preview how it looks for your practice:"
  > 
  > * `[🏥 Open Practice Portal]` -> Link: `{{mm_portal_demo_url}}`
  > * `[🖨️ View Reception Standee]` -> Link: `{{mm_flyer_demo_url}}`
  > 
  > **Testing the Patient Filter**:
  > * Try submitting a **5-star** rating to see the Google routing.
  > * Try submitting a **1-star** patient grievance (e.g. billing or delay) to confirm it sends a private manager alert to `{{mm_business_email}}` and bypasses Google entirely.

---

## 🔬 7. Dry-Run Quality Assurance Checklist

Before scheduling Instagram posts directing users to keywords, the SMM and CEO must run this dry-run checklist in the ManyChat Sandbox:

- [ ] **Keyword Triggers**: Send `CAFE` and `CLINIC` from a personal account. Ensure that the bot skips category selection and sets correct brand colors (`#FFB300` and `#00FF87` respectively).
- [ ] **Emoji & Whitespace Tolerance**: Ensure that sending `cafe ☕` or `  clinic  ` still triggers the respective flows.
- [ ] **Valid URL Formatting**: Verify that typing `www.mybusiness.com` is accepted or handled by the ManyChat custom error handler.
- [ ] **Dynamic Webhook Integrity**: Confirm that database records are successfully inserted in the `campaigns` table under the generated `mc_...` ID. Check this by logging into [admin.html](file:///c:/Users/sunny/.gemini/antigravity/scratch/MetrixMedia/admin.html) and verifying that the trial campaign shows up.
- [ ] **Print flyer Asset Check**: Open the flyer demo link. Verify that the QR code loads correctly pointing to the gating portal, and the Category Icon displays the coffee mug (`fa-mug-hot`) for cafes or the tooth (`fa-tooth`) for dental clinics.
