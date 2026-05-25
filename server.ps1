
# RepuShield - Local HTTP Server (PowerShell Built-in)
# This script serves your RepuShield files on a local network IP
# so QR codes are scannable from any phone on the same WiFi.

$port = 8765
$root = $PSScriptRoot

# Get the local network IP (Wi-Fi or LAN)
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notmatch '^127\.' -and
    $_.IPAddress -notmatch '^169\.254\.' -and
    $_.PrefixOrigin -ne 'WellKnown'
} | Select-Object -First 1).IPAddress

if (-not $localIP) { $localIP = "localhost" }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:$port/")

try {
    $listener.Start()
} catch {
    Write-Host ""
    Write-Host "ERROR: Could not start server. Try running as Administrator." -ForegroundColor Red
    Write-Host "Right-click START_SERVER.bat and select 'Run as Administrator'." -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RepuShield Local Server RUNNING" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Dashboard URL (this PC):" -ForegroundColor White
Write-Host "  http://localhost:$port/generator.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "  QR Code / Phone URL (on same Wi-Fi):" -ForegroundColor White
Write-Host "  http://${localIP}:$port/generator.html" -ForegroundColor Green
Write-Host ""
Write-Host "  *** COPY THIS into the 'Deployment Base URL' field ***" -ForegroundColor Cyan
Write-Host "  http://${localIP}:${port}" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Press CTRL+C to stop the server." -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# MIME type map
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".md"   = "text/plain; charset=utf-8"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath
        if ($rawUrl -eq "/") { $rawUrl = "/generator.html" }

        # URL-decode the path
        $decodedPath = [System.Uri]::UnescapeDataString($rawUrl)
        $filePath = Join-Path $root $decodedPath.TrimStart('/')

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $decodedPath")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $notFound.Length
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }

        $response.OutputStream.Close()
    } catch {
        # Ignore broken pipe errors on client disconnect
    }
}

$listener.Stop()
