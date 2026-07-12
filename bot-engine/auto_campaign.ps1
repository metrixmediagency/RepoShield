param (
    [string]$Location = "Mumbai, India",
    [string]$Niches = "Bars,Cafes",
    [string]$Theme = "dark",
    [switch]$PremiumOnly,
    [string]$TelegramToken = "",
    [string]$TelegramChatId = ""
)

$API_KEY = $env:SERP_API_KEY
if (-not $API_KEY) { Write-Error "CRITICAL: SERP_API_KEY environment variable missing."; exit 1 }

$NicheList = $Niches -split ","
$WORKSPACE_DIR = (Get-Item $PSScriptRoot).Parent.FullName
$ARTIFACTS_DIR = "$WORKSPACE_DIR\artifacts"
$STANDEE_PATH = "$WORKSPACE_DIR\assets\test_silver_transparent.png"
$MOCKUPS_DIR = "$ARTIFACTS_DIR\mockups"
$HITLIST_FILE = "$ARTIFACTS_DIR\auto_hitlist.md"

if (-not (Test-Path $ARTIFACTS_DIR)) { New-Item -ItemType Directory -Path $ARTIFACTS_DIR | Out-Null }
if (-not (Test-Path $MOCKUPS_DIR)) { New-Item -ItemType Directory -Path $MOCKUPS_DIR | Out-Null }

Add-Type -AssemblyName System.Drawing

$all_leads = @()
$markdownOutput = "#  Automated Hyper-Personalized Hitlist`n`n*Generated for $Location*`n`n---\n"

foreach ($niche in $NicheList) {
    $searchQuery = if ($PremiumOnly) { "Premium $niche" } else { $niche }
    Write-Host " Scraping $searchQuery in $Location..." -ForegroundColor Cyan
    
    $query = [uri]::EscapeDataString("$searchQuery in $Location")
    $url = "https://serpapi.com/search.json?engine=google_maps&q=$query&type=search&api_key=$API_KEY"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get
        if ($response.local_results) {
            foreach ($result in $response.local_results) {
                $rating = if ($null -ne $result.rating) { [float]$result.rating } else { 0.0 }
                $reviews = if ($null -ne $result.reviews) { [int]$result.reviews } else { 0 }
                $price = if ($null -ne $result.price) { $result.price } else { "" }
                
                if ($PremiumOnly) {
                    if ($price -eq "`$" -or $price -eq "`$`$") { continue }
                    if ($price -match '\b[1-9]\d{2}\b' -and -not ($price -match '1,000|2,000|3,000|4,000|5,000')) {
                        if ($price -notmatch ',') { continue }
                    }
                }
                
                if ($reviews -eq 0 -or (($rating -ge 3.0 -and $rating -le 4.3) -or ($reviews -lt 50))) {
                    $maps_link = "N/A"
                    if ($null -ne $result.place_id) {
                        $maps_link = "https://search.google.com/local/writereview?placeid=$($result.place_id)"
                    }

                    $imageUrl = if ($result.thumbnail) { $result.thumbnail } else { "" }
                    $bizName = $result.title
                    $safeName = $bizName -replace '[^a-zA-Z0-9]', '_'
                    
                    Write-Host "    Processing lead: $bizName"
                    
                    $mockupSavedPath = ""
                    if ($imageUrl -ne "") {
                        $tempBg = "$MOCKUPS_DIR\temp_$safeName.jpg"
                        Invoke-WebRequest -Uri $imageUrl -OutFile $tempBg
                        
                        try {
                            $bgImg = [System.Drawing.Image]::FromFile($tempBg)
                            $fgImg = [System.Drawing.Image]::FromFile($STANDEE_PATH)
                            
                            $graphics = [System.Drawing.Graphics]::FromImage($bgImg)
                            $overlayColor = [System.Drawing.Color]::FromArgb(210, 10, 10, 15)
                            $overlayBrush = New-Object System.Drawing.SolidBrush($overlayColor)
                            $graphics.FillRectangle($overlayBrush, 0, 0, $bgImg.Width, $bgImg.Height)
                            
                            $fgWidth = [int]($bgImg.Width * 0.9)
                            $ratio = $fgWidth / $fgImg.Width
                            $fgHeight = [int]($fgImg.Height * $ratio)
                            $x = [int](($bgImg.Width - $fgWidth) / 2)
                            $y = [int]((($bgImg.Height - $fgHeight) / 2) + ($bgImg.Height * 0.05))
                            
                            $graphics.DrawImage($fgImg, $x, $y, $fgWidth, $fgHeight)
                            
                            $finalPath = "$MOCKUPS_DIR\Mockup_$safeName.jpg"
                            $bgImg.Save($finalPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
                            
                            $graphics.Dispose()
                            $bgImg.Dispose()
                            $fgImg.Dispose()
                            $overlayBrush.Dispose()
                            Remove-Item $tempBg
                            
                            $mockupSavedPath = $finalPath
                        } catch { }
                    }

                    $phone = ""
                    if ($null -ne $result.phone) {
                        $phone = $result.phone -replace '[^0-9]', ''
                    }

                    $igQuery = [uri]::EscapeDataString("$bizName $Location Instagram")
                    $igLink = "https://www.google.com/search?q=$igQuery"
                    
                    $encodedName = [uri]::EscapeDataString($bizName)
                    if ($null -ne $result.place_id) {
                        $encodedMapsLink = [uri]::EscapeDataString("https://search.google.com/local/writereview?placeid=$($result.place_id)")
                        $demoUrl = "https://metrixmedia.vercel.app/demo.html?name=$encodedName&theme=$Theme&url=$encodedMapsLink"
                    } else {
                        $demoUrl = "https://metrixmedia.vercel.app/demo.html?name=$encodedName&theme=$Theme"
                    }

                    $rawMessage = "Hey $bizName team! Sunny here from MetrixMedia. I noticed you guys have an awesome venue but you're missing out on hundreds of automated reviews. I mocked up a custom Review Portal and physical standee for your tables that forces customers to leave 5 stars, and routes complaints to your WhatsApp instead of posting publicly. Take a look at the attached concept I made for you! See the live digital demo here (Scan or Tap the QR code!): $demoUrl"
                    
                    if ($phone -ne "") {
                        $waLink = "https://wa.me/$phone"
                    } else {
                        $waLink = "No Phone Number Found"
                    }
                    
                    $priceStr = if ($price) { " | Price: $price" } else { "" }
                    
                    $markdownOutput += "###  Target: $bizName`n"
                    $markdownOutput += "**Rating:** $rating Stars ($reviews Reviews)$priceStr`n`n"
                    if ($mockupSavedPath -ne "") {
                        $markdownOutput += " **Custom Background Graphic:**`n![$bizName Mockup](file:///$($mockupSavedPath -replace '\\', '/'))`n`n"
                    }
                    $markdownOutput += ">  **[OPEN WHATSAPP CHAT]($waLink)**`n> `n"
                    $markdownOutput += ">  **[SEARCH INSTAGRAM PROFILE]($igLink)**`n> `n"
                    $markdownOutput += ">  **COPY-PASTE FOR DM:** `n> ```text`n> $rawMessage`n> ````n`n---\n"
                    
                    # TELEGRAM PUSH NOTIFICATION
                    if ($TelegramToken -ne "" -and $TelegramChatId -ne "") {
                        $shortCaption = "[NEW LEAD]: $bizName`n* Rating: $rating Stars ($reviews Reviews)$priceStr"
                        $longText = "- WhatsApp: $waLink`n- Instagram: $igLink`n`n[COPY & PASTE SCRIPT]:`n$rawMessage"
                        
                        if ($mockupSavedPath -ne "") {
                            $captionPath = "$MOCKUPS_DIR\temp_caption.txt"
                            [System.IO.File]::WriteAllText($captionPath, $shortCaption, (New-Object System.Text.UTF8Encoding $false))
                            & curl.exe -s -X POST "https://api.telegram.org/bot$TelegramToken/sendPhoto" -F "chat_id=$TelegramChatId" -F "photo=@$mockupSavedPath" -F "caption=<$captionPath" | Out-Null
                            if (Test-Path $captionPath) { Remove-Item $captionPath }
                        } else {
                            $shortCaptionUrlEncoded = [uri]::EscapeDataString($shortCaption)
                            $tgUrl = "https://api.telegram.org/bot$TelegramToken/sendMessage?chat_id=$TelegramChatId`&text=$shortCaptionUrlEncoded"
                            Invoke-RestMethod -Uri $tgUrl -Method Get | Out-Null
                        }
                        
                        $longTextUrlEncoded = [uri]::EscapeDataString($longText)
                        $tgUrl2 = "https://api.telegram.org/bot$TelegramToken/sendMessage?chat_id=$TelegramChatId`&text=$longTextUrlEncoded"
                        Invoke-RestMethod -Uri $tgUrl2 -Method Get | Out-Null
                    }
                }
            }
        }
    } catch {
        Write-Host "Error fetching $niche : $_"
    }
    Start-Sleep -Seconds 2
}

$markdownOutput | Set-Content -Path $HITLIST_FILE -Encoding UTF8
Write-Host "`n SUCCESS! Automation Pipeline Complete." -ForegroundColor Green
Write-Host " Open your new hitlist: $HITLIST_FILE" -ForegroundColor Yellow
