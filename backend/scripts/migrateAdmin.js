import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../models/adminModel.js';

dotenv.config();

const migrateAdmin = async () => {
  try {
    console.log('Starting admin migration...');
    console.log('Environment variables:');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? 'Set' : 'NOT SET');
    console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'Set' : 'NOT SET');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'NOT SET');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Check if admin already exists
    console.log('Checking for existing admin...');
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Admin account already exists. Skipping migration.');
      console.log('Admin ID:', existingAdmin._id);
      console.log('Admin Email:', existingAdmin.email);
      console.log('Recovery emails:', existingAdmin.recoveryEmails.map(re => re.email));
      return;
    }

    console.log('No existing admin found. Creating new admin account...');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    // Create admin account
    const adminData = {
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      recoveryEmails: [
        {
          email: process.env.ADMIN_EMAIL, // Add the admin email as the first recovery email
          name: 'Primary Admin',
          isActive: true
        }
      ],
      isActive: true
    };

    console.log('Creating admin with data:', { ...adminData, password: '[HIDDEN]' });

    const admin = new Admin(adminData);
    await admin.save();

    console.log('Admin account created successfully!');
    console.log('Admin ID:', admin._id);
    console.log('Email:', process.env.ADMIN_EMAIL);
    console.log('Recovery emails:', admin.recoveryEmails.map(re => re.email));
    console.log('\nYou can now:');
    console.log('1. Login with your existing credentials');
    console.log('2. Add more recovery emails through the admin settings');
    console.log('3. Use the forgot password feature');

  } catch (error) {
    console.error('Migration failed:', error);
    console.error('Error stack:', error.stack);
  } finally {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateAdmin();
}

export default migrateAdmin; 