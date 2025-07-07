# Admin Recovery Email System

This document explains the new admin recovery email system that allows admins to reset their passwords using OTP sent to multiple recovery emails.

## Features

- **Multiple Recovery Emails**: Admins can add multiple recovery emails
- **OTP-based Password Reset**: Secure 6-digit OTP sent to all active recovery emails
- **Email Management**: Add, remove, and toggle recovery emails through admin settings
- **Backward Compatibility**: Existing admin credentials continue to work
- **Security Logging**: All password reset attempts are logged

## Setup Instructions

### 1. Run Migration Script

First, run the migration script to create the admin account in the database:

```bash
cd backend
node scripts/migrateAdmin.js
```

This will:
- Create an admin account using your existing `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables
- Add the admin email as the first recovery email
- Hash the password securely

### 2. Environment Variables

Ensure these environment variables are set in your `.env` file:

```env
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=your-admin-password
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

### 3. Email Service Configuration

Make sure your email service is properly configured in `backend/utils/emailService.js` for sending OTP emails.

## How It Works

### Password Reset Flow

1. **Request Reset**: Admin clicks "Forgot Password" on login page
2. **Enter Email**: Admin enters their admin email address
3. **OTP Generation**: System generates a 6-digit OTP valid for 10 minutes
4. **Email Delivery**: OTP is sent to ALL active recovery emails
5. **OTP Verification**: Admin enters the OTP from any recovery email
6. **Password Reset**: Admin sets a new password

### Recovery Email Management

Admins can manage recovery emails through the Settings page:

- **Add Recovery Email**: Add new email addresses with names
- **Toggle Status**: Activate/deactivate recovery emails
- **Remove Email**: Delete recovery emails (with confirmation)
- **View History**: See when emails were added

## Security Features

- **OTP Expiry**: OTPs expire after 10 minutes
- **Multiple Delivery**: OTP sent to all active recovery emails for redundancy
- **Activity Logging**: All password reset attempts are logged
- **Secure Storage**: Passwords are hashed using bcrypt
- **JWT Tokens**: Secure authentication with JWT tokens

## API Endpoints

### Public Endpoints
- `POST /api/admin/forgot-password` - Request password reset OTP
- `POST /api/admin/reset-password` - Reset password with OTP

### Protected Endpoints (Require Admin Token)
- `GET /api/admin/profile` - Get admin profile and recovery emails
- `POST /api/admin/recovery-email` - Add new recovery email
- `DELETE /api/admin/recovery-email/:email` - Remove recovery email
- `PATCH /api/admin/recovery-email/:email/toggle` - Toggle recovery email status

## Frontend Routes

- `/admin/forgot-password` - Password reset page
- `/admin/settings` - Admin settings page (manage recovery emails)

## Usage Examples

### Adding Recovery Emails

1. Login to admin panel
2. Go to Settings page
3. Add recovery emails with names
4. Recovery emails will receive OTP for password resets

### Password Reset Process

1. On login page, click "Forgot Password"
2. Enter admin email address
3. Check all recovery email inboxes for OTP
4. Enter OTP and new password
5. Login with new password

## Troubleshooting

### OTP Not Received
- Check spam/junk folders
- Verify recovery emails are active
- Check email service configuration
- Ensure admin account exists

### Migration Issues
- Verify environment variables are set
- Check MongoDB connection
- Run migration script again if needed

### Login Issues
- System maintains backward compatibility
- Old credentials should still work
- New JWT format is used for database admins
- Fallback to environment variables for old format

## Database Schema

The admin model includes:

```javascript
{
  email: String,           // Admin email
  password: String,        // Hashed password
  recoveryEmails: [{       // Array of recovery emails
    email: String,         // Recovery email address
    name: String,          // Display name
    isActive: Boolean,     // Active status
    addedAt: Date          // When added
  }],
  resetOTP: {              // OTP for password reset
    code: String,          // 6-digit OTP
    expiresAt: Date        // Expiry time
  },
  lastLogin: Date,         // Last login timestamp
  isActive: Boolean        // Account status
}
```

## Logging

All admin actions are logged including:
- Password reset requests
- Recovery email management
- Login attempts
- OTP generation and delivery

Logs can be viewed in the Admin Logs page. 