@echo off
title CyberShield AI - Command Center
echo ========================================================
echo        STARTING CYBERSHIELD AI PORTAL
echo ========================================================
echo.
echo 1. Launching Backend API Server (Port 3000)...
start "CyberShield Backend (Port 3000)" cmd /k "cd /d %~dp0backend && npm run dev"

echo 2. Launching Frontend UI (Port 5173)...
start "CyberShield Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo 3. Waiting 3 seconds for local servers to start...
timeout /t 3 >nul

echo 4. Opening CyberShield AI in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo  CyberShield AI is now running!
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:3000
echo.
echo  Keep the two opened terminal windows active.
echo ========================================================
