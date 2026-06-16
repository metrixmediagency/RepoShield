Add-Type -AssemblyName System.Drawing

function Get-RoundedRectanglePath ($rect, $radius) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2
    $size = New-Object System.Drawing.SizeF($diameter, $diameter)
    $arc = New-Object System.Drawing.RectangleF($rect.Location, $size)
    
    # Top-Left Arc
    $path.AddArc($arc, 180, 90)
    
    # Top-Right Arc
    $arc.X = $rect.Right - $diameter
    $path.AddArc($arc, 270, 90)
    
    # Bottom-Right Arc
    $arc.Y = $rect.Bottom - $diameter
    $path.AddArc($arc, 0, 90)
    
    # Bottom-Left Arc
    $arc.X = $rect.Left
    $path.AddArc($arc, 90, 90)
    
    $path.CloseFigure()
    return $path
}

function Fill-RoundedRectangle ($g, $brush, $rect, $radius) {
    $path = Get-RoundedRectanglePath $rect $radius
    $g.FillPath($brush, $path)
    $path.Dispose()
}

function Draw-RoundedRectangle ($g, $pen, $rect, $radius) {
    $path = Get-RoundedRectanglePath $rect $radius
    $g.DrawPath($pen, $path)
    $path.Dispose()
}

function Measure-TextWidth ($g, $text, $font) {
    $format = [System.Drawing.StringFormat]::GenericTypographic
    $size = $g.MeasureString($text, $font, [System.Drawing.PointF]::new(0,0), $format)
    return $size.Width
}

# Colors
$bgColor = [System.Drawing.Color]::FromArgb(10, 15, 30)
$cardBg = [System.Drawing.Color]::FromArgb(21, 27, 48)
$cardBorder = [System.Drawing.Color]::FromArgb(35, 45, 75)
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

$cardBorderPen = New-Object System.Drawing.Pen($cardBorder, 2)
$cyanPen = New-Object System.Drawing.Pen($cyan, 2)
$greenPen = New-Object System.Drawing.Pen($green, 2)
$yellowPen = New-Object System.Drawing.Pen($yellow, 2)
$redPen = New-Object System.Drawing.Pen($red, 2)

# Fonts
$fontFamily = "Segoe UI"
$fontFamilyBold = "Segoe UI"
$fontFamilySemibold = "Segoe UI Semibold"

function Get-Font ($family, $size, $style) {
    $fontStyle = [System.Drawing.FontStyle]::Regular
    if ($style -eq "bold") {
        $fontStyle = [System.Drawing.FontStyle]::Bold
    }
    if ($family -eq "Segoe UI Semibold") {
        try {
            return New-Object System.Drawing.Font("Segoe UI Semibold", $size, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        } catch {
            return New-Object System.Drawing.Font("Segoe UI", $size, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        }
    }
    return New-Object System.Drawing.Font($family, $size, $fontStyle, [System.Drawing.GraphicsUnit]::Pixel)
}

# Unicode character shortcuts for escape to bypass encoding and tofu errors
$starSolid = [char]0x2B50
$starEmpty = [char]0x2606
$circleGreen = "$([char]0x25CF)" # Solid bullet circle
$circleRed = "$([char]0x25CF)" # Solid bullet circle
$handRight = "$([char]0x25B6) " # Solid right-pointing triangle for CTA
$bulletChar = [char]0x2022

function Draw-HeaderFooter ($g, $tagText) {
    $fontTag = Get-Font $fontFamilyBold 24 "bold"
    $parts = $tagText.ToUpper() -split " "
    $tagSpaced = $parts -join "  $bulletChar  "
    $g.DrawString($tagSpaced, $fontTag, $cyanBrush, 80, 80)
    
    # Bottom brand signature
    $fontBrand = Get-Font $fontFamilyBold 26 "bold"
    $g.DrawString("METRIX", $fontBrand, $whiteBrush, 80, 960)
    
    # Draw MEDIA
    $wMetrix = Measure-TextWidth $g "METRIX " $fontBrand
    $g.DrawString("MEDIA", $fontBrand, $cyanBrush, (80 + $wMetrix), 960)
    
    # Draw AEGIS PROTOCOL badge
    $rect = New-Object System.Drawing.RectangleF(750, 950, 250, 40)
    Draw-RoundedRectangle $g $cyanPen $rect 8
    
    $fontBadge = Get-Font $fontFamilyBold 20 "bold"
    $g.DrawString("AEGIS PROTOCOL", $fontBadge, $cyanBrush, 775, 958)
}

$outputDir = $PSScriptRoot

$fontTitle = Get-Font $fontFamilyBold 54 "bold"
$fontSubTitle = Get-Font $fontFamily 24 "regular"
$fontCardTitle = Get-Font $fontFamilyBold 30 "bold"
$fontCardSub = Get-Font $fontFamily 22 "regular"
$fontText = Get-Font $fontFamily 20 "regular"
$fontTextSemibold = Get-Font $fontFamilySemibold 22 "semibold"
$fontTextBold = Get-Font $fontFamilyBold 22 "bold"

# ==========================================
# ============== POST 2 SLIDES =============
# ==========================================

# --- Slide 2: THE REALITY DISCONNECT ---
$bmp = New-Object System.Drawing.Bitmap(1080, 1080)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear($bgColor)
Draw-HeaderFooter $g "CAFE & RESTAURANT STRATEGY"

$g.DrawString("THE REALITY DISCONNECT", $fontTitle, $whiteBrush, 80, 180)
$g.DrawString("Why customer experience doesn't match Google ratings.", $fontSubTitle, $grayBrush, 80, 245)

# Left Card
$cardL = New-Object System.Drawing.RectangleF(80, 310, 440, 580)
Fill-RoundedRectangle $g $cardBrush $cardL 16
Draw-RoundedRectangle $g $cardBorderPen $cardL 16
$g.DrawString("Diner Experience", $fontCardTitle, $greenBrush, 110, 350)
$g.DrawString("Inside your Cafe", $fontCardSub, $grayBrush, 110, 395)
$stars5 = "$starSolid$starSolid$starSolid$starSolid$starSolid"
$g.DrawString($stars5, $fontTextSemibold, $greenBrush, 110, 450)
$g.DrawString("10/10 Food & Vibe", $fontTextSemibold, $whiteBrush, 110, 490)

$bulletsL = @(
    "$bulletChar Amazing food, drinks & service",
    "$bulletChar Beautiful design & atmosphere",
    "$bulletChar Happy customers leaving full",
    "$bulletChar BUT: 95% of satisfied customers",
    "  leave silently and forget",
    "  to review your cafe."
)
$y = 550
foreach ($b in $bulletsL) {
    $g.DrawString($b, $fontText, $whiteBrush, 110, $y)
    $y += 45
}

# Right Card
$cardR = New-Object System.Drawing.RectangleF(560, 310, 440, 580)
Fill-RoundedRectangle $g $cardBrush $cardR 16
Draw-RoundedRectangle $g $cardBorderPen $cardR 16
$g.DrawString("Google Maps Rating", $fontCardTitle, $redBrush, 590, 350)
$g.DrawString("Public Reputation", $fontCardSub, $grayBrush, 590, 395)
$stars4 = "$starSolid$starSolid$starSolid$starSolid$starEmpty"
$g.DrawString($stars4, $fontTextSemibold, $redBrush, 590, 450)
$g.DrawString("4.1 Danger Zone", $fontTextSemibold, $whiteBrush, 590, 490)

$bulletsR = @(
    "$bulletChar A single complaint (slow waiter",
    "  or order mistake) triggers",
    "  an instant negative review.",
    "$bulletChar One angry review overrides",
    "  the opinion of 10 happy diners.",
    "$bulletChar Rating drops, hiding your quality."
)
$y = 550
foreach ($b in $bulletsR) {
    $g.DrawString($b, $fontText, $whiteBrush, 590, $y)
    $y += 45
}

$bmp.Save((Join-Path $outputDir "post2_slide2.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$g.Dispose()


# --- Slide 3: THE REVENUE LEAK ---
$bmp = New-Object System.Drawing.Bitmap(1080, 1080)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear($bgColor)
Draw-HeaderFooter $g "CAFE & RESTAURANT STRATEGY"

$g.DrawString("THE REVENUE LEAK", $fontTitle, $whiteBrush, 80, 180)
$g.DrawString("How rating zones dictate local cafe walk-ins:", $fontSubTitle, $grayBrush, 80, 245)

# Trust Zone
$rectZ1 = New-Object System.Drawing.RectangleF(80, 310, 920, 160)
Fill-RoundedRectangle $g $cardBrush $rectZ1 12
Draw-RoundedRectangle $g $greenPen $rectZ1 12
$g.DrawString("THE TRUST ZONE (4.5 - 5.0 Stars)", $fontTextBold, $greenBrush, 120, 335)
$g.DrawString("92% of new customers click here first. You secure trust instantly and can", $fontText, $whiteBrush, 120, 375)
$g.DrawString("easily charge premium prices for your menu.", $fontText, $whiteBrush, 120, 405)

# Danger Zone
$rectZ2 = New-Object System.Drawing.RectangleF(80, 490, 920, 160)
Fill-RoundedRectangle $g $cardBrush $rectZ2 12
Draw-RoundedRectangle $g $yellowPen $rectZ2 12
$g.DrawString("THE DANGER ZONE (4.0 - 4.4 Stars)", $fontTextBold, $yellowBrush, 120, 515)
$g.DrawString("You lose up to 50% of your hot leads. Customers see a few bad reviews,", $fontText, $whiteBrush, 120, 555)
$g.DrawString("get doubtful, and walk into the 4.7-star cafe next door instead.", $fontText, $whiteBrush, 120, 585)

# Invisible Zone
$rectZ3 = New-Object System.Drawing.RectangleF(80, 670, 920, 160)
Fill-RoundedRectangle $g $cardBrush $rectZ3 12
Draw-RoundedRectangle $g $redPen $rectZ3 12
$g.DrawString("THE INVISIBLE ZONE (Under 3.9 Stars)", $fontTextBold, $redBrush, 120, 695)
$g.DrawString("Filtered out by search engines and customers. Google Maps stops ranking", $fontText, $whiteBrush, 120, 735)
$g.DrawString("your profile. You bleed potential sales daily.", $fontText, $whiteBrush, 120, 765)

$bmp.Save((Join-Path $outputDir "post2_slide3.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$g.Dispose()


# --- Slide 4: HOW AEGIS STOPS LEAKS ---
$bmp = New-Object System.Drawing.Bitmap(1080, 1080)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear($bgColor)
Draw-HeaderFooter $g "CAFE & RESTAURANT STRATEGY"

$g.DrawString("HOW AEGIS PROTOCOL WORKS", $fontTitle, $whiteBrush, 80, 180)
$g.DrawString("A smart review router placed directly at your billing counter.", $fontSubTitle, $grayBrush, 80, 245)

# Scanner Node
$rectScan = New-Object System.Drawing.RectangleF(390, 310, 300, 120)
Fill-RoundedRectangle $g $cardBrush $rectScan 16
Draw-RoundedRectangle $g $cyanPen $rectScan 16
$g.DrawString("Customer Scans", $fontTextBold, $cyanBrush, 455, 340)
$g.DrawString("Billing QR Standee", $fontTextSemibold, $whiteBrush, 445, 380)

# Paths
$g.DrawLine($cardBorderPen, 250, 370, 390, 370)
$g.DrawLine($cardBorderPen, 250, 370, 250, 520)
$g.FillPolygon($greenBrush, @([System.Drawing.PointF]::new(245,510), [System.Drawing.PointF]::new(255,510), [System.Drawing.PointF]::new(250,520)))

$g.DrawLine($cardBorderPen, 690, 370, 830, 370)
$g.DrawLine($cardBorderPen, 830, 370, 830, 520)
$g.FillPolygon($redBrush, @([System.Drawing.PointF]::new(825,510), [System.Drawing.PointF]::new(835,510), [System.Drawing.PointF]::new(830,520)))

# Left card (Happy)
$rectH = New-Object System.Drawing.RectangleF(80, 530, 420, 350)
Fill-RoundedRectangle $g $cardBrush $rectH 16
Draw-RoundedRectangle $g $greenPen $rectH 16
$happyTitle = "$circleGreen  Happy Experience?"
$g.DrawString($happyTitle, $fontTextBold, $greenBrush, 110, 560)
$g.DrawString("Auto-routes customer", $fontText, $whiteBrush, 110, 610)
$g.DrawString("directly to Google to", $fontText, $whiteBrush, 110, 645)
$g.DrawString("write a 5-star review.", $fontText, $whiteBrush, 110, 680)
$g.DrawString("Result: Rating climbs.", $fontTextSemibold, $greenBrush, 110, 750)

# Right card (Unhappy)
$rectU = New-Object System.Drawing.RectangleF(580, 530, 420, 350)
Fill-RoundedRectangle $g $cardBrush $rectU 16
Draw-RoundedRectangle $g $redPen $rectU 16
$unhappyTitle = "$circleRed  Had a Complaint?"
$g.DrawString($unhappyTitle, $fontTextBold, $redBrush, 610, 560)
$g.DrawString("Redirects to a private", $fontText, $whiteBrush, 610, 610)
$g.DrawString("internal feedback page", $fontText, $whiteBrush, 610, 645)
$g.DrawString("straight to the manager.", $fontText, $whiteBrush, 610, 680)
$g.DrawString("Result: Bad reviews stop.", $fontTextSemibold, $redBrush, 610, 750)

$bmp.Save((Join-Path $outputDir "post2_slide4.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$g.Dispose()


# --- Slide 5: CTA ---
$bmp = New-Object System.Drawing.Bitmap(1080, 1080)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear($bgColor)
Draw-HeaderFooter $g "CAFE & RESTAURANT STRATEGY"

$g.DrawString("CLAIM YOUR 10-DAY TRIAL", $fontTitle, $greenBrush, 80, 180)
$g.DrawString("Risk-free test for local restaurants in Goa.", $fontSubTitle, $grayBrush, 80, 245)

$rectCTA = New-Object System.Drawing.RectangleF(80, 310, 920, 560)
Fill-RoundedRectangle $g $cardBrush $rectCTA 16
Draw-RoundedRectangle $g $cardBorderPen $rectCTA 16

$g.DrawString("WHAT WE DO:", $fontTextBold, $cyanBrush, 120, 350)
$g.DrawString("1. We design and host your custom cafe review portal.", $fontTextSemibold, $whiteBrush, 120, 400)
$g.DrawString("2. We print and ship your physical counter QR standees.", $fontTextSemibold, $whiteBrush, 120, 450)
$g.DrawString("3. You place them at your checkout and test it for 10 days.", $fontTextSemibold, $whiteBrush, 120, 500)

$rectPrice = New-Object System.Drawing.RectangleF(120, 570, 840, 80)
$g.FillRectangle($bgBrush, $rectPrice)
$g.DrawString("Pay only Rs. 1,999 after you receive at least 3 new 5-star reviews.", $fontTextBold, $greenBrush, 140, 595)

$ctaText = "$handRight DM US 'CAFE' TO CLAIM YOUR STANDEE TODAY"
$g.DrawString($ctaText, $fontCardTitle, $cyanBrush, 120, 690)
$g.DrawString("Limited to 5 local spots for this batch.", $fontText, $grayBrush, 120, 740)

$bmp.Save((Join-Path $outputDir "post2_slide5.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$g.Dispose()


# ==========================================
# ============== POST 3 SLIDES =============
# ==========================================

# --- Slide 2: THE PATIENT TRUST FILTER ---
$bmp = New-Object System.Drawing.Bitmap(1080, 1080)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear($bgColor)
Draw-HeaderFooter $g "CLINICAL TRUST AUDIT"

$g.DrawString("THE PATIENT TRUST FILTER", $fontTitle, $whiteBrush, 80, 180)
$g.DrawString("How star ratings define perceived care quality.", $fontSubTitle, $grayBrush, 80, 245)

# Left Card
$cardL = New-Object System.Drawing.RectangleF(80, 310, 440, 580)
Fill-RoundedRectangle $g $cardBrush $cardL 16
Draw-RoundedRectangle $g $greenPen $cardL 16
$g.DrawString("TRUST ZONE", $fontCardTitle, $greenBrush, 110, 350)
$g.DrawString("4.5 to 5.0 Stars", $fontCardSub, $grayBrush, 110, 395)
$passLabel = "$circleGreen  PASS ZONE"
$g.DrawString($passLabel, $fontTextSemibold, $greenBrush, 110, 450)

$bulletsPL = @(
    "$bulletChar Patients assume high quality.",
    "$bulletChar Clinical trust is built before",
    "  the patient steps inside.",
    "$bulletChar Bookings flow automatically.",
    "$bulletChar Allows premium reputation.",
    "$bulletChar High visibility on GMB Maps."
)
$y = 520
foreach ($b in $bulletsPL) {
    $g.DrawString($b, $fontText, $whiteBrush, 110, $y)
    $y += 45
}

# Right Card
$cardR = New-Object System.Drawing.RectangleF(560, 310, 440, 580)
Fill-RoundedRectangle $g $cardBrush $cardR 16
Draw-RoundedRectangle $g $redPen $cardR 16
$g.DrawString("DANGER ZONE", $fontCardTitle, $redBrush, 590, 350)
$g.DrawString("Under 4.4 Stars", $fontCardSub, $grayBrush, 590, 395)
$failLabel = "$circleRed  FILTERED OUT"
$g.DrawString($failLabel, $fontTextSemibold, $redBrush, 590, 450)

$bulletsPR = @(
    "$bulletChar Patients suspect subpar care.",
    "$bulletChar Perceived clinical risk.",
    "$bulletChar Prospective patients skip you.",
    "$bulletChar Costs local practices an",
    "  average of 3 to 5 patient",
    "  bookings every single week."
)
$y = 520
foreach ($b in $bulletsPR) {
    $g.DrawString($b, $fontText, $whiteBrush, 590, $y)
    $y += 45
}

$bmp.Save((Join-Path $outputDir "post3_slide2.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$g.Dispose()


# --- Slide 3: WHY CLINICAL RATINGS BLEED ---
$bmp = New-Object System.Drawing.Bitmap(1080, 1080)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear($bgColor)
Draw-HeaderFooter $g "CLINICAL TRUST AUDIT"

$g.DrawString("WHY CLINIC RATINGS BLEED", $fontTitle, $whiteBrush, 80, 180)
$g.DrawString("The gap between medical skill and GMB ratings:", $fontSubTitle, $grayBrush, 80, 245)

$rectBleed = New-Object System.Drawing.RectangleF(80, 310, 920, 560)
Fill-RoundedRectangle $g $cardBrush $rectBleed 16
Draw-RoundedRectangle $g $cardBorderPen $rectBleed 16

$g.DrawString("1. Administrative Issues, Not Medical Care", $fontTextBold, $cyanBrush, 120, 350)
$g.DrawString("90% of clinic negative reviews focus on admin issues - like receptionist wait", $fontText, $whiteBrush, 120, 390)
$g.DrawString("time, billing discrepancies, or parking. These shouldn't ruin your reputation.", $fontText, $whiteBrush, 120, 420)

$g.DrawString("2. Happy Patients Leave Silently", $fontTextBold, $cyanBrush, 120, 490)
$g.DrawString("Delighted patients receive their care and leave quietly. To protect their privacy,", $fontText, $whiteBrush, 120, 530)
$g.DrawString("they rarely post online reviews unless explicitly and elegantly asked.", $fontText, $whiteBrush, 120, 560)

$g.DrawString("3. The Vulnerability", $fontTextBold, $redBrush, 120, 630)
$g.DrawString("One angry patient complaining about reception wait time drags your score", $fontText, $whiteBrush, 120, 670)
$g.DrawString("into the Danger Zone. Protect your clinical reputation from administrative bottlenecks.", $fontText, $whiteBrush, 120, 700)

$bmp.Save((Join-Path $outputDir "post3_slide3.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$g.Dispose()


# --- Slide 4: HIPAA-COMPLIANT ROUTING ---
$bmp = New-Object System.Drawing.Bitmap(1080, 1080)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear($bgColor)
Draw-HeaderFooter $g "CLINICAL TRUST AUDIT"

$g.DrawString("PROTECT YOUR PRACTICE", $fontTitle, $whiteBrush, 80, 180)
$g.DrawString("Smart review routing designed for professional practices.", $fontSubTitle, $grayBrush, 80, 245)

# Scanner Node
$rectScan = New-Object System.Drawing.RectangleF(390, 310, 300, 120)
Fill-RoundedRectangle $g $cardBrush $rectScan 16
Draw-RoundedRectangle $g $cyanPen $rectScan 16
$g.DrawString("Patient Scans", $fontTextBold, $cyanBrush, 470, 340)
$g.DrawString("Reception QR Card", $fontTextSemibold, $whiteBrush, 450, 380)

# Paths
$g.DrawLine($cardBorderPen, 250, 370, 390, 370)
$g.DrawLine($cardBorderPen, 250, 370, 250, 520)
$g.FillPolygon($greenBrush, @([System.Drawing.PointF]::new(245,510), [System.Drawing.PointF]::new(255,510), [System.Drawing.PointF]::new(250,520)))

$g.DrawLine($cardBorderPen, 690, 370, 830, 370)
$g.DrawLine($cardBorderPen, 830, 370, 830, 520)
$g.FillPolygon($redBrush, @([System.Drawing.PointF]::new(825,510), [System.Drawing.PointF]::new(835,510), [System.Drawing.PointF]::new(830,520)))

# Left card (Happy)
$rectH = New-Object System.Drawing.RectangleF(80, 530, 420, 350)
Fill-RoundedRectangle $g $cardBrush $rectH 16
Draw-RoundedRectangle $g $greenPen $rectH 16
$happyPatientTitle = "$circleGreen  Happy Patient?"
$g.DrawString($happyPatientTitle, $fontTextBold, $greenBrush, 110, 560)
$g.DrawString("Auto-routes patient to", $fontText, $whiteBrush, 110, 610)
$g.DrawString("Google Maps to write", $fontText, $whiteBrush, 110, 645)
$g.DrawString("a public 5-star review.", $fontText, $whiteBrush, 110, 680)
$g.DrawString("Result: Rating climbs.", $fontTextSemibold, $greenBrush, 110, 750)

# Right card (Grievance)
$rectU = New-Object System.Drawing.RectangleF(580, 530, 420, 350)
Fill-RoundedRectangle $g $cardBrush $rectU 16
Draw-RoundedRectangle $g $redPen $rectU 16
$grievanceTitle = "$circleRed  Had a Grievance?"
$g.DrawString($grievanceTitle, $fontTextBold, $redBrush, 610, 560)
$g.DrawString("Routes to a private", $fontText, $whiteBrush, 610, 610)
$g.DrawString("confidential portal.", $fontText, $whiteBrush, 610, 645)
$g.DrawString("Resolved internally.", $fontText, $whiteBrush, 610, 680)
$g.DrawString("Result: Patient privacy saved.", $fontTextSemibold, $redBrush, 610, 750)

$bmp.Save((Join-Path $outputDir "post3_slide4.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$g.Dispose()


# --- Slide 5: CTA ---
$bmp = New-Object System.Drawing.Bitmap(1080, 1080)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear($bgColor)
Draw-HeaderFooter $g "CLINICAL TRUST AUDIT"

$g.DrawString("10-DAY PRACTICE TRIAL", $fontTitle, $cyanBrush, 80, 180)
$g.DrawString("Risk-free reputational audit for Goa medical clinics.", $fontSubTitle, $grayBrush, 80, 245)

$rectCTA = New-Object System.Drawing.RectangleF(80, 310, 920, 560)
Fill-RoundedRectangle $g $cardBrush $rectCTA 16
Draw-RoundedRectangle $g $cardBorderPen $rectCTA 16

$g.DrawString("THE INTEGRATION PROCESS:", $fontTextBold, $cyanBrush, 120, 350)
$g.DrawString("1. We build and host your custom patient feedback portal.", $fontTextSemibold, $whiteBrush, 120, 400)
$g.DrawString("2. We design and ship your reception desk QR cards.", $fontTextSemibold, $whiteBrush, 120, 450)
$g.DrawString("3. Run the portal for 10 days and verify the results.", $fontTextSemibold, $whiteBrush, 120, 500)

$rectPrice = New-Object System.Drawing.RectangleF(120, 570, 840, 80)
$g.FillRectangle($bgBrush, $rectPrice)
$g.DrawString("Pay only Rs. 2,499 after you receive at least 3 new 5-star reviews.", $fontTextBold, $greenBrush, 140, 595)

$ctaText3 = "$handRight DM US 'CLINIC' TO SECURE YOUR PRACTICE TRIAL"
$g.DrawString($ctaText3, $fontCardTitle, $cyanBrush, 120, 690)
$g.DrawString("Limited setup slots available for this batch.", $fontText, $grayBrush, 120, 740)

$bmp.Save((Join-Path $outputDir "post3_slide5.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$g.Dispose()

# Create duplicates to match the cover slides
Copy-Item -Path (Join-Path $outputDir "post2_cover.png") -Destination (Join-Path $outputDir "post2_slide1.png") -Force
Copy-Item -Path (Join-Path $outputDir "post3_cover.png") -Destination (Join-Path $outputDir "post3_slide1.png") -Force

Write-Host "Carousel slides generated successfully!"
