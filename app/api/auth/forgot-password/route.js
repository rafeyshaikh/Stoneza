import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import User from "@/models/User.model";
import { sendMail } from "@/lib/sendMail";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return response(false, 400, "Email address is required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // For security, return success message even if email is not found to prevent email enumeration
      return response(true, 200, "If an account exists with that email, a password reset code has been sent.");
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Valid for 15 minutes

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    // Prepare email HTML template
    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px; background-color: #f9f8f6; border-radius: 16px; border: 1px solid #e5e2dc;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="font-size: 24px; font-weight: 600; color: #2c2520; margin: 0; letter-spacing: 2px; text-transform: uppercase;">STONEZA</h2>
          <p style="font-size: 13px; color: #78716c; margin-top: 4px;">Natural Stone & Luxury Living</p>
        </div>

        <div style="background-color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #eae7e1;">
          <h3 style="font-size: 18px; color: #1c1917; margin-top: 0; margin-bottom: 12px;">Password Reset Request</h3>
          <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your Stoneza account password. Use the verification code below to set a new password. This code expires in <strong>15 minutes</strong>.
          </p>

          <div style="text-align: center; background-color: #f4f2ed; padding: 18px; border-radius: 8px; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2c2520; margin-bottom: 20px;">
            ${otp}
          </div>

          <p style="font-size: 12px; color: #78716c; line-height: 1.5; margin: 0;">
            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #a8a29e;">
          &copy; ${new Date().getFullYear()} Stoneza. All rights reserved.
        </div>
      </div>
    `;

    try {
      await sendMail({
        subject: "Your Stoneza Password Reset Code",
        receiver: user.email,
        body: emailHtml,
      });
    } catch (mailError) {
      console.warn("SMTP mail delivery failed:", mailError.message);
    }

    return response(true, 200, "If an account exists with that email, a password reset code has been sent.");
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return response(false, 500, "Internal server error");
  }
}
