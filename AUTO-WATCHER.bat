@echo off
title NEXUS.FORGE - AUTO WATCHER (Loop 5 min)
color 0A

echo.
echo   ======================================
echo   =    NEXUS.FORGE v2.1.0             =
echo   =    AUTO WATCHER - Loop Mode        =
echo   =    Seedstr $10K Blind Hackathon    =
echo   ======================================
echo.
echo   [!] Jangan tutup window ini!
echo   [!] Script akan cek Seedstr setiap 5 menit.
echo   [!] Tekan Ctrl+C untuk berhenti.
echo.

cd /d "c:\Users\PANZ AUTO\Documents\Nexus Forge"

echo   [*] Opening Command Center...
start https://nexus-forge-ai.vercel.app
echo.

:loop
echo.
echo   ──────────────────────────────────────
echo   [%date% %time%] Polling Seedstr API...
echo   ──────────────────────────────────────
echo.

node engine/scripts/poll-and-submit.mjs

echo.
echo   [*] Selesai. Tunggu 5 menit...
echo   [*] Tekan Ctrl+C untuk berhenti.
echo.

timeout /t 300 /nobreak
goto loop
