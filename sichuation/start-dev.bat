@echo off
echo ==========================================
echo   Sichuation Dev Start Script
echo ==========================================

echo [1/2] Starting Backend Server...
start "Backend (Spring Boot)" cmd /k "gradlew bootRun"

echo Waiting 5 seconds before starting frontend...
timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend Server...
cd frontend
start "Frontend (Next.js)" cmd /k "npm run dev"

echo ==========================================
echo   All services launched!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8080
echo ==========================================
