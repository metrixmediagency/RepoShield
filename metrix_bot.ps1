$Token = "8410914706:AAGsJYGlOrzmNVzIsg4fhwVeYgWrI2GwDws"
$AllowedChatId = "8979163302"
$ScriptPath = "C:\Users\sunny\.gemini\antigravity\scratch\MetrixMedia\auto_campaign.ps1"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  MetrixMedia Telegram Bot Online" -ForegroundColor Cyan
Write-Host "  Listening for commands on your phone..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$lastUpdateId = 0

while ($true) {
    try {
        $url = "https://api.telegram.org/bot$Token/getUpdates?offset=$($lastUpdateId + 1)&timeout=10"
        $response = Invoke-RestMethod -Uri $url -Method Get
        
        foreach ($update in $response.result) {
            $lastUpdateId = $update.update_id
            $msg = $update.message
            
            if ($msg.chat.id -eq $AllowedChatId -and $msg.text) {
                $text = $msg.text
                Write-Host "Received Command: $text" -ForegroundColor Yellow
                
                if ($text.ToLower() -match "hello") {
                    $reply = "Welcome to your Metrix Command Center!`n`nTo generate leads, send a message in this format:`n`nLocation - Niches`n`nExample:`nGoa - Bars,Cafes`nMumbai - Premium Restaurants"
                    $encReply = [uri]::EscapeDataString($reply)
                    $replyUrl = "https://api.telegram.org/bot$Token/sendMessage?chat_id=$AllowedChatId`&text=$encReply`&parse_mode=Markdown"
                    Invoke-RestMethod -Uri $replyUrl -Method Get | Out-Null
                }
                elseif ($text -match "-") {
                    $parts = $text -split "-", 2
                    $loc = $parts[0].Trim()
                    $niches = $parts[1].Trim()
                    
                    $ack = "Executing script for *$loc* (Niches: *$niches*)...`nI will send leads here as soon as they are processed."
                    $encAck = [uri]::EscapeDataString($ack)
                    $ackUrl = "https://api.telegram.org/bot$Token/sendMessage?chat_id=$AllowedChatId`&text=$encAck`&parse_mode=Markdown"
                    Invoke-RestMethod -Uri $ackUrl -Method Get | Out-Null
                    
                    $premiumFlag = ""
                    if ($niches.ToLower() -match "premium" -or $niches.ToLower() -match "luxury" -or $niches.ToLower() -match "fine dining") {
                        $premiumFlag = "-PremiumOnly"
                    }
                    
                    Write-Host "Triggering Engine: Location=$loc, Niches=$niches" -ForegroundColor Green
                    
                    $cmd = "powershell -ExecutionPolicy Bypass -File `"$ScriptPath`" -Location `"$loc`" -Niches `"$niches`" $premiumFlag -TelegramToken `"$Token`" -TelegramChatId `"$AllowedChatId`""
                    
                    Invoke-Expression $cmd | Out-Null
                    
                    $doneMsg = "Job Complete! Check your messages above for the leads."
                    $encDone = [uri]::EscapeDataString($doneMsg)
                    $doneUrl = "https://api.telegram.org/bot$Token/sendMessage?chat_id=$AllowedChatId`&text=$encDone`&parse_mode=Markdown"
                    Invoke-RestMethod -Uri $doneUrl -Method Get | Out-Null
                }
                else {
                    $errorMsg = "I didn't understand that command.`nMake sure to use a hyphen:`nLocation - Niche`n(e.g., Pune - Bars)"
                    $encErr = [uri]::EscapeDataString($errorMsg)
                    $errorUrl = "https://api.telegram.org/bot$Token/sendMessage?chat_id=$AllowedChatId`&text=$encErr`&parse_mode=Markdown"
                    Invoke-RestMethod -Uri $errorUrl -Method Get | Out-Null
                }
            }
        }
    } catch {
        # Ignore timeout errors
    }
    Start-Sleep -Milliseconds 500
}
