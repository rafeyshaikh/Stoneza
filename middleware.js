import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_PATH_PREFIX = "/admin";
const ADMIN_API_PATH_PREFIX = "/api/admin";

async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith(ADMIN_PATH_PREFIX);
  const isAdminApi = pathname.startsWith(ADMIN_API_PATH_PREFIX);

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);

  if (!payload || payload.role !== "admin") {
    if (isAdminApi) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 },
      );
    }

    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
