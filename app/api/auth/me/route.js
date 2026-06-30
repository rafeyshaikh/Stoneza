import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import User from "@/models/User.model";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return response(false, 401, "Unauthorized");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const { payload } = await jwtVerify(token, secret);

    const user = await User.findById(payload.id).select(
      "-password -deletedAt"
    );

    if (!user) {
      return response(false, 404, "User not found");
    }

    return response(true, 200, "User fetched successfully", user);
  } catch (error) {
    console.error("Error fetching user:", error);

    return response(false, 500, "Internal Server Error");
  }
}