import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/Click&Care`);
    console.log('MongoDB connected successfully');
    console.log('Database: Click&Care');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const addPendingFamousDoctors = async () => {
  try {
    // List of 10 famous characters as doctors (NOT approved) - with humorous descriptions
    const pendingDoctors = [
      {
        name: "Dr. Tony Stark",
        email: "tonystark@gmail.com",
        password: "IronMan123!",
        speciality: "Cardiologist",
        experience: 15,
        education: "MIT - Arc Reactor Technology",
        address: {
          line1: "Stark Tower Medical",
          city: "New York",
          state: "New York",
          pincode: "10001"
        },
        consultationFee: 5000,
        description: "Genius billionaire playboy philanthropist cardiologist. Specializes in arc reactor heart surgery. May or may not show up in a flying suit."
      },
      {
        name: "Dr. Sherlock Holmes",
        email: "sherlockholmes@gmail.com",
        password: "Elementary123!",
        speciality: "Psychiatrist",
        experience: 12,
        education: "Oxford University - Deduction Studies",
        address: {
          line1: "221B Baker Street",
          city: "London",
          state: "England",
          pincode: "NW1"
        },
        consultationFee: 300,
        description: "Consulting detective turned psychiatrist. Can diagnose your mental state just by looking at your shoes. Brings violin to sessions."
      },
      {
        name: "Dr. Hermione Granger",
        email: "hermionegranger@gmail.com",
        password: "Wingardium123!",
        speciality: "Neurologist",
        experience: 8,
        education: "Hogwarts School of Medicine",
        address: {
          line1: "Ministry of Magic Hospital",
          city: "London",
          state: "England",
          pincode: "SW1A"
        },
        consultationFee: 250,
        description: "Brightest witch of her age, now a neurologist. Uses both magical and muggle medicine. Always has a book recommendation."
      },
      {
        name: "Dr. Bruce Wayne",
        email: "brucewayne@gmail.com",
        password: "Batman123!",
        speciality: "Orthopedic",
        experience: 20,
        education: "Gotham University - Night Studies",
        address: {
          line1: "Wayne Medical Center",
          city: "Gotham",
          state: "New Jersey",
          pincode: "07101"
        },
        consultationFee: 1000,
        description: "Billionaire orthopedic surgeon by day, vigilante by night. Specializes in treating injuries he probably caused. Very mysterious."
      },
      {
        name: "Dr. Princess Leia",
        email: "princessleia@gmail.com",
        password: "Force123!",
        speciality: "Gynecologist",
        experience: 18,
        education: "Alderaan Medical Academy",
        address: {
          line1: "Rebel Alliance Medical",
          city: "Coruscant",
          state: "Galaxy",
          pincode: "00001"
        },
        consultationFee: 400,
        description: "Princess turned gynecologist. May the force be with your reproductive health. Wears hair buns even during surgery."
      },
      {
        name: "Dr. Indiana Jones",
        email: "indianajones@gmail.com",
        password: "Raiders123!",
        speciality: "General Physician",
        experience: 25,
        education: "Marshall College - Archaeology Medicine",
        address: {
          line1: "Adventure Medical Clinic",
          city: "Springfield",
          state: "Illinois",
          pincode: "62701"
        },
        consultationFee: 150,
        description: "Archaeologist turned general physician. Hates snakes, loves fedoras. Will prescribe adventure along with medicine."
      },
      {
        name: "Dr. Wonder Woman",
        email: "wonderwoman@gmail.com",
        password: "Amazon123!",
        speciality: "Dermatologist",
        experience: 3000,
        education: "Themyscira Medical Academy",
        address: {
          line1: "Amazonian Skin Care",
          city: "Themyscira",
          state: "Paradise Island",
          pincode: "12345"
        },
        consultationFee: 600,
        description: "Amazonian warrior dermatologist. 3000 years of experience in skin care. Uses lasso of truth for honest diagnoses."
      },
      {
        name: "Dr. James Bond",
        email: "jamesbond@gmail.com",
        password: "007123!",
        speciality: "ENT Specialist",
        experience: 15,
        education: "MI6 Medical Training",
        address: {
          line1: "Secret Service Medical",
          city: "London",
          state: "England",
          pincode: "SW1A"
        },
        consultationFee: 700,
        description: "Licensed to heal. Specializes in treating injuries from high-speed chases and explosions. Shaken, not stirred consultations."
      },
      {
        name: "Dr. Black Widow",
        email: "blackwidow@gmail.com",
        password: "Widow123!",
        speciality: "Oncologist",
        experience: 12,
        education: "Red Room Medical Academy",
        address: {
          line1: "Avengers Medical Center",
          city: "New York",
          state: "New York",
          pincode: "10001"
        },
        consultationFee: 450,
        description: "Former assassin turned oncologist. Fights cancer like she fights bad guys. Very flexible during physical exams."
      },
      {
        name: "Dr. Captain America",
        email: "captainamerica@gmail.com",
        password: "America123!",
        speciality: "Pediatrician",
        experience: 80,
        education: "Brooklyn Medical School",
        address: {
          line1: "Avengers Children's Hospital",
          city: "Brooklyn",
          state: "New York",
          pincode: "11201"
        },
        consultationFee: 200,
        description: "America's favorite pediatrician. Can do this all day. Specializes in treating kids with super soldier serum side effects."
             }
     ];

    console.log('🚀 Adding 10 pending famous doctors...\n');

    for (let i = 0; i < pendingDoctors.length; i++) {
      const doctorData = pendingDoctors[i];
      
      try {
        // Check if doctor already exists
        const existingDoctor = await doctorModel.findOne({ email: doctorData.email });
        if (existingDoctor) {
          console.log(`⚠️  Doctor ${doctorData.name} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(doctorData.password, 10);

        // Create doctor object (without image upload)
        const newDoctor = new doctorModel({
          name: doctorData.name,
          email: doctorData.email,
          password: hashedPassword,
          speciality: doctorData.speciality,
          experience: doctorData.experience,
          education: doctorData.education,
          address: doctorData.address,
          consultationFee: doctorData.consultationFee,
          fees: doctorData.consultationFee, // Add fees field
          about: doctorData.description, // Add about field
          degree: doctorData.education, // Add degree field
          date: new Date(), // Add date field
          description: doctorData.description,
          approved: false, // Set as pending
          available: true,
          emailVerified: true,
          slots_booked: {}
        });

        // Save to database
        await newDoctor.save();
        console.log(`✅ Added pending doctor: ${doctorData.name} (${doctorData.speciality})`);

      } catch (error) {
        console.error(`❌ Error adding ${doctorData.name}:`, error.message);
      }
    }

    console.log('\n🎉 Finished adding pending famous doctors!');
    console.log('📋 These doctors will appear in the admin pending list for approval.');

  } catch (error) {
    console.error('Error adding pending doctors:', error);
  }
};

const run = async () => {
  await connectDB();
  await addPendingFamousDoctors();
  process.exit(0);
};

run(); 