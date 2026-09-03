import mongoose from "mongoose";

// Ensure all Mongoose models are registered in memory (prevents MissingSchemaError on serverless/Vercel)
import "@/models/AboutPage.model";
import "@/models/Blog.model";
import "@/models/Category.model";
import "@/models/Collection.model";
import "@/models/Enquiry.model";
import "@/models/Homepage.model";
import "@/models/Pages.model";
import "@/models/Product.model";
import "@/models/Project.model";
import "@/models/Seo.model";
import "@/models/User.model";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
};