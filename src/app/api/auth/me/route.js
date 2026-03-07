import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = "my_super_secret_jwt_key_12345";

export async function GET(req) {

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    return NextResponse.json({ user: decoded });

  } catch {

    return NextResponse.json({ user: null });

  }

}