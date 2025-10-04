import mongoose from "mongoose";

// Asynchronous function to connect to MongoDB
export const connectDB = async () => {
  try {
    // Attempt to connect to the database using the URI from environment variables
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log any errors and exit the process if connection fails
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

