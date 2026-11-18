
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Allow authentication pages
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Allow API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // No token: redirect to login
  if (!token) {
    return NextResponse.redirect(
      new URL("/auth", request.url)
    );
  }

  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    jwt.verify(token, JWT_SECRET);

    return NextResponse.next();

  } catch (error) {
    console.error("JWT verification failed:", error.message);

    const response = NextResponse.redirect(
      new URL("/auth/login", request.url)
    );

    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)",
  ],
};
