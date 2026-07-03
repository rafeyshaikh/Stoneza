import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { response } from "@/lib/helperFunction";

const ADMIN_ROLE = "admin";

export async function getSessionUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch {
    return null;
  }
}

export async function ensureAdminApi() {
  const payload = await getSessionUserFromCookie();

  if (!payload) {
    return {
      authorized: false,
      response: response(false, 401, "Unauthorized"),
      payload: null,
    };
  }

  if (payload.role !== ADMIN_ROLE) {
    return {
      authorized: false,
      response: response(false, 403, "Forbidden"),
      payload,
    };
  }

  return {
    authorized: true,
    response: null,
    payload,
  };
}
