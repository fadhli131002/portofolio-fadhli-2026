@echo off
title Local Portfolio Server
cd /d "%~dp0"
echo ==========================================
echo   Menjalankan Local Server Portofolio...
echo ==========================================
start http://localhost:3000
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
