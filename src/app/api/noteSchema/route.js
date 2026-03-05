import { NextResponse } from "next/server";
import mongoose from "mongoose";
import noteSchema from "@/models/noteSchema";
import imageSchema from "@/models/imageSchema";
import connectDB from "@/lib/mongoose";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {

  try {

    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title");
    const note = formData.get("note");
    const userId = formData.get("userId");

    const images = formData.getAll("images");

    // 1️⃣ Create note
    const newNote = await noteSchema.create({
      title,
      note,
      userId
    });

    // 2️⃣ Upload images to Cloudinary
    for (const file of images) {

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {

        cloudinary.uploader.upload_stream(
          { folder: "notes_app" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);

      });

      // 3️⃣ Save image URL in DB
      await imageSchema.create({
        imageBase: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        userId,
        noteId: newNote._id
      });

    }

    return NextResponse.json({
      success: true,
      message: "Note created successfully"
    });

  } catch (error) {

    console.log(error);

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
    const id = searchParams.get("id");

    // 1️⃣ Get single note
    if (id) {

      const note = await noteSchema.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: "images",
            localField: "_id",
            foreignField: "noteId",
            as: "images"
          }
        }
      ]);

      return NextResponse.json({
        success: true,
        note: note[0]
      });

    }

    // 2️⃣ Get all notes for user
    if (userId) {

      const notes = await noteSchema.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: "images",
            localField: "_id",
            foreignField: "noteId",
            as: "images"
          }
        }
      ]);

      return NextResponse.json({
        success: true,
        notes
      });

    }

    return NextResponse.json({
      success: false,
      message: "Missing parameters"
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error"
    });

  }

}

export async function PUT(req) {

  try {

    await connectDB();

    const formData = await req.formData();

    const id = formData.get("id");
    const title = formData.get("title");
    const text = formData.get("text");

    const deletedImages = formData.getAll("deletedImages");
    const images = formData.getAll("images");

    // update note
    await noteSchema.findByIdAndUpdate(id, {
      title,
      note: text
    });

    // DELETE IMAGES FROM CLOUDINARY + DB
    if (deletedImages.length > 0) {

      const imagesToDelete = await imageSchema.find({
        _id: { $in: deletedImages }
      });

      for (const img of imagesToDelete) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      await imageSchema.deleteMany({
        _id: { $in: deletedImages }
      });

    }

    // UPLOAD NEW IMAGES
    for (const file of images) {

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {

        cloudinary.uploader.upload_stream(
          { folder: "notes_app" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);

      });

      await imageSchema.create({
        imageBase: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        noteId: id
      });

    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false
    });

  }

}

export async function DELETE(req) {

  try {

    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const images = await imageSchema.find({ noteId: id });

    for (const img of images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await imageSchema.deleteMany({ noteId: id });
    await noteSchema.findByIdAndDelete(id);

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false
    });

  }

}

// export async function PUT(req) {

//   const body = await req.json();
//   const { id, title, text } = body;

//   await noteSchema.findByIdAndUpdate(id, {
//     title,
//    note: text,
//   });

//   return Response.json({  
//     success: true
//   });

// }