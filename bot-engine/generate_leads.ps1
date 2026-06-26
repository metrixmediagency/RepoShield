$API_KEY = "e14b3d7d90949177e20301eae605840766b2ae3bdc267e72fc8ad5d9e1688806"
$LOCATION = "Mumbai, India"
$NICHES = @("Doctors", "Dentists", "Cafes", "Bars", "Restaurants", "Salons", "Spas", "Gyms")

$all_leads = @()

foreach ($niche in $NICHES) {
    Write-Host "Searching for: $niche in $LOCATION..."
    $query = [uri]::EscapeDataString("$niche in $LOCATION")
    $url = "https://serpapi.com/search.json?engine=google_maps&q=$query&type=search&api_key=$API_KEY"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get
        if ($response.local_results) {
            $found = 0
            foreach ($result in $response.local_results) {
                $rating = if ($null -ne $result.rating) { [float]$result.rating } else { 0.0 }
                $reviews = if ($null -ne $result.reviews) { [int]$result.reviews } else { 0 }
                
                $hot_lead = "No"
                if ($reviews -eq 0) {
                    $hot_lead = "Yes (No Reviews!)"
                } elseif (($rating -ge 3.0 -and $rating -le 4.3) -or ($reviews -lt 50)) {
                    $hot_lead = "Yes (Low Rating/Reviews)"
                }

                $maps_link = "N/A"
                if ($null -ne $result.place_id) {
                    $maps_link = "https://search.google.com/local/writereview?placeid=$($result.place_id)"
                } elseif ($null -ne $result.gps_coordinates) {
                    $lat = $result.gps_coordinates.latitude
                    $lng = $result.gps_coordinates.longitude
                    $maps_link = "https://www.google.com/maps/place/$lat,$lng"
                }

                $lead = [PSCustomObject]@{
                    "Niche" = $niche
                    "Business Name" = if ($result.title) { $result.title } else { "" }
                    "Rating" = $rating
                    "Reviews" = $reviews
                    "Hot Lead (Needs Reviews)" = $hot_lead
                    "Phone" = if ($result.phone) { $result.phone } else { "N/A" }
                    "Website" = if ($result.website) { $result.website } else { "N/A" }
                    "Address" = if ($result.address) { $result.address } else { "N/A" }
                    "Maps Link" = $maps_link
                    "Image URL" = if ($result.thumbnail) { $result.thumbnail } else { "N/A" }
                }
                $all_leads += $lead
                $found++
            }
            Write-Host "   -> Found $found leads for $niche."
        }
    } catch {
        Write-Host "Error fetching $niche : $_"
    }
    
    Start-Sleep -Seconds 2
}

if ($all_leads.Count -gt 0) {
    # Sort so Hot Leads are at the top
    $sorted_leads = $all_leads | Sort-Object -Property @{Expression="Hot Lead (Needs Reviews)"; Descending=$true}, @{Expression="Rating"; Descending=$false}
    
    $filename = "Leads_$($LOCATION -replace ' ', '_' -replace ',', '').csv"
    $sorted_leads | Export-Csv -Path $filename -NoTypeInformation -Encoding UTF8
    Write-Host "`n✅ SUCCESS! CSV file saved as: $filename"
    Write-Host "🎯 Total leads generated: $($all_leads.Count)"
} else {
    Write-Host "No leads found or API failed."
}
