import { jwtVerify } from "jose";

import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import User from "@/models/User.model";

export async function POST(request) {
  try {
    await connectDB();

    const { token } = await request.json();

    console.log("TOKEN:", token);

    if (!token) {
      return response(false, 400, "Token is required");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const { payload } = await jwtVerify(token, secret);

    console.log("PAYLOAD:", payload);

    const user = await User.findById(payload.id);

    console.log("USER:", user);

    if (!user) {
      return response(false, 404, "User not found");
    }

    if (user.isEmailVerified) {
      return response(true, 200, "Email already verified");
    }

    user.isEmailVerified = true;

    await user.save();

    console.log("USER VERIFIED");

    return response(true, 200, "Email verified successfully");
  } catch (error) {
    console.error("Email verification error:", error);

    return response(false, 500, "Invalid or expired verification link");
  }
}