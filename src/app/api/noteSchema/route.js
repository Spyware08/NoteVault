import { NextResponse } from "next/server";
import mongoose from "mongoose";
import noteSchema from "@/models/noteSchema";
import imageSchema from "@/models/imageSchema";
import connectDB from "@/lib/mongoose";

export async function POST(req) {

  try {
    
    await connectDB();
    const {title, note, image,userId } = await req.json();
    const newNote = await noteSchema.create({
      title,
      note,
      userId:userId
    });

    // 2️⃣ If image exists → Save Image
    if (image) {

      await imageSchema.create({
        imageBase: image,
        userId,
        noteId: newNote._id
      });

    }

    return NextResponse.json({
      success: true,
      message: "Note created"
    });

  } catch (error) {
    console.log(error)

    return NextResponse.json({
      success: false,
      message: "Server error"
    });

  }

}


export async function GET(req) {

  try {

    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const notes = await noteSchema.aggregate([

      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },

      {
        $lookup: {
          from: "images",        // collection name
          localField: "_id",     // Note._id
          foreignField: "noteId",// Image.noteId
          as: "images"
        }
      }

    ]);

    return NextResponse.json({
      success: true,
      notes
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error"
    });

  }

}