#!/bin/bash

echo "========================================"
echo "ClickAndCare - Building All Components"
echo "========================================"

echo ""
echo "Installing all dependencies..."
npm run install:all

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo ""
echo "Building Frontend..."
npm run build:frontend

if [ $? -ne 0 ]; then
    echo "Error: Failed to build frontend"
    exit 1
fi

echo ""
echo "Building Admin Panel..."
npm run build:admin

if [ $? -ne 0 ]; then
    echo "Error: Failed to build admin panel"
    exit 1
fi

echo ""
echo "========================================"
echo "All builds completed successfully!"
echo "========================================"
echo ""
echo "Build outputs:"
echo "- Frontend: frontend/dist/"
echo "- Admin: admin/dist/"
echo "- Backend: Ready to run with 'npm run start:backend'"
echo "" 