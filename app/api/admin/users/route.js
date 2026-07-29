import { connectDB } from "@/lib/databaseConnection";
import { ensureSuperAdminApi } from "@/lib/adminAuth";
import { response } from "@/lib/helperFunction";
import User from "@/models/User.model";

export const maxDuration = 60;

export async function GET() {
  try {
    const admin = await ensureSuperAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();
    const users = await User.find({}, "-password").sort({ createdAt: -1 }).lean();

    return response(true, 200, "Users fetched successfully", users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return response(false, 500, "Failed to fetch users");
  }
}

export async function PATCH(request) {
  try {
    const admin = await ensureSuperAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return response(false, 400, "User ID and Role are required");
    }

    if (!["user", "admin", "subadmin"].includes(role)) {
      return response(false, 400, "Invalid role");
    }

    // Prevent demoting self
    if (userId === admin.payload.id && role !== "admin") {
      return response(false, 400, "You cannot remove your own admin access");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return response(false, 404, "User not found");
    }

    return response(true, 200, `User role updated to ${role} successfully`, updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return response(false, 500, error.message || "Failed to update user role");
  }
}

export async function DELETE(request) {
  try {
    const admin = await ensureSuperAdminApi();
    if (!admin.authorized) {
      return admin.response;
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return response(false, 400, "User ID is required");
    }

    // Prevent deleting self
    if (userId === admin.payload.id) {
      return response(false, 400, "You cannot delete your own account");
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return response(false, 404, "User not found");
    }

    return response(true, 200, "User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    return response(false, 500, error.message || "Failed to delete user");
  }
}
