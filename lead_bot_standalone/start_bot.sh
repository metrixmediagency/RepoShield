#!/bin/bash
# ========================================================
# MetrixMedia Telegram Lead Gen Bot (Ubuntu Linux)
# ========================================================

# Check if environment variables are set
if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ] || [ -z "$SERP_API_KEY" ]; then
    echo "ERROR: Environment variables are missing!"
    echo "Please set TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, and SERP_API_KEY before running."
    exit 1
fi

# Ensure pip dependencies are installed
echo "Checking Python dependencies..."
pip3 install -r bot-engine/requirements.txt --quiet

echo "Starting Bot Engine..."
python3 bot-engine/metrix_bot.py
