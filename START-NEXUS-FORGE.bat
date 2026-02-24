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

echo   [*] Starting engine...
echo.

node engine/scripts/poll-and-submit.mjs

if %ERRORLEVEL% EQU 0 (
    color 0A
    echo.
    echo   ======================================
    echo   =  SELESAI! Cek lagi 5 menit nanti  =
    echo   ======================================
) else (
    color 0C
    echo.
    echo   ======================================
    echo   =  ADA ERROR - Cek log di atas      =
    echo   ======================================
)

echo.
pause
