@echo off
title RepuShield - Local Server
echo.
echo  Starting RepuShield local server...
echo  Please wait a moment...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
