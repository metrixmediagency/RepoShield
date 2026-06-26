import requests
import pandas as pd
import time
import os

# --- CONFIGURATION ---
API_KEY = "e14b3d7d90949177e20301eae605840766b2ae3bdc267e72fc8ad5d9e1688806"  # We need this!
LOCATION = "Mumbai, India"    # Setting to a major city for better Maps results

# The niches we agreed on (excluding ecom since Maps is for local physical stores):
NICHES = [
    "Doctors",
    "Dentists",
    "Cafes",
    "Bars",
    "Restaurants",
    "Salons",
    "Spas",
    "Gyms"
]

def search_google_maps(query, api_key):
    print(f"Searching for: {query} in {LOCATION}...")
    url = "https://serpapi.com/search.json"
    
    params = {
        "engine": "google_maps",
        "q": f"{query} in {LOCATION}", # Combines niche and location
        "type": "search",
        "api_key": api_key,
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

def process_results(data, niche):
    leads = []
    if "local_results" in data:
        for result in data["local_results"]:
            rating = result.get("rating", 0.0)
            reviews = result.get("reviews", 0)
            
            # --- THE MAGIC FILTER ---
            # If rating is between 3.0 and 4.3, or they have less than 50 reviews, they are a HOT LEAD for a review service!
            hot_lead = "No"
            if reviews == 0:
                hot_lead = "Yes (No Reviews!)"
            elif (3.0 <= rating <= 4.3) or (reviews < 50):
                hot_lead = "Yes (Low Rating/Reviews)"

            lead = {
                "Niche": niche,
                "Business Name": result.get("title", ""),
                "Rating": rating,
                "Reviews": reviews,
                "Hot Lead (Needs Reviews)": hot_lead,
                "Phone": result.get("phone", "N/A"),
                "Website": result.get("website", "N/A"),
                "Address": result.get("address", "N/A"),
                "Maps Link": "N/A",
                "Image URL": result.get("thumbnail", "N/A")
            }
            
            # formatting maps link if Place ID exists (the gold standard for reviews)
            if result.get("place_id"):
                lead["Maps Link"] = f"https://search.google.com/local/writereview?placeid={result['place_id']}"
            else:
                gps = result.get("gps_coordinates", {})
                if gps:
                    lat = gps.get("latitude")
                    lng = gps.get("longitude")
                    lead["Maps Link"] = f"https://www.google.com/maps/place/{lat},{lng}"
                
            leads.append(lead)
    return leads

def main():
    if API_KEY == "YOUR_SERPAPI_KEY_HERE" or LOCATION == "YOUR_LOCATION_HERE":
        print("--------------------------------------------------")
        print("ERROR: Missing Information!")
        print("Please provide your API_KEY and LOCATION to the AI,")
        print("or edit this file directly to add them.")
        print("--------------------------------------------------")
        return

    all_leads = []
    for niche in NICHES:
        data = search_google_maps(niche, API_KEY)
        if data:
            leads = process_results(data, niche)
            all_leads.extend(leads)
            print(f"   -> Found {len(leads)} leads for {niche}.")
        
        # Pause for 2 seconds between searches so SerpApi doesn't block us
        time.sleep(2) 
        
    if all_leads:
        # Convert to an Excel sheet using pandas
        df = pd.DataFrame(all_leads)
        
        # Sort so the "Hot Leads" are at the very top of the Excel sheet
        df = df.sort_values(by=["Hot Lead (Needs Reviews)", "Rating"], ascending=[False, True])
        
        filename = f"Leads_{LOCATION.replace(' ', '_').replace(',', '')}.xlsx"
        
        try:
            df.to_excel(filename, index=False)
            print(f"\n✅ SUCCESS! Excel file saved as: {filename}")
            print(f"🎯 Total leads generated: {len(all_leads)}")
        except ImportError:
            print("\nWait! You need to install 'openpyxl' to save as Excel.")
            print("Run: pip install pandas openpyxl requests")
            # Fallback to CSV if Excel fails
            csv_filename = filename.replace('.xlsx', '.csv')
            df.to_csv(csv_filename, index=False)
            print(f"Saved as CSV instead: {csv_filename}")

if __name__ == "__main__":
    main()
