import { connectDB } from "@/lib/databaseConnection";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    return NextResponse.json({ message: "Database connected successfully!" });
}