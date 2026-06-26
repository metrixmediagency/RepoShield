Set WshShell = CreateObject("WScript.Shell")
' Run the PowerShell script silently (-WindowStyle Hidden)
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File ""C:\Users\sunny\.gemini\antigravity\scratch\MetrixMedia\bot-engine\metrix_bot.ps1""", 0, False
