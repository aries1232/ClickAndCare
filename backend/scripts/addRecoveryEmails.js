import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/adminModel.js';

dotenv.config();

const addRecoveryEmails = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Find the admin account
    let admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!admin) {
      console.log('Admin account not found. Creating one first...');
      
      // Create admin account if it doesn't exist
      const bcrypt = await import('bcrypt');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      
      const newAdmin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        recoveryEmails: [],
        isActive: true
      });
      
      await newAdmin.save();
      console.log('Admin account created successfully');
      
      // Use the newly created admin
      admin = newAdmin;
    }

    // Recovery emails to add
    const recoveryEmails = [
      {
        email: 'mishraaman1011@gmail.com',
        name: 'Aman',
        isActive: true
      },
      {
        email: 'abhishek.20226165@mnnit.ac.in',
        name: 'Abhishek',
        isActive: true
      }
    ];

    // Check if emails already exist
    for (const recoveryEmail of recoveryEmails) {
      const existingEmail = admin.recoveryEmails.find(re => re.email === recoveryEmail.email.toLowerCase());
      
      if (existingEmail) {
        console.log(`Recovery email ${recoveryEmail.email} already exists. Skipping...`);
      } else {
        // Add new recovery email
        admin.recoveryEmails.push({
          email: recoveryEmail.email.toLowerCase(),
          name: recoveryEmail.name,
          isActive: recoveryEmail.isActive
        });
        console.log(`Added recovery email: ${recoveryEmail.email} (${recoveryEmail.name})`);
      }
    }

    // Save the updated admin
    await admin.save();
    
    console.log('\nRecovery emails updated successfully!');
    console.log('Current recovery emails:');
    admin.recoveryEmails.forEach((re, index) => {
      console.log(`${index + 1}. ${re.name} - ${re.email} (${re.isActive ? 'Active' : 'Inactive'})`);
    });

  } catch (error) {
    console.error('Error adding recovery emails:', error);
  } finally {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
addRecoveryEmails(); 