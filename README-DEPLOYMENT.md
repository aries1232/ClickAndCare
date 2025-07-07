# 🚀 ClickAndCare - Quick Deployment Guide

## Overview
ClickAndCare is a healthcare management system with three main components:
- **Backend API** (Node.js/Express)
- **Frontend** (React/Vite) - Patient interface
- **Admin Panel** (React/Vite) - Admin interface

## 🎯 Quick Deploy to Render

### Prerequisites
- [ ] GitHub account
- [ ] Render account
- [ ] MongoDB Atlas database
- [ ] Cloudinary account
- [ ] Stripe account
- [ ] Gmail account

### 1. Prepare Your Repository
```bash
# Run the deployment check script
./deploy.sh          # Linux/Mac
deploy.bat           # Windows
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 3. Deploy on Render
1. Go to [Render Dashboard](https://render.com)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create all services

### 4. Set Environment Variables
In Render dashboard, add these environment variables to each service:

#### Backend Service
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=https://clickandcare-frontend.onrender.com
ADMIN_URL=https://clickandcare-admin.onrender.com
```

#### Frontend Service
```
VITE_BACKEND_URL=https://clickandcare-backend.onrender.com
VITE_STRIPE_KEY_ID=your_stripe_publishable_key
```

#### Admin Service
```
VITE_BACKEND_URL=https://clickandcare-backend.onrender.com
```

## 🌐 Your Live URLs
After deployment, your services will be available at:
- **Backend API**: `https://clickandcare-backend.onrender.com`
- **Frontend**: `https://clickandcare-frontend.onrender.com`
- **Admin Panel**: `https://clickandcare-admin.onrender.com`

## 🔧 Manual Deployment (Alternative)
If you prefer manual deployment:

### Backend Service
- **Type**: Web Service
- **Environment**: Node
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### Frontend Service
- **Type**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

### Admin Service
- **Type**: Static Site
- **Build Command**: `cd admin && npm install && npm run build`
- **Publish Directory**: `admin/dist`

## 🚨 Important Notes

### CORS Configuration
The backend is configured to accept requests from:
- Frontend URL
- Admin URL
- Local development URLs

### Health Check
Test your backend: `https://clickandcare-backend.onrender.com/api/health`

### Static File Serving
In production, the backend serves both frontend and admin:
- Frontend: `https://clickandcare-backend.onrender.com`
- Admin: `https://clickandcare-backend.onrender.com/admin`

## 🐛 Troubleshooting

### Common Issues
1. **Build Failures**: Check package.json dependencies
2. **Environment Variables**: Ensure all required variables are set
3. **CORS Errors**: Verify frontend/admin URLs in backend environment
4. **Database Connection**: Check MongoDB URI and network access

### Check Logs
- Backend logs: API errors, database issues
- Frontend/Admin logs: Build errors

## 📚 Detailed Documentation
For comprehensive deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔒 Security
- Use strong JWT secrets
- Enable MongoDB network access for Render IPs
- Use environment variables for sensitive data
- HTTPS is automatic with Render

## 📈 Performance
- Enable auto-scaling if needed
- Optimize images before upload
- Monitor API response times
- Set up health checks

---
**Need help?** Check the logs in Render dashboard or refer to the detailed deployment guide. 