import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import User from "@/models/User.model";

export async function POST(request) {
  try {
    await connectDB();

    // Authenticate user via JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return response(false, 401, "Authentication required. Please log in.");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    if (!payload?.id) {
      return response(false, 401, "Invalid session. Please log in again.");
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return response(false, 400, "Current password and new password are required");
    }

    if (newPassword.length < 8) {
      return response(false, 400, "New password must be at least 8 characters long");
    }

    const user = await User.findById(payload.id).select("+password");

    if (!user) {
      return response(false, 404, "User account not found");
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return response(false, 400, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return response(true, 200, "Password changed successfully");
  } catch (error) {
    console.error("Error in change-password route:", error);
    return response(false, 500, error?.message || "Internal server error");
  }
}
