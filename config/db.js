import mongoose from "mongoose";
import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: '.env' });

const URI = process.env.MONGO_URI
const CLOUD_URI = process.env.MONGO_CLOUD_URI
const DB = process.env.DATABASE_NAME;

const connectDB = async () => {
  try {
    await mongoose.connect(URI || CLOUD_URI, { dbName: DB });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
