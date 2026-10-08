@echo off
title Starbound Sprint
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-game.ps1" %*
if errorlevel 1 (
  echo.
  echo The game server could not start. Please copy this error and send it to Codex.
  pause
)
