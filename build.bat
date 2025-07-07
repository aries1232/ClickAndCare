@echo off
echo ========================================
echo ClickAndCare - Building All Components
echo ========================================

echo.
echo Installing all dependencies...
call npm run install:all

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Building Frontend...
call npm run build:frontend

if %errorlevel% neq 0 (
    echo Error: Failed to build frontend
    pause
    exit /b 1
)

echo.
echo Building Admin Panel...
call npm run build:admin

if %errorlevel% neq 0 (
    echo Error: Failed to build admin panel
    pause
    exit /b 1
)

echo.
echo ========================================
echo All builds completed successfully!
echo ========================================
echo.
echo Build outputs:
echo - Frontend: frontend/dist/
echo - Admin: admin/dist/
echo - Backend: Ready to run with 'npm run start:backend'
echo.
pause 