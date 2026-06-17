Add-Type -AssemblyName System.Drawing

# Setup paths
$outputDir = Join-Path $PSScriptRoot ""
if (-not (Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir | Out-Null }

# Colors
$bgColor = [System.Drawing.Color]::FromArgb(10, 15, 30)
$cardBg = [System.Drawing.Color]::FromArgb(21, 27, 48)
$cyan = [System.Drawing.Color]::FromArgb(0, 242, 254)
$green = [System.Drawing.Color]::FromArgb(0, 255, 135)
$yellow = [System.Drawing.Color]::FromArgb(255, 179, 0)
$red = [System.Drawing.Color]::FromArgb(255, 51, 102)
$white = [System.Drawing.Color]::FromArgb(255, 255, 255)
$gray = [System.Drawing.Color]::FromArgb(150, 160, 180)

$bgBrush = New-Object System.Drawing.SolidBrush($bgColor)
$cardBrush = New-Object System.Drawing.SolidBrush($cardBg)
$cyanBrush = New-Object System.Drawing.SolidBrush($cyan)
$greenBrush = New-Object System.Drawing.SolidBrush($green)
$yellowBrush = New-Object System.Drawing.SolidBrush($yellow)
$redBrush = New-Object System.Drawing.SolidBrush($red)
$whiteBrush = New-Object System.Drawing.SolidBrush($white)
$grayBrush = New-Object System.Drawing.SolidBrush($gray)

$cardBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(35, 45, 75), 4)
$cyanPen = New-Object System.Drawing.Pen($cyan, 4)
$greenPen = New-Object System.Drawing.Pen($green, 4)
$redPen = New-Object System.Drawing.Pen($red, 4)

# Fonts
$fontFamily = "Segoe UI"
$fontFamilyBold = "Segoe UI"

function Get-Font ($family, $size, $style) {
    $fontStyle = [System.Drawing.FontStyle]::Regular
    if ($style -eq "bold") {
        $fontStyle = [System.Drawing.FontStyle]::Bold
    }
    return New-Object System.Drawing.Font($family, $size, $fontStyle, [System.Drawing.GraphicsUnit]::Pixel)
}

$fontHeader = Get-Font $fontFamilyBold 32 "bold"
$fontHook = Get-Font $fontFamilyBold 68 "bold"
$fontSub = Get-Font $fontFamily 34 "regular"
$fontCTA = Get-Font $fontFamilyBold 42 "bold"

function Draw-ReelHeaderFooter ($g, $tagText) {
    # Spaced header tag
    $parts = $tagText.ToUpper() -split " "
    $tagSpaced = $parts -join "  •  "
    $g.DrawString($tagSpaced, $fontHeader, $cyanBrush, 100, 120)
    
    # Bottom brand signature
    $g.DrawString("METRIX MEDIA", $fontHeader, $whiteBrush, 100, 1750)
    $g.DrawString("AEGIS PROTOCOL", $fontHeader, $cyanBrush, 680, 1750)
}

# Helper function for rounded rects
function Get-RoundedRectanglePath ($rect, $radius) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2
    $size = New-Object System.Drawing.SizeF($diameter, $diameter)
    $arc = New-Object System.Drawing.RectangleF($rect.Location, $size)
    $path.AddArc($arc, 180, 90)
    $arc.X = $rect.Right - $diameter
    $path.AddArc($arc, 270, 90)
    $arc.Y = $rect.Bottom - $diameter
    $path.AddArc($arc, 0, 90)
    $arc.X = $rect.Left
    $path.AddArc($arc, 90, 90)
    $path.CloseFigure()
    return $path
}

function Generate-Reel ($fileName, $tag, $row1, $row2, $row3, $row3Color, $subText, $ctaText) {
    # 9:16 Aspect Ratio (1080 x 1920)
    $bmp = New-Object System.Drawing.Bitmap(1080, 1920)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    $g.Clear($bgColor)
    
    # Draw a thin neon border around the reel
    $borderPen = $cyanPen
    if ($row3Color -eq "red") { $borderPen = $redPen }
    if ($row3Color -eq "green") { $borderPen = $greenPen }
    $g.DrawRectangle($borderPen, 30, 30, 1020, 1860)
    
    Draw-ReelHeaderFooter $g $tag
    
    # Draw Hook rows
    $y = 350
    $g.DrawString($row1, $fontHook, $whiteBrush, 100, $y)
    $y += 100
    $g.DrawString($row2, $fontHook, $whiteBrush, 100, $y)
    
    $colorBrush = $cyanBrush
    if ($row3Color -eq "red") { $colorBrush = $redBrush }
    if ($row3Color -eq "green") { $colorBrush = $greenBrush }
    
    $y += 100
    $g.DrawString($row3, $fontHook, $colorBrush, 100, $y)
    
    # Draw Subtitle description box
    $rect = New-Object System.Drawing.RectangleF(100, 750, 880, 420)
    $path = Get-RoundedRectanglePath $rect 24
    $g.FillPath($cardBrush, $path)
    $g.DrawPath($cardBorderPen, $path)
    $path.Dispose()
    
    $g.DrawString("THE PROBLEM:", $fontHeader, $redBrush, 140, 790)
    $g.DrawString($subText, $fontSub, $whiteBrush, 140, 845)
    
    # Draw Rating stars in the middle
    $yStars = 1240
    $starFont = Get-Font $fontFamily 85 "regular"
    # Stars characters
    $starSolid = [char]0x2605
    $starEmpty = [char]0x2606
    
    $starsText = "$starSolid $starSolid $starSolid $starSolid $starEmpty"
    if ($row3Color -eq "green") {
        $starsText = "$starSolid $starSolid $starSolid $starSolid $starSolid"
    }
    $g.DrawString($starsText, $starFont, $yellowBrush, 100, $yStars)
    
    # Draw CTA Banner
    $rectCTA = New-Object System.Drawing.RectangleF(100, 1450, 880, 180)
    $pathCTA = Get-RoundedRectanglePath $rectCTA 24
    $g.FillPath($cardBrush, $pathCTA)
    $g.DrawPath($cyanPen, $pathCTA)
    $pathCTA.Dispose()
    
    $g.DrawString("👉 THE AEGIS ROUTING SYSTEM:", $fontHeader, $cyanBrush, 140, 1480)
    $g.DrawString($ctaText, $fontCTA, $greenBrush, 140, 1530)
    
    $bmp.Save((Join-Path $outputDir $fileName), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $g.Dispose()
}

# Generate the 8 July Reels
Generate-Reel "reel1_cappuccino.png" "CAFE & RESTAURANT REPUTATION" "THE ₹10,000" "CAPPUCCINO" "REVIEW." "red" "One negative customer review about a waiter or latte`ndrags your GMB rating down, causing tourists`nto select the competitor next door." "COMMENT 'CAFE' FOR YOUR PORTAL"

Generate-Reel "reel2_waiting.png" "CLINICAL TRUST AUDIT" "92% OF PATIENTS" "CHECK REVIEWS" "BEFORE BOOKING." "cyan" "A rating below 4.4 stars costs local clinics`nan average of 3-5 bookings weekly due to`nadministrative bottleneck complaints." "COMMENT 'CLINIC' FOR DIGITAL QR PDF"

Generate-Reel "reel3_zomato.png" "DELIVERY APP DEFLECTION" "ZOMATO SPILLED" "GRAVY APP" "PENALTIES." "red" "Rider traffic delays and leaked containers drag`nyour kitchen score below 4.0, causing the`nalgorithm to drop order volume by 60%." "COMMENT 'ZOMATO' FOR SMART INSERTS"

Generate-Reel "reel4_wellness.png" "WELLNESS & BEAUTY SYSTEM" "DAMP TOWELS" "AND GYM MEMBER" "CHURN." "red" "Spas and gyms lose premium monthly member bookings`nbecause of minor facility complaints going public`ninstantly on Google Maps listings." "COMMENT 'SALON' FOR YOUR SHIELD"

Generate-Reel "reel5_gating.png" "GOOGLE COMPLIANCE AUDIT" "HOW REVIEW" "GATING WORKS" "COMPLIANTLY." "green" "We provide patients/diners choice. Happy guests`nrate publicly; unsatisfied complaints are sent`nprivate confidential to management." "COMMENT 'AEGIS' FOR compliance check"

Generate-Reel "reel6_confidentiality.png" "CLINICAL TRUST AUDIT" "KEEPING COMPLAINTS" "SECURE AND" "CONFIDENTIAL." "cyan" "Billing disputes and schedule bottlenecks don't`nbelong on Google. Route them privately to`nmaintain professional medical authority." "COMMENT 'CLINIC' TO SET UP PORTAL"

Generate-Reel "reel7_delays.png" "DELIVERY APP DEFLECTION" "RIDER DELAYS" "VS KITCHEN" "RATINGS." "red" "Separate delivery issues from kitchen quality.`nHappy orders review on Zomato Swiggy. Bad riders`nfeedback goes direct to manager portal." "COMMENT 'SWIGGY' TO PROTECT ORDERS"

Generate-Reel "reel8_rescue.png" "E-COMMERCE SELLER SHIELD" "RESCUING A 3.9" "STAR PRODUCT" "LISTING." "red" "Low stars double your FBA PPC ad costs and`ndrop listing rankings. Intercept issues with`ncompliant product warranty registrations." "COMMENT 'SELLER' TO START TODAY"

Write-Host "Reel graphics generated successfully!"
