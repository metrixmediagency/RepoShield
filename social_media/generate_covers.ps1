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

function Draw-HeaderFooter ($g, $tagText) {
    $fontTag = Get-Font $fontFamilyBold 24 "bold"
    $parts = $tagText.ToUpper() -split " "
    $tagSpaced = $parts -join "  •  "
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

# ----------------- POST 2 -----------------
$bmp2 = New-Object System.Drawing.Bitmap(1080, 1080)
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Clear background
$g2.Clear($bgColor)

# Header & Footer
Draw-HeaderFooter $g2 "CAFE & RESTAURANT STRATEGY"

# Main Headline
$fontTitleBold = Get-Font $fontFamilyBold 62 "bold"
$fontTitleReg = Get-Font $fontFamilySemibold 62 "semibold"

# Row 1: YOUR FOOD IS 10/10.
$y = 190
$g2.DrawString("YOUR FOOD IS ", $fontTitleReg, $whiteBrush, 80, $y)
$wYourFood = Measure-TextWidth $g2 "YOUR FOOD IS " $fontTitleReg
$g2.DrawString("10/10.", $fontTitleBold, $greenBrush, (80 + $wYourFood), $y)

# Row 2: YOUR GOOGLE RATING
$y += 80
$g2.DrawString("YOUR GOOGLE RATING", $fontTitleReg, $whiteBrush, 80, $y)

# Row 3: IS A 4.1. WHY?
$y += 80
$g2.DrawString("IS A ", $fontTitleReg, $whiteBrush, 80, $y)
$wIsA = Measure-TextWidth $g2 "IS A " $fontTitleReg
$g2.DrawString("4.1.", $fontTitleBold, $redBrush, (80 + $wIsA), $y)
$wRating = Measure-TextWidth $g2 "4.1." $fontTitleBold
$g2.DrawString("WHY?", $fontTitleBold, $yellowBrush, (80 + $wIsA + $wRating + 15), $y)

# UI Card Layout
$cardRect = New-Object System.Drawing.RectangleF(80, 480, 920, 400)
Fill-RoundedRectangle $g2 $cardBrush $cardRect 16
Draw-RoundedRectangle $g2 $cardBorderPen $cardRect 16

# Split Line
$g2.DrawLine($cardBorderPen, 120, 660, 960, 660)

# Card text
$fontCardTitle = Get-Font $fontFamilyBold 28 "bold"
$fontCardSub = Get-Font $fontFamily 22 "regular"
$fontColHead = Get-Font $fontFamilySemibold 24 "semibold"
$fontColVal = Get-Font $fontFamilyBold 30 "bold"
$fontColSub = Get-Font $fontFamily 20 "regular"

$g2.DrawString("THE CRITICAL DISCONNECT", $fontCardTitle, $cyanBrush, 120, 520)
$g2.DrawString("Why Michelin-level quality gets stuck in the Google 'Danger Zone'", $fontCardSub, $grayBrush, 120, 565)

# Columns
# Left Column
$col1X = 120
$rowY = 700
$g2.DrawString("Diner Experience (Inside Cafe)", $fontColHead, $whiteBrush, $col1X, $rowY)
$g2.DrawString("⭐⭐⭐⭐⭐ 10/10 Food & Vibe", $fontColVal, $greenBrush, $col1X, ($rowY + 45))
$g2.DrawString("95% of happy diners leave silently.", $fontColSub, $grayBrush, $col1X, ($rowY + 95))

# Right Column
$col2X = 560
$g2.DrawString("Google Maps Rating (Public)", $fontColHead, $whiteBrush, $col2X, $rowY)
$g2.DrawString("⭐⭐⭐⭐☆ 4.1 Danger Zone", $fontColVal, $redBrush, $col2X, ($rowY + 45))
$g2.DrawString("1 disgruntled review ruins the score.", $fontColSub, $grayBrush, $col2X, ($rowY + 95))

# Save image
$outputDir = Join-Path $PSScriptRoot "social_media"
if (-not (Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir | Out-Null }
$bmp2.Save((Join-Path $outputDir "post2_cover.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()
$g2.Dispose()

# ----------------- POST 3 -----------------
$bmp3 = New-Object System.Drawing.Bitmap(1080, 1080)
$g3 = [System.Drawing.Graphics]::FromImage($bmp3)
$g3.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g3.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Clear background
$g3.Clear($bgColor)

# Header & Footer
Draw-HeaderFooter $g3 "CLINICAL TRUST AUDIT"

# Main Headline
$fontHugeNum = Get-Font $fontFamilyBold 190 "bold"
$fontTitle3Bold = Get-Font $fontFamilyBold 52 "bold"

$y = 170
$g3.DrawString("92%", $fontHugeNum, $cyanBrush, 80, $y)

$y += 210
$g3.DrawString("OF NEW PATIENTS CHECK REVIEWS", $fontTitle3Bold, $whiteBrush, 80, $y)

$y += 70
$g3.DrawString("BEFORE BOOKING A DOCTOR.", $fontTitle3Bold, $greenBrush, 80, $y)

# UI Card Layout
$cardRect3 = New-Object System.Drawing.RectangleF(80, 530, 920, 360)
Fill-RoundedRectangle $g3 $cardBrush $cardRect3 16
Draw-RoundedRectangle $g3 $cardBorderPen $cardRect3 16

# Split Line
$g3.DrawLine($cardBorderPen, 120, 660, 960, 660)

# Card Text
$g3.DrawString("THE 3-SECOND TRUST FILTER", $fontCardTitle, $cyanBrush, 120, 565)
$g3.DrawString("How patients filter clinics on Google Maps", $fontCardSub, $grayBrush, 120, 610)

# Pass Zone
$yPass = 690
$g3.DrawString("4.5 to 5.0 Stars (Trust Zone)", $fontColHead, $whiteBrush, 120, ($yPass + 15))
$g3.DrawString("Patients assume clinical excellence. Bookings flow automatically.", $fontColSub, $grayBrush, 120, ($yPass + 55))

# Pass Badge
$passBadgeRect = New-Object System.Drawing.RectangleF(760, ($yPass + 15), 190, 50)
$bgBrushColor = New-Object System.Drawing.SolidBrush($bgColor)
Fill-RoundedRectangle $g3 $greenBrush $passBadgeRect 8
$fontBadgeText = Get-Font $fontFamilyBold 22 "bold"
$wPass = Measure-TextWidth $g3 "PASS" $fontBadgeText
$xPass = 760 + (190 - $wPass)/2
$g3.DrawString("PASS", $fontBadgeText, $bgBrushColor, $xPass, ($yPass + 25))

# Fail Zone
$yFail = 790
$g3.DrawString("Under 4.4 Stars (Danger Zone)", $fontColHead, $whiteBrush, 120, ($yFail + 15))
$g3.DrawString("Patients suspect administrative issues or subpar care. They skip.", $fontColSub, $grayBrush, 120, ($yFail + 55))

# Fail Badge
$failBadgeRect = New-Object System.Drawing.RectangleF(720, ($yFail + 15), 230, 50)
Fill-RoundedRectangle $g3 $redBrush $failBadgeRect 8
$wFiltered = Measure-TextWidth $g3 "FILTERED OUT" $fontBadgeText
$xFiltered = 720 + (230 - $wFiltered)/2
$g3.DrawString("FILTERED OUT", $fontBadgeText, $whiteBrush, $xFiltered, ($yFail + 25))

# Save image
$bmp3.Save((Join-Path $outputDir "post3_cover.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp3.Dispose()
$g3.Dispose()

Write-Host "Images generated successfully!"
