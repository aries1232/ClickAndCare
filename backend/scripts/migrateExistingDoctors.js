import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function
const migrateExistingDoctors = async () => {
  try {
    // Get the doctor model
    const doctorModel = mongoose.model('doctor');
    
    // Find all doctors that don't have the approved field set
    const doctorsToUpdate = await doctorModel.find({ approved: { $exists: false } });
    
    console.log(`Found ${doctorsToUpdate.length} doctors without approved field`);
    
    if (doctorsToUpdate.length > 0) {
      // Update all existing doctors to be approved
      const result = await doctorModel.updateMany(
        { approved: { $exists: false } },
        { $set: { approved: true } }
      );
      
      console.log(`Successfully updated ${result.modifiedCount} doctors to approved status`);
    } else {
      console.log('No doctors found without approved field');
    }
    
    // Also update doctors where approved is explicitly false but they have an image
    const pendingWithImage = await doctorModel.find({ 
      approved: false, 
      image: { $ne: null, $exists: true } 
    });
    
    console.log(`Found ${pendingWithImage.length} pending doctors with profile pictures`);
    
    if (pendingWithImage.length > 0) {
      const result2 = await doctorModel.updateMany(
        { approved: false, image: { $ne: null, $exists: true } },
        { $set: { approved: true } }
      );
      
      console.log(`Successfully approved ${result2.modifiedCount} doctors with profile pictures`);
    }
    
  } catch (error) {
    console.error('Migration error:', error);
  }
};

// Run migration
const runMigration = async () => {
  await connectDB();
  await migrateExistingDoctors();
  console.log('Migration completed');
  process.exit(0);
};

runMigration(); 