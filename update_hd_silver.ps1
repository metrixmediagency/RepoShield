Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\sunny\.gemini\antigravity\brain\aa799871-3906-4e77-80be-ce008463a5a8\media__1782279805392.png"
$outPath = "C:\Users\sunny\.gemini\antigravity\brain\aa799871-3906-4e77-80be-ce008463a5a8\test_silver_transparent.png"

$img = [System.Drawing.Bitmap]::FromFile($imgPath)
$bitmap = New-Object System.Drawing.Bitmap($img)
$img.Dispose()

# Make pure white transparent
$bitmap.MakeTransparent([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$bitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$bitmap.Dispose()
