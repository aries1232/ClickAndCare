@echo off
echo ========================================
echo ClickAndCare - Starting All Services
echo ========================================

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm start"

echo.
echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Starting Admin Development Server...
start "Admin Server" cmd /k "cd /d %~dp0admin && npm run dev"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo Admin: http://localhost:5174
echo.
echo Press any key to close this window...
pause >nul 