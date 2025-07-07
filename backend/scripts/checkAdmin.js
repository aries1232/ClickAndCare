import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/adminModel.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    console.log('\nEnvironment variables:');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL : 'NOT SET');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');

    // Check all admins in database
    console.log('\nChecking all admin accounts in database:');
    const allAdmins = await Admin.find({});
    
    if (allAdmins.length === 0) {
      console.log('❌ No admin accounts found in database');
    } else {
      console.log(`✅ Found ${allAdmins.length} admin account(s):`);
      allAdmins.forEach((admin, index) => {
        console.log(`\nAdmin ${index + 1}:`);
        console.log('  ID:', admin._id);
        console.log('  Email:', admin.email);
        console.log('  Is Active:', admin.isActive);
        console.log('  Recovery Emails:', admin.recoveryEmails.length);
        admin.recoveryEmails.forEach((re, i) => {
          console.log(`    ${i + 1}. ${re.name} - ${re.email} (${re.isActive ? 'Active' : 'Inactive'})`);
        });
      });
    }

    // Check specific admin by environment email
    console.log('\nLooking for admin with environment email:');
    const adminByEmail = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (adminByEmail) {
      console.log('✅ Found admin with environment email');
      console.log('  ID:', adminByEmail._id);
      console.log('  Email:', adminByEmail.email);
      console.log('  Is Active:', adminByEmail.isActive);
    } else {
      console.log('❌ No admin found with environment email');
    }

  } catch (error) {
    console.error('Error checking admin:', error);
  } finally {
    console.log('\nDisconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
checkAdmin(); 