@echo off
echo ========================================
echo ClickAndCare - Environment Setup
echo ========================================

echo.
echo Creating .env file for backend...

(
echo # MongoDB Connection String
echo # Replace with your actual MongoDB URI
echo # For local MongoDB: mongodb://localhost:27017
echo # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net
echo MONGODB_URI=mongodb://localhost:27017
echo.
echo # JWT Secret
echo JWT_SECRET=your_jwt_secret_key_here
echo.
echo # Server Port
echo PORT=3000
echo.
echo # Cloudinary Configuration ^(if using^)
echo CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
echo CLOUDINARY_API_KEY=your_cloudinary_api_key
echo CLOUDINARY_API_SECRET=your_cloudinary_api_secret
echo.
echo # Email Configuration ^(if using^)
echo EMAIL_USER=your_email@gmail.com
echo EMAIL_PASS=your_email_password
echo.
echo # Stripe Configuration ^(if using^)
echo STRIPE_SECRET_KEY=your_stripe_secret_key
echo STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
) > backend\.env

echo.
echo ========================================
echo .env file created successfully!
echo ========================================
echo.
echo Please edit backend\.env and update the following:
echo 1. MONGODB_URI - Your MongoDB connection string
echo 2. JWT_SECRET - A secure random string
echo 3. Other variables as needed
echo.
echo For local development, you can use:
echo MONGODB_URI=mongodb://localhost:27017
echo.
echo Press any key to continue...
pause >nul 