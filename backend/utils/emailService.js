import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Debug: Check if environment variables are loaded
console.log('Email configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'NOT SET');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send OTP verification email
export const sendOTPEmail = async (email, otp, name) => {
  console.log('Attempting to send OTP email to:', email);
  console.log('OTP:', otp);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification OTP - ClickAndCare',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
          <h1>ClickAndCare</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Hello ${name}!</h2>
          <p>Thank you for registering with ClickAndCare. Please use the OTP below to verify your email address.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f8f9fa; border: 2px solid #4F46E5; border-radius: 10px; padding: 20px; display: inline-block;">
              <h3 style="margin: 0; color: #4F46E5; font-size: 24px;">Your OTP</h3>
              <div style="font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px; margin: 10px 0;">${otp}</div>
              <p style="margin: 0; color: #666; font-size: 14px;">Enter this code to verify your email</p>
            </div>
          </div>
          
          <p><strong>Important:</strong></p>
          <ul>
            <li>This OTP will expire in 10 minutes</li>
            <li>Do not share this OTP with anyone</li>
            <li>If you didn't request this verification, please ignore this email</li>
          </ul>
          
          <p>Thank you for choosing ClickAndCare!</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d;">
          <p>&copy; 2024 ClickAndCare. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
    return false;
  }
};

// Send appointment confirmation email
export const sendAppointmentConfirmation = async (email, appointmentData, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Appointment Confirmation - ClickAndCare',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
          <h1>ClickAndCare</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Appointment Confirmed!</h2>
          <p>Hello ${userName},</p>
          <p>Your appointment has been successfully booked. Here are the details:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Appointment Details</h3>
            <p><strong>Doctor:</strong> ${appointmentData.docData.name}</p>
            <p><strong>Speciality:</strong> ${appointmentData.docData.speciality}</p>
            <p><strong>Date:</strong> ${appointmentData.slotDate}</p>
            <p><strong>Time:</strong> ${appointmentData.slotTime}</p>
            <p><strong>Fee:</strong> ₹${appointmentData.amount}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Doctor Information</h3>
            <p><strong>Name:</strong> ${appointmentData.docData.name}</p>
            <p><strong>Degree:</strong> ${appointmentData.docData.degree}</p>
            <p><strong>Experience:</strong> ${appointmentData.docData.experience}</p>
            <p><strong>About:</strong> ${appointmentData.docData.about}</p>
          </div>
          
          <p><strong>Important Notes:</strong></p>
          <ul>
            <li>Please arrive 10 minutes before your scheduled appointment time</li>
            <li>Bring any relevant medical reports or documents</li>
            <li>If you need to cancel or reschedule, please do so at least 24 hours in advance</li>
          </ul>
          
          <p>Thank you for choosing ClickAndCare!</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d;">
          <p>&copy; 2024 ClickAndCare. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    return false;
  }
}; 