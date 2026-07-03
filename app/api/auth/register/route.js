import { connectDB } from "@/lib/databaseConnection";
import { zSchema } from "@/lib/zodSchema";
import { response } from "@/lib/helperFunction";
import User from "@/models/User.model";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerificationLink";

export async function POST(request) {
  try {
    await connectDB();

    const validationSchema = zSchema.pick({
      name: true,
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
        validationResult.error.flatten(),
      );
    }

    const { name, email, password } = validationResult.data;

    // Check if the user already exists

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(
        false,
        409,
        "User with this email already exists",
        {},
      );
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ email: newUser.email, id: newUser._id.toString() })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    try {
      await sendMail({
        subject: "Email Verification request from Stoneza",
        receiver: email,
        body: emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`,
        ),
      });
    } catch (mailError) {
      console.error("Verification email send failed:", mailError);

      return response(
        true,
        201,
        "User created, but verification email could not be sent. Please retry.",
        {
          email: newUser.email,
          verificationEmailSent: false,
        },
      );
    }

    return response(true, 201, "User created successfully", {
      email: newUser.email,
      verificationEmailSent: true,
    });
  } catch (error) {
    console.error("Error in register route:", error);

    if (error?.code === 11000) {
      return response(false, 409, "User with this email already exists");
    }

    return response(false, 500, "Internal Server Error");
  }
}
