import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = "my_super_secret_jwt_key_12345";

export function proxy(request) {

  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // allow auth pages
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // allow API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // if no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};