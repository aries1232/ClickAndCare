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

#### 2. Add Doctor

- **Endpoint:** `/add-doctor`
- **Method:** `POST`
- **Description:** Adds a new doctor to the system.
- **Headers:**
  ```json
  {
    "atoken": "jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "name": "Doctor Name",
    "email": "doctor@example.com",
    "password": "password",
    "speciality": "Speciality",
    "degree": "Degree",
    "experience": "Experience",
    "about": "About",
    "fees": "Fees",
    "address": "Address"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Doctor Added"
  }
  ```

#### 3. Get All Doctors

- **Endpoint:** `/all-doctors`
- **Method:** `POST`
- **Description:** Retrieves a list of all doctors.
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

#### 4. Get Dashboard Data

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
      "patients": 50,
      "appointments": 100,
      "latestAppointments": [...]
    }
  }
  ```

#### 5. Get All Appointments

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

#### 6. Cancel Appointment

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

#### 7. Change Availability

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
