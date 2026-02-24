@echo off
title NEXUS.FORGE - Mystery Prompt Watcher
color 0A

echo.
echo   ======================================
echo   =    NEXUS.FORGE v2.1.0             =
echo   =    Mystery Prompt Watcher          =
echo   =    Seedstr $10K Blind Hackathon    =
echo   ======================================
echo.
echo   [!] Jangan tutup window ini!
echo   [!] Biarkan jalan sampai prompt muncul.
echo.

cd /d "c:\Users\PANZ AUTO\Documents\Nexus Forge"

echo   [*] Opening Command Center...
start https://nexus-forge-ai.vercel.app
echo.
echo   [*] Starting engine...
echo.

node engine/scripts/poll-and-submit.mjs

echo.
echo   ======================================
echo   =  SELESAI! Cek lagi nanti.         =
echo   ======================================
echo.
pause
