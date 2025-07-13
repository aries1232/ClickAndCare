# ClickAndCare - Doctor Appointment Booking Platform

A seamless doctor appointment booking platform designed to make healthcare access easy and hassle-free. With just a few clicks, patients can browse verified doctors, check availability, and schedule appointments at their convenience.

## 🌐 Live Demo

**Website:** https://click-and-care.onrender.com/

**Demo Video:** https://drive.google.com/file/d/1TF8maPpVmHNe7fimOnMwRH7kRJUskbMU/view?pli=1

## 📸 Screenshots

### Homepage
![Homepage](https://github.com/user-attachments/assets/a7b24801-068c-4b06-b60d-b392aca2ffe2)

### My Appointments
![My Appointments](https://github.com/user-attachments/assets/f2fae583-1f06-4671-88a5-f5f297d20058)

### All Doctors
![All Doctors](https://github.com/user-attachments/assets/708da8de-cbd2-4f59-bae8-7d7431944b1d)

### Payment Gateway
![Payment Gateway](https://github.com/user-attachments/assets/d01a597e-a945-430b-b084-b1230f94ed63)

### Admin Dashboard
![Admin Dashboard](https://github.com/user-attachments/assets/b80bc2ea-6806-43b0-98ac-4e4da09e3cf7)

### Doctor Panel
![Doctor Panel](https://github.com/user-attachments/assets/dd45ad61-50bb-4b46-9acc-209e6598f3f6)

## ✨ Features

- **Patient Features:**
  - Browse doctors by speciality
  - View doctor profiles and availability
  - Book appointments with real-time slot checking
  - Manage user profile and appointment history
  - Secure payment processing with Stripe
  - Email notifications for appointments

- **Doctor Features:**
  - Professional profile management
  - Appointment scheduling and management
  - Patient history and medical records
  - Earnings tracking and analytics
  - Availability management

- **Admin Features:**
  - Doctor approval and management
  - System-wide appointment monitoring
  - User and doctor analytics
  - Platform administration

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ClickAndCare.git
   cd ClickAndCare
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Install Admin Panel Dependencies**
   ```bash
   cd ../admin
   npm install
   ```

### Environment Setup

1. **Backend Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   PORT=5000
   ```

2. **Frontend Environment Variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

3. **Admin Panel Environment Variables**
   Create a `.env` file in the `admin` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on: http://localhost:5000

2. **Start Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on: http://localhost:3000

3. **Start Admin Panel (in a new terminal)**
   ```bash
   cd admin
   npm start
   ```
   Admin panel will run on: http://localhost:3001

## 🏗️ Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Build
```bash
cd backend
npm start
```

## 🚀 Deployment

### Backend Deployment (Render)
- The backend is deployed on Render
- Environment variables are configured in Render dashboard
- Auto-deploys on push to main branch

### Frontend Deployment
- Can be deployed on Vercel, Netlify, or any static hosting service
- Build the frontend and upload the `build` folder

### Admin Panel Deployment
- Can be deployed on Vercel, Netlify, or any static hosting service
- Build the admin panel and upload the `build` folder

## 🛠️ Tech Stack

### Frontend
- React.js
- Material-UI
- Axios
- React Router
- Stripe (payment processing)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io (real-time features)
- Cloudinary (image upload)
- Nodemailer (email notifications)
- Stripe (payment processing)

### Admin Panel
- React.js
- Material-UI
- Axios
- React Router

## 📁 Project Structure

```
ClickAndCare/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── admin/            # React admin panel
├── package.json      # Root package.json
└── README.md         # This file
```

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Admin Panel
- `npm start` - Start development server
- `npm run build` - Build for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email support@clickandcare.com or create an issue in this repository.
