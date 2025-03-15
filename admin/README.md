# ClickAndCare Admin Panel

## Overview

The ClickAndCare Admin Panel is a web application that allows administrators and doctors to manage appointments, doctors, and profiles. This documentation provides an overview of the features and functionalities available in the admin panel.

## Features

### Admin Features

1. **Dashboard**
   - View overall statistics including the number of doctors, patients, and appointments.
   - View the latest appointments.

2. **Manage Doctors**
   - Add new doctors.
   - View the list of all doctors.
   - Change the availability status of doctors.

3. **Manage Appointments**
   - View all appointments.
   - Cancel appointments.

4. **Managing Users**

   - Navigate to the "Users" section to view and manage user profiles.
   - Update user information and handle user-related issues.

### Doctor Features

1. **Dashboard**
   - View earnings, number of patients, and appointments.
   - View the latest appointments.

2. **Manage Appointments**
   - View all appointments.
   - Complete or cancel appointments.

3. **Profile Management**
   - View and edit profile details including about, address, fees, and availability.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ClickAndCare.git
   ```

2. Navigate to the admin directory:
   ```bash
   cd ClickAndCare/admin
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the admin directory and add the following environment variables:
   ```env
   VITE_BACKEND_URL=http://your-backend-url
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Login**
   - Admins and doctors can log in using their credentials.

2. **Navigation**
   - Use the sidebar to navigate between different sections such as Dashboard, Appointments, Add Doctor, and Doctor List.

3. **Logout**
   - Click the logout button in the navbar to log out of the application.

## Technologies Used

- React
- Axios
- React Router
- Tailwind CSS
- React Toastify

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.
