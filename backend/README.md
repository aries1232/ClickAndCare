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
