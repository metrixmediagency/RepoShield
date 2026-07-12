@echo off
echo Starting MetrixMedia Telegram Bot...
powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0bot-engine\metrix_bot.ps1"
echo Bot is now running in the background!
pause
