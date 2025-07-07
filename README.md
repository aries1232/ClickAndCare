**Website :** https://click-and-care.onrender.com/

**Preview(Demo) :** https://drive.google.com/file/d/1TF8maPpVmHNe7fimOnMwRH7kRJUskbMU/view?pli=1

**ScreenShots**


HomePage : 
![image](https://github.com/user-attachments/assets/a7b24801-068c-4b06-b60d-b392aca2ffe2)

My appointments :  
![image](https://github.com/user-attachments/assets/f2fae583-1f06-4671-88a5-f5f297d20058)
All Doctors : 
![image](https://github.com/user-attachments/assets/708da8de-cbd2-4f59-bae8-7d7431944b1d)

Payment Gateway :
![image](https://github.com/user-attachments/assets/d01a597e-a945-430b-b084-b1230f94ed63)


Admin DashBoard : 
![image](https://github.com/user-attachments/assets/b80bc2ea-6806-43b0-98ac-4e4da09e3cf7)


Doctor Panel :  
![image](https://github.com/user-attachments/assets/dd45ad61-50bb-4b46-9acc-209e6598f3f6)
 


 
**# ClickAndCare**
Frontend 

ClickAndCare is a seamless doctor appointment booking platform designed to make healthcare access easy and hassle-free. With just a few clicks, patients can browse verified doctors, check availability, and schedule appointments at their convenience. Our goal is to bridge the gap between patients and healthcare professionals, ensuring a smooth and reliable experience for everyone.

## Features
- Browse doctors by speciality
- View doctor profiles and availability
- Book appointments
- Manage user profile
- View and manage appointments
- Secure payment processing

## User Guide

### Home Page

The home page provides an overview of the platform and allows users to navigate to different sections such as finding doctors by speciality, viewing top doctors, and more.

### Finding Doctors

1. Navigate to the "All Doctors" page to view a list of all available doctors.
2. Use the speciality menu to filter doctors by their speciality.
3. Click on a doctor's profile to view more details and book an appointment.

### Booking an Appointment

1. Select a doctor and navigate to their profile page.
2. Choose an available slot from the booking slots section.
3. Click "Book an Appointment" and follow the instructions to complete the booking.

### Managing Appointments

1. Navigate to the "My Appointments" page to view all your booked appointments.
2. You can cancel an appointment or make a payment if required.

### User Profile

1. Navigate to the "My Profile" page to view and edit your profile information.
2. Update your personal details and save the changes.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ClickAndCare.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ClickAndCare/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

# Backend API Documentation

## Doctor Routes

### Authentication & Registration

#### 1. Send Signup OTP

- **Endpoint:** `/send-signup-otp`
- **Method:** `POST`
- **Description:** Sends a 6-digit OTP to the provided email for doctor registration verification.
- **Request Body:**
  ```json
  {
    "email": "doctor@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to your email"
  }
  ```

#### 2. Verify Signup OTP

- **Endpoint:** `/verify-signup-otp`
- **Method:** `POST`
- **Description:** Verifies the OTP sent to the email and marks the email as verified.
- **Request Body:**
  ```json
  {
    "email": "doctor@example.com",
    "otp": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Email verified successfully! You can now complete your registration."
  }
  ```

#### 3. Doctor Signup

- **Endpoint:** `/signup`
- **Method:** `POST`
- **Description:** Registers a new doctor (requires email verification first).
- **Request Body:** FormData with the following fields:
  - `name`: Doctor's full name
  - `email`: Verified email address
  - `password`: Password
  - `speciality`: Medical speciality
  - `degree`: Educational degree
  - `experience`: Years of experience
  - `about`: About the doctor
  - `fees`: Consultation fees
  - `address`: Complete address
  - `image`: Profile picture (optional)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Registration successful! Please wait for admin approval."
  }
  ```

#### 4. Doctor Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Authenticates a doctor and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email": "doctor@example.com",
    "password": "password"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "jwt_token"
  }
  ```

### Doctor Dashboard

#### 5. Get Doctor Dashboard

- **Endpoint:** `/dashboard`
- **Method:** `GET`
- **Description:** Retrieves dashboard data for the logged-in doctor.
- **Headers:**
  ```json
  {
    "dtoken": "jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "docId": "doctor_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "dashData": {
      "earnings": 5000,
      "appointments": 25,
      "patients": 20,
      "latestAppointments": [...]
    }
  }
  ```

#### 6. Get Doctor Appointments

- **Endpoint:** `/appointments`
- **Method:** `GET`
- **Description:** Retrieves all appointments for the logged-in doctor.
- **Headers:**
  ```json
  {
    "dtoken": "jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "docId": "doctor_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "appointments": [...]
  }
  ```

#### 7. Complete Appointment

- **Endpoint:** `/complete-appointment`
- **Method:** `POST`
- **Description:** Marks an appointment as completed.
- **Headers:**
  ```json
  {
    "dtoken": "jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "docId": "doctor_id",
    "appointmentId": "appointment_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Appointment Completed"
  }
  ```

#### 8. Cancel Appointment

- **Endpoint:** `/cancel-appointment`
- **Method:** `POST`
- **Description:** Cancels an appointment.
- **Headers:**
  ```json
  {
    "dtoken": "jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "docId": "doctor_id",
    "appointmentId": "appointment_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Appointment Cancelled"
  }
  ```

### Profile Management

#### 9. Get Doctor Profile

- **Endpoint:** `/profile`
- **Method:** `GET`
- **Description:** Retrieves the profile data of the logged-in doctor.
- **Headers:**
  ```json
  {
    "dtoken": "jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "docId": "doctor_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "doctorData": {...}
  }
  ```

#### 10. Update Doctor Profile

- **Endpoint:** `/update-profile`
- **Method:** `POST`
- **Description:** Updates the profile information of the logged-in doctor.
- **Headers:**
  ```json
  {
    "dtoken": "jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "docId": "doctor_id",
    "fees": 500,
    "address": "New Address",
    "available": true,
    "about": "Updated about section"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile Updated"
  }
  ```

#### 11. Update Profile Picture

- **Endpoint:** `/update-profile-picture`
- **Method:** `POST`
- **Description:** Updates the profile picture of the logged-in doctor.
- **Headers:**
  ```json
  {
    "dtoken": "jwt_token"
  }
  ```
- **Request Body:** FormData with `image` field
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile picture updated successfully",
    "image": "image_url"
  }
  ```

### Public Endpoints

#### 12. Get Doctors (Frontend)

- **Endpoint:** `/get-doctors`
- **Method:** `POST`
- **Description:** Retrieves a list of all approved doctors with profile pictures (for frontend display).
- **Response:**
  ```json
  {
    "success": true,
    "doctors": [...]
  }
  ```

## User Workflow

### Doctor Registration Process

1. **Email Verification:**
   - User enters email on `/doctor-signup-otp`
   - System sends 6-digit OTP to email
   - User verifies OTP
   - Email is marked as verified

2. **Complete Registration:**
   - User fills registration form on `/doctor-signup`
   - System checks if email is verified
   - If verified, registration proceeds
   - If not verified, redirects to OTP page

3. **Admin Approval:**
   - Admin reviews pending doctors
   - Approves/rejects based on profile picture and information
   - Approved doctors appear in frontend

4. **Profile Picture Requirement:**
   - Doctors must upload profile picture to appear in admin panel
   - Can be added during registration or later in profile settings

### Security Features

- **Email Verification:** Required before registration
- **OTP Expiry:** 10 minutes
- **JWT Authentication:** For all protected routes
- **Password Hashing:** Using bcrypt
- **File Upload Security:** Cloudinary integration with validation

## Admin Routes

### Base URL

`/api/admin`

### Routes

#### 1. Login Admin

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Authenticates the admin and returns a token.
- **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "adminpassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "jwt_token"
  }
  ```

#### 2. Approve Doctor

- **Endpoint:** `/approve-doctor`
- **Method:** `POST`
- **Description:** Approves or rejects a doctor registration.
- **Headers:**
  ```json
  {
    "atoken": "jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "doctorId": "doctor_id",
    "approved": true
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Doctor approved successfully!"
  }
  ```

#### 3. Get Pending Doctors

- **Endpoint:** `/pending-doctors`
- **Method:** `GET`
- **Description:** Retrieves a list of all pending doctor registrations (regardless of profile picture status).
- **Headers:**
  ```json
  {
    "atoken": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "pendingDoctors": [...]
  }
  ```

#### 4. Get All Doctors

- **Endpoint:** `/all-doctors`
- **Method:** `POST`
- **Description:** Retrieves a list of all doctors with profile pictures (including approval status).
- **Headers:**
  ```json
  {
    "atoken": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "doctors": [...]
  }
  ```

#### 5. Get Dashboard Data

- **Endpoint:** `/dashboard`
- **Method:** `GET`
- **Description:** Retrieves dashboard data for the admin panel.
- **Headers:**
  ```json
  {
    "atoken": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "dashData": {
      "doctors": 10,
      "pendingDoctors": 5,
      "patients": 50,
      "appointments": 100,
      "latestAppointments": [...]
    }
  }
  ```

#### 6. Get All Appointments

- **Endpoint:** `/appointments`
- **Method:** `GET`
- **Description:** Retrieves a list of all appointments.
- **Headers:**
  ```json
  {
    "atoken": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "appointments": [...]
  }
  ```

#### 7. Cancel Appointment

- **Endpoint:** `/cancel-appointment`
- **Method:** `POST`
- **Description:** Cancels an appointment.
- **Headers:**
  ```json
  {
    "atoken": "jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "appointmentId": "appointment_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Appointment Cancelled Successfully!"
  }
  ```

#### 8. Change Availability

- **Endpoint:** `/change-availablity`
- **Method:** `POST`
- **Description:** Changes the availability of a doctor.
- **Headers:**
  ```json
  {
    "atoken": "jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "doctorId": "doctor_id",
    "availability": [...]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Availability Updated"
  }
  ```

#### 9. Approve Existing Doctors (Migration)

- **Endpoint:** `/approve-existing-doctors`
- **Method:** `POST`
- **Description:** Approves all existing doctors who don't have the approved field set (migration helper).
- **Headers:**
  ```json
  {
    "atoken": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully approved X existing doctors",
    "modifiedCount": 5
  }
  ```

### Middleware

#### Admin Authentication

- **File:** `middlewares/adminAuth.js`
- **Description:** Middleware to authenticate admin requests using JWT.

### Models

#### Doctor Model

- **File:** `models/doctorModel.js`
- **Description:** Mongoose model for doctor data.

#### Appointment Model

- **File:** `models/appointmentModel.js`
- **Description:** Mongoose model for appointment data.

#### User Model

- **File:** `models/userModel.js`
- **Description:** Mongoose model for user data.

### Controllers

#### Admin Controller

- **File:** `controllers/adminController.js`
- **Description:** Contains functions for handling admin-related routes.

### How to Run

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables in a `.env` file.
4. Start the server using `npm start`.


## Contributing

We welcome contributions from the community. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Create a pull request with a detailed description of your changes.

## Admin Panel Routes

### Authentication Routes

- **Landing Page**: `/` - Choose between admin and doctor login
- **Admin Login**: `/admin-login` - Admin authentication
- **Doctor Login**: `/doctor-login` - Doctor authentication  
- **Doctor Signup**: `/doctor-signup` - Doctor registration

### Admin Dashboard Routes

- **Dashboard**: `/dashboard` - Admin dashboard with statistics
- **Pending Doctors**: `/pending-doctors` - Review and approve doctor registrations
- **All Doctors**: `/doctor-list` - View all approved doctors
- **All Appointments**: `/all-appointments` - Manage all appointments

### Doctor Dashboard Routes

- **Doctor Dashboard**: `/doctor-dashboard` - Doctor's main dashboard
- **Doctor Profile**: `/doctor-profile` - Update profile and settings
- **Doctor Appointments**: `/doctor-appointments` - View and manage appointments
