@echo off
echo 🚀 Starting ClickAndCare deployment preparation...

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Check if all required files exist
echo 📋 Checking required files...

if not exist "render.yaml" (
    echo ❌ Missing required file: render.yaml
    pause
    exit /b 1
)

if not exist "DEPLOYMENT.md" (
    echo ❌ Missing required file: DEPLOYMENT.md
    pause
    exit /b 1
)

if not exist "backend\package.json" (
    echo ❌ Missing required file: backend\package.json
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ❌ Missing required file: frontend\package.json
    pause
    exit /b 1
)

if not exist "admin\package.json" (
    echo ❌ Missing required file: admin\package.json
    pause
    exit /b 1
)

if not exist "backend\server.js" (
    echo ❌ Missing required file: backend\server.js
    pause
    exit /b 1
)

echo ✅ All required files found!

REM Check if .env files exist (warn but don't fail)
echo 🔐 Checking environment files...
if not exist ".env" (
    echo ⚠️  Warning: .env file not found
    echo    Make sure to set environment variables in Render dashboard
)

REM Check if node_modules exist
echo 📦 Checking dependencies...
if not exist "backend\node_modules" (
    echo ⚠️  Warning: Backend dependencies not installed
    echo    Run: cd backend ^&^& npm install
)

if not exist "frontend\node_modules" (
    echo ⚠️  Warning: Frontend dependencies not installed
    echo    Run: cd frontend ^&^& npm install
)

if not exist "admin\node_modules" (
    echo ⚠️  Warning: Admin dependencies not installed
    echo    Run: cd admin ^&^& npm install
)

echo.
echo 🎉 Deployment preparation complete!
echo.
echo 📋 Next steps:
echo 1. Push your code to GitHub:
echo    git remote add origin ^<your-github-repo-url^>
echo    git push -u origin main
echo.
echo 2. Deploy to Render:
echo    - Go to https://render.com
echo    - Click "New" → "Blueprint"
echo    - Connect your GitHub repository
echo    - Render will automatically detect render.yaml
echo.
echo 3. Set environment variables in Render dashboard
echo    (See DEPLOYMENT.md for required variables)
echo.
echo 4. Your services will be available at:
echo    - Backend: https://clickandcare-backend.onrender.com
echo    - Frontend: https://clickandcare-frontend.onrender.com
echo    - Admin: https://clickandcare-admin.onrender.com
echo.
echo 📚 For detailed instructions, see DEPLOYMENT.md
pause 