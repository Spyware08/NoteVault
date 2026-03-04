import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
   
  try {
    const { name, email, password } = await req.json();

    await connectDB();

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      name,
      email,
      plainpswrd:password,
      password: hashedPassword
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );

  } catch (error) {
    console.error("FULL ERROR 👉", error);

  return NextResponse.json(
    { message: "Something went wrong", error: error.message },
    { status: 500 }
  );
  }
}