import os
import subprocess
import sys

# Ensure Pillow is installed
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow is not installed. Installing it now...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFont

# Brand Colors (Hex and RGB)
BG_COLOR = (10, 15, 30)          # Deep Navy (#0A0F1E)
CARD_BG = (21, 27, 48)           # Lighter Navy (#151B30)
CARD_BORDER = (35, 45, 75)       # Border Blue
CYAN = (0, 242, 254)             # Neon Cyan (#00F2FE)
GREEN = (0, 255, 135)            # Neon Green (#00FF87)
YELLOW = (255, 179, 0)           # Neon Yellow/Orange (#FFB300)
RED = (255, 51, 102)             # Neon Red (#FF3366)
WHITE = (255, 255, 255)
GRAY = (150, 160, 180)

def get_font(font_type, size):
    """
    Load Segoe UI font on Windows with fallbacks.
    """
    font_paths = {
        "bold": "C:\\Windows\\Fonts\\segoeuib.ttf",
        "semibold": "C:\\Windows\\Fonts\\segoeuisb.ttf",
        "regular": "C:\\Windows\\Fonts\\segoeui.ttf",
        "light": "C:\\Windows\\Fonts\\segoeuil.ttf"
    }
    path = font_paths.get(font_type, font_paths["regular"])
    try:
        return ImageFont.truetype(path, size)
    except IOError:
        # Fallback to Arial or default
        fallback_names = {
            "bold": "arialbd.ttf",
            "semibold": "arial.ttf",
            "regular": "arial.ttf",
            "light": "arial.ttf"
        }
        fallback_path = fallback_names.get(font_type, "arial.ttf")
        try:
            return ImageFont.truetype(fallback_path, size)
        except IOError:
            return ImageFont.load_default()

def draw_header_footer(draw, width, height, tag_text):
    # Header Tag
    font_tag = get_font("bold", 24)
    tag_spaced = " • ".join(tag_text.upper().split())
    draw.text((80, 80), tag_spaced, font=font_tag, fill=CYAN)
    
    # Bottom brand signature
    font_brand = get_font("bold", 26)
    
    # Draw MetrixMedia
    draw.text((80, 960), "METRIX", font=font_brand, fill=WHITE)
    draw.text((195, 960), "MEDIA", font=font_brand, fill=CYAN)
    
    # Draw AEGIS PROTOCOL indicator
    draw.rounded_rectangle([750, 950, 1000, 990], radius=8, fill=None, outline=CYAN, width=2)
    draw.text((775, 958), "AEGIS PROTOCOL", font=get_font("bold", 20), fill=CYAN)

def generate_post2():
    """
    Post 2: Cafe Rating Agitation
    Headline: "Your food is a 10/10. Your Google Maps rating is a 4.1. Why?"
    """
    width, height = 1080, 1080
    img = Image.new("RGB", (width, height), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Header & Footer
    draw_header_footer(draw, width, height, "CAFE & RESTAURANT STRATEGY")
    
    # Main Headline
    font_title_bold = get_font("bold", 62)
    font_title_reg = get_font("semibold", 62)
    
    y = 190
    draw.text((80, y), "YOUR FOOD IS", font=font_title_reg, fill=WHITE)
    w_your_food = draw.textlength("YOUR FOOD IS ", font=font_title_reg)
    draw.text((80 + w_your_food, y), "10/10.", font=font_title_bold, fill=GREEN)
    
    y += 80
    draw.text((80, y), "YOUR GOOGLE RATING", font=font_title_reg, fill=WHITE)
    
    y += 80
    draw.text((80, y), "IS A", font=font_title_reg, fill=WHITE)
    w_is_a = draw.textlength("IS A ", font=font_title_reg)
    draw.text((80 + w_is_a, y), "4.1.", font=font_title_bold, fill=RED)
    w_rating = draw.textlength("4.1.", font=font_title_bold)
    draw.text((80 + w_is_a + w_rating + 15, y), "WHY?", font=font_title_bold, fill=YELLOW)
    
    # UI Card Layout
    card_left = 80
    card_top = 480
    card_right = 1000
    card_bottom = 880
    
    # Draw outer card border & fill
    draw.rounded_rectangle([card_left, card_top, card_right, card_bottom], radius=16, fill=CARD_BG, outline=CARD_BORDER, width=2)
    
    # Draw horizontal split line
    draw.line([card_left + 40, card_top + 180, card_right - 40, card_top + 180], fill=CARD_BORDER, width=2)
    
    # Title of Card
    draw.text((120, card_top + 40), "THE CRITICAL DISCONNECT", font=get_font("bold", 28), fill=CYAN)
    draw.text((120, card_top + 85), "Why Michelin-level quality gets stuck in the Google 'Danger Zone'", font=get_font("regular", 22), fill=GRAY)
    
    # Table Content - Left Column (Customer Reality)
    col1_x = 120
    row1_y = card_top + 220
    draw.text((col1_x, row1_y), "Diner Experience (Inside Cafe)", font=get_font("semibold", 24), fill=WHITE)
    draw.text((col1_x, row1_y + 45), "⭐⭐⭐⭐⭐ 10/10 Food & Vibe", font=get_font("bold", 30), fill=GREEN)
    draw.text((col1_x, row1_y + 95), "95% of happy diners leave silently.", font=get_font("regular", 20), fill=GRAY)
    
    # Table Content - Right Column (Google Maps Reality)
    col2_x = 560
    draw.text((col2_x, row1_y), "Google Maps Rating (Public)", font=get_font("semibold", 24), fill=WHITE)
    draw.text((col2_x, row1_y + 45), "⭐⭐⭐⭐☆ 4.1 Danger Zone", font=get_font("bold", 30), fill=RED)
    draw.text((col2_x, row1_y + 95), "1 disgruntled review ruins the score.", font=get_font("regular", 20), fill=GRAY)
    
    # Save image
    output_dir = "social_media"
    os.makedirs(output_dir, exist_ok=True)
    img.save(os.path.join(output_dir, "post2_cover.png"), "PNG")
    print("Generated post2_cover.png successfully.")

def generate_post3():
    """
    Post 3: Clinical Trust Filter
    Headline: "92% of new patients check Google reviews before booking a doctor."
    """
    width, height = 1080, 1080
    img = Image.new("RGB", (width, height), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Header & Footer
    draw_header_footer(draw, width, height, "CLINICAL TRUST AUDIT")
    
    # Main Headline
    font_huge_num = get_font("bold", 190)
    font_title_bold = get_font("bold", 52)
    
    y = 170
    draw.text((80, y), "92%", font=font_huge_num, fill=CYAN)
    
    y += 210
    draw.text((80, y), "OF NEW PATIENTS CHECK REVIEWS", font=font_title_bold, fill=WHITE)
    
    y += 70
    draw.text((80, y), "BEFORE BOOKING A DOCTOR.", font=font_title_bold, fill=GREEN)
    
    # Visual Box: The 3-Second Patient Filter
    card_left = 80
    card_top = 530
    card_right = 1000
    card_bottom = 890
    
    # Draw Card
    draw.rounded_rectangle([card_left, card_top, card_right, card_bottom], radius=16, fill=CARD_BG, outline=CARD_BORDER, width=2)
    
    # Draw Inner Card Header
    draw.text((120, card_top + 35), "THE 3-SECOND TRUST FILTER", font=get_font("bold", 28), fill=CYAN)
    draw.text((120, card_top + 80), "How patients filter clinics on Google Maps", font=get_font("regular", 22), fill=GRAY)
    
    # Split Line
    draw.line([card_left + 40, card_top + 130, card_right - 40, card_top + 130], fill=CARD_BORDER, width=2)
    
    # Pass Zone
    y_pass = card_top + 160
    draw.text((120, y_pass + 15), "4.5 to 5.0 Stars (Trust Zone)", font=get_font("semibold", 24), fill=WHITE)
    draw.text((120, y_pass + 55), "Patients assume clinical excellence. Bookings flow automatically.", font=get_font("regular", 20), fill=GRAY)
    
    # Draw green badge "PASS"
    draw.rounded_rectangle([760, y_pass + 15, 950, y_pass + 65], radius=8, fill=GREEN)
    draw.text((820, y_pass + 25), "PASS", font=get_font("bold", 22), fill=BG_COLOR)
    
    # Fail Zone
    y_fail = card_top + 260
    draw.text((120, y_fail + 15), "Under 4.4 Stars (Danger Zone)", font=get_font("semibold", 24), fill=WHITE)
    draw.text((120, y_fail + 55), "Patients suspect administrative issues or subpar care. They skip.", font=get_font("regular", 20), fill=GRAY)
    
    # Draw red badge "FILTERED OUT"
    draw.rounded_rectangle([720, y_fail + 15, 950, y_fail + 65], radius=8, fill=RED)
    draw.text((740, y_fail + 25), "FILTERED OUT", font=get_font("bold", 22), fill=WHITE)
    
    # Save image
    output_dir = "social_media"
    os.makedirs(output_dir, exist_ok=True)
    img.save(os.path.join(output_dir, "post3_cover.png"), "PNG")
    print("Generated post3_cover.png successfully.")

if __name__ == "__main__":
    generate_post2()
    generate_post3()
