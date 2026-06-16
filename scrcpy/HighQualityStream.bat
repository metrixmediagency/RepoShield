@echo off
cd /d "%~dp0"
echo Starting scrcpy in High Quality (1080p, 60fps, 20Mbps H.265)...
scrcpy --video-codec=h265 --video-bit-rate=20M --max-fps=60
pause
