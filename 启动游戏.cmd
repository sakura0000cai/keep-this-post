@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  start "" "%~dp0dist\index.html"
  exit /b
)
start "" "http://127.0.0.1:4173"
node server.cjs
pause
