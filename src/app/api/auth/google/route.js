
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { message: "Google credential is required" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_CLIENT_ID || !JWT_SECRET) {
      return NextResponse.json(
        { message: "Authentication configuration missing" },
        { status: 500 }
      );
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return NextResponse.json(
        { message: "Google email is not verified" },
        { status: 401 }
      );
    }

    await connectDB();

    const email = payload.email.toLowerCase();

    // Find existing user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new Google user
      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        image: payload.picture || "",
      });
    } else {
      // Link Google account to an existing email account
      if (!user.googleId) {
        user.googleId = payload.sub;
      }

      if (user.googleId !== payload.sub) {
        return NextResponse.json(
          { message: "Google account does not match" },
          { status: 401 }
        );
      }

      if (payload.picture) {
        user.image = payload.picture;
      }

      await user.save();
    }

    // Generate application JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return same user structure as normal login
    const response = NextResponse.json(
      {
        message: "Google login successful",
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only authentication cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Google Auth Error:", error);

    return NextResponse.json(
      { message: "Google authentication failed" },
      { status: 401 }
    );
  }
}
