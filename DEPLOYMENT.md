# ClickAndCare Deployment Guide for Render

## Overview
This guide will help you deploy ClickAndCare to Render. The application consists of three services:
- Backend API (Node.js/Express)
- Frontend (React/Vite)
- Admin Panel (React/Vite)

## Prerequisites
1. A Render account
2. MongoDB Atlas database
3. Cloudinary account for image uploads
4. Stripe account for payments
5. Gmail account for email notifications

## Environment Variables Required

### Backend Environment Variables
Add these to your backend service in Render:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/clickandcare?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://clickandcare-frontend.onrender.com
ADMIN_URL=https://clickandcare-admin.onrender.com
```

### Frontend Environment Variables
Add these to your frontend service in Render:

```
VITE_BACKEND_URL=https://clickandcare-backend.onrender.com
VITE_STRIPE_KEY_ID=pk_test_your_stripe_publishable_key
```

### Admin Environment Variables
Add these to your admin service in Render:

```
VITE_BACKEND_URL=https://clickandcare-backend.onrender.com
```

## Deployment Steps

### Option 1: Using render.yaml (Recommended)
1. Push your code to GitHub
2. In Render dashboard, click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and create all services

### Option 2: Manual Deployment

#### 1. Backend Service
- **Type**: Web Service
- **Environment**: Node
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: Leave empty (deploy from root)

#### 2. Frontend Service
- **Type**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Root Directory**: Leave empty (deploy from root)

#### 3. Admin Service
- **Type**: Static Site
- **Build Command**: `cd admin && npm install && npm run build`
- **Publish Directory**: `admin/dist`
- **Root Directory**: Leave empty (deploy from root)

## Service URLs
After deployment, your services will be available at:
- Backend: `https://clickandcare-backend.onrender.com`
- Frontend: `https://clickandcare-frontend.onrender.com`
- Admin: `https://clickandcare-admin.onrender.com`

## Important Notes

### CORS Configuration
The backend is configured to accept requests from:
- Frontend URL
- Admin URL
- Local development URLs

### Static File Serving
In production, the backend serves both frontend and admin builds:
- Frontend: `https://clickandcare-backend.onrender.com`
- Admin: `https://clickandcare-backend.onrender.com/admin`

### Health Check
The backend provides a health check endpoint:
`https://clickandcare-backend.onrender.com/api/health`

## Troubleshooting

### Common Issues
1. **Build Failures**: Check that all dependencies are properly listed in package.json
2. **Environment Variables**: Ensure all required environment variables are set
3. **CORS Errors**: Verify that frontend and admin URLs are correctly set in backend environment variables
4. **Database Connection**: Check MongoDB URI and network access

### Logs
Check Render logs for each service to debug issues:
- Backend logs will show API errors and database connection issues
- Frontend/Admin logs will show build errors

## Security Considerations
1. Use strong JWT secrets
2. Enable MongoDB network access only for Render IPs
3. Use environment variables for all sensitive data
4. Enable HTTPS (automatic with Render)

## Performance Optimization
1. Enable auto-scaling if needed
2. Use CDN for static assets
3. Optimize images before upload
4. Implement caching strategies

## Monitoring
1. Set up health checks
2. Monitor API response times
3. Track error rates
4. Monitor database performance 