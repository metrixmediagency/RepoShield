import os
import time
import requests
import re
import urllib.parse
from io import BytesIO
from PIL import Image

TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")
API_KEY = os.environ.get("SERP_API_KEY")

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACTS_DIR = os.path.join(WORKSPACE_DIR, "artifacts")
MOCKUPS_DIR = os.path.join(ARTIFACTS_DIR, "mockups")
STANDEE_PATH = os.path.join(WORKSPACE_DIR, "assets", "test_silver_transparent.png")

os.makedirs(MOCKUPS_DIR, exist_ok=True)

def send_message(text):
    if not TOKEN or not CHAT_ID: return
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": text, "parse_mode": "Markdown"}
    requests.post(url, json=payload)

def send_photo(photo_path, caption):
    if not TOKEN or not CHAT_ID: return
    url = f"https://api.telegram.org/bot{TOKEN}/sendPhoto"
    with open(photo_path, 'rb') as photo:
        payload = {"chat_id": CHAT_ID, "caption": caption}
        requests.post(url, data=payload, files={"photo": photo})

def process_lead(result, location, is_premium):
    rating = float(result.get("rating", 0.0))
    reviews = int(result.get("reviews", 0))
    price = result.get("price", "")

    if is_premium:
        if price in ["$", "$$"]: return False
        if re.search(r'\b[1-9]\d{2}\b', price) and not re.search(r'1,000|2,000|3,000|4,000|5,000', price):
            if ',' not in price: return False

    if reviews == 0 or (3.0 <= rating <= 4.3) or reviews < 50:
        biz_name = result.get("title", "")
        safe_name = re.sub(r'[^a-zA-Z0-9]', '_', biz_name)
        image_url = result.get("thumbnail", "")
        
        mockup_saved_path = ""
        if image_url:
            try:
                img_data = requests.get(image_url).content
                bg_img = Image.open(BytesIO(img_data)).convert("RGBA")
                
                # Dark red overlay: (10, 10, 15, 210)
                overlay = Image.new('RGBA', bg_img.size, (10, 10, 15, 210))
                bg_img = Image.alpha_composite(bg_img, overlay)
                
                fg_img = Image.open(STANDEE_PATH).convert("RGBA")
                fg_width = int(bg_img.width * 0.9)
                ratio = fg_width / fg_img.width
                fg_height = int(fg_img.height * ratio)
                
                # Use standard resampling attribute for cross-version compatibility
                resample_filter = getattr(Image, 'Resampling', Image).LANCZOS
                fg_img = fg_img.resize((fg_width, fg_height), resample_filter)
                
                x = int((bg_img.width - fg_width) / 2)
                y = int(((bg_img.height - fg_height) / 2) + (bg_img.height * 0.05))
                
                bg_img.paste(fg_img, (x, y), fg_img)
                bg_img = bg_img.convert("RGB") # Remove alpha before saving as jpg
                
                mockup_saved_path = os.path.join(MOCKUPS_DIR, f"Mockup_{safe_name}.jpg")
                bg_img.save(mockup_saved_path, "JPEG")
            except Exception as e:
                print(f"Error processing image for {biz_name}: {e}")

        phone = re.sub(r'[^0-9]', '', result.get("phone", ""))
        ig_query = urllib.parse.quote(f"{biz_name} {location} Instagram")
        ig_link = f"https://www.google.com/search?q={ig_query}"
        
        encoded_name = urllib.parse.quote(biz_name)
        if result.get("place_id"):
            encoded_maps = urllib.parse.quote(f"https://search.google.com/local/writereview?placeid={result['place_id']}")
            demo_url = f"https://www.metrixmedia.agency/demo.html?name={encoded_name}&theme=dark&url={encoded_maps}"
        else:
            demo_url = f"https://www.metrixmedia.agency/demo.html?name={encoded_name}&theme=dark"
            
        raw_msg = f"Hey {biz_name} team! Sunny here from MetrixMedia. I noticed you guys have an awesome venue but you're missing out on hundreds of automated reviews. I mocked up a custom Review Portal and physical standee for your tables that forces customers to leave 5 stars, and routes complaints to your WhatsApp instead of posting publicly. Take a look at the attached concept I made for you! See the live digital demo here (Scan or Tap the QR code!): {demo_url}"
        
        wa_link = f"https://wa.me/{phone}" if phone else "No Phone Number Found"
        price_str = f" | Price: {price}" if price else ""
        
        short_caption = f"[NEW LEAD]: {biz_name}\n* Rating: {rating} Stars ({reviews} Reviews){price_str}"
        long_text = f"- WhatsApp: {wa_link}\n- Instagram: {ig_link}\n\n[COPY & PASTE SCRIPT]:\n{raw_msg}"
        
        if mockup_saved_path:
            send_photo(mockup_saved_path, short_caption)
        else:
            send_message(short_caption)
            
        send_message(long_text)
        return True
    return False

def run_campaign(location, niches):
    is_premium = any(x in niches.lower() for x in ["premium", "luxury", "fine dining"])
    niche_list = [n.strip() for n in niches.split(",")]
    
    for niche in niche_list:
        search_query = f"Premium {niche}" if is_premium else niche
        query = urllib.parse.quote(f"{search_query} in {location}")
        url = f"https://serpapi.com/search.json?engine=google_maps&q={query}&type=search&api_key={API_KEY}"
        
        try:
            resp = requests.get(url).json()
            results = resp.get("local_results", [])
            for res in results:
                print(f"Processing lead: {res.get('title')}")
                process_lead(res, location, is_premium)
        except Exception as e:
            print(f"Error fetching {niche}: {e}")
            
    send_message("Job Complete! Check your messages above for the leads.")

def main():
    if not TOKEN or not CHAT_ID or not API_KEY:
        print("CRITICAL: Environment variables missing. (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SERP_API_KEY)")
        return

    print("==========================================")
    print("  MetrixMedia Python Bot Online (Ubuntu Ready)")
    print("  Listening for commands on your phone...")
    print("==========================================")

    last_update_id = 0
    while True:
        try:
            url = f"https://api.telegram.org/bot{TOKEN}/getUpdates?offset={last_update_id + 1}&timeout=10"
            resp = requests.get(url, timeout=15).json()
            
            for update in resp.get("result", []):
                last_update_id = update["update_id"]
                msg = update.get("message", {})
                
                if str(msg.get("chat", {}).get("id")) == str(CHAT_ID) and "text" in msg:
                    text = msg["text"]
                    print(f"Received Command: {text}")
                    
                    if "hello" in text.lower():
                        reply = "*Welcome to your Metrix Command Center!*\n\nTo automatically generate leads with pre-built digital demos, simply reply in this exact format:\n\n*Location - Niches*\n\n*Examples:*\n- Goa - Bars,Cafes\n- Mumbai - Premium Restaurants\n\nI will do the prospecting, rendering, and script-writing for you instantly!"
                        send_message(reply)
                    elif "-" in text:
                        parts = text.split("-", 1)
                        loc, niches = parts[0].strip(), parts[1].strip()
                        send_message(f"Executing script for *{loc}* (Niches: *{niches}*)...\nI will send leads here as soon as they are processed.")
                        run_campaign(loc, niches)
                    else:
                        send_message("I didn't understand that command.\nMake sure to use a hyphen:\nLocation - Niche\n(e.g., Pune - Bars)")
        except requests.exceptions.RequestException:
            pass # ignore timeouts
        except Exception as e:
            print(f"Loop error: {e}")
        time.sleep(1)

if __name__ == "__main__":
    main()
