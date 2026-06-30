import { response } from "@/lib/helperFunction";

export async function POST() {
  const res = response(true, 200, "Logout successful");

  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  return res;
}