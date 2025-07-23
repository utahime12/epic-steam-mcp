@echo off
title Epic & Steam MCP Server
cd /d "%~dp0"

echo ========================================
echo Epic & Steam MCP Server Start
echo ========================================
echo.

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting MCP server...
echo Press Ctrl+C to stop.
echo.

node index.mjs
pause
