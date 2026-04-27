import mongoose from "mongoose";

const connectDB = async () => {
    const dbURL = process.env.DB_URL;
  try {
    if(!dbURL){
    console.error(`Error: URL not found in the ENV`);
    }
    const conn = await mongoose.connect(dbURL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;