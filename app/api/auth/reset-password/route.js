import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import User from "@/models/User.model";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return response(false, 400, "Email, verification code, and new password are required");
    }

    if (newPassword.length < 8) {
      return response(false, 400, "Password must be at least 8 characters long");
    }

    // Find user with matching email, OTP, and valid expiration date
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordOtp: otp.toString().trim(),
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordOtp +resetPasswordExpires");

    if (!user) {
      return response(false, 400, "Invalid or expired verification code");
    }

    // Set new password and reset OTP fields
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;

    // Save user (pre('save') hook handles bcrypt hashing automatically)
    await user.save();

    return response(true, 200, "Password reset successfully. You can now log in with your new password.");
  } catch (error) {
    console.error("Error in reset-password route:", error);
    return response(false, 500, "Internal server error");
  }
}
