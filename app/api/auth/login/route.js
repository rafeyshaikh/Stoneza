import { SignJWT } from "jose";

import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import User from "@/models/User.model";

export async function POST(request) {
  try {
    await connectDB();

    const validationSchema = zSchema.pick({
      email: true,
      password: true,
    });

    const requestBody = await request.json();

    const validationResult = validationSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return response(
        false,
        400,
        "Invalid or missing input fields",
        validationResult.error.flatten()
      );
    }

    const { email, password } = validationResult.data;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return response(false, 404, "User not found");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return response(false, 401, "Invalid email or password");
    }

    if (!user.isEmailVerified) {
      return response(
        false,
        403,
        "Please verify your email before logging in"
      );
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const res = response(true, 200, "Login successful", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
      token,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Error in login route:", error);

    return response(false, 500, "Internal Server Error");
  }
}