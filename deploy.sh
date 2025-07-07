#!/bin/bash

# ClickAndCare Deployment Script for Render
echo "🚀 Starting ClickAndCare deployment preparation..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if all required files exist
echo "📋 Checking required files..."

required_files=(
    "render.yaml"
    "DEPLOYMENT.md"
    "backend/package.json"
    "frontend/package.json"
    "admin/package.json"
    "backend/server.js"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
done

echo "✅ All required files found!"

# Check if .env files exist (warn but don't fail)
echo "🔐 Checking environment files..."
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "   Make sure to set environment variables in Render dashboard"
fi

# Check if node_modules exist
echo "📦 Checking dependencies..."
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Warning: Backend dependencies not installed"
    echo "   Run: cd backend && npm install"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Warning: Frontend dependencies not installed"
    echo "   Run: cd frontend && npm install"
fi

if [ ! -d "admin/node_modules" ]; then
    echo "⚠️  Warning: Admin dependencies not installed"
    echo "   Run: cd admin && npm install"
fi

# Check git status
echo "🔍 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "   Consider committing them before deployment:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git remote add origin <your-github-repo-url>"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Render:"
echo "   - Go to https://render.com"
echo "   - Click 'New' → 'Blueprint'"
echo "   - Connect your GitHub repository"
echo "   - Render will automatically detect render.yaml"
echo ""
echo "3. Set environment variables in Render dashboard"
echo "   (See DEPLOYMENT.md for required variables)"
echo ""
echo "4. Your services will be available at:"
echo "   - Backend: https://clickandcare-backend.onrender.com"
echo "   - Frontend: https://clickandcare-frontend.onrender.com"
echo "   - Admin: https://clickandcare-admin.onrender.com"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md" 