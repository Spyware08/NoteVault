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
    const privateNote = formData.get("privateNote") === "true";

    const images = formData.getAll("images");

    // Create note
    const newNote = await noteSchema.create({
      title,
      note,
      userId,
      privateNote
    });

    // Upload images
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

// export async function POST(req) {

//   try {

//     await connectDB();

//     const formData = await req.formData();

//     const title = formData.get("title");
//     const note = formData.get("note");
//     const userId = formData.get("userId");

//     const images = formData.getAll("images");

//     // 1️⃣ Create note
//     const newNote = await noteSchema.create({
//       title,
//       note,
//       userId
//     });

//     // 2️⃣ Upload images to Cloudinary
//     for (const file of images) {

//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const uploadResult = await new Promise((resolve, reject) => {

//         cloudinary.uploader.upload_stream(
//           { folder: "notes_app" },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         ).end(buffer);

//       });

//       // 3️⃣ Save image URL in DB
//       await imageSchema.create({
//         imageBase: uploadResult.secure_url,
//         public_id: uploadResult.public_id,
//         userId,
//         noteId: newNote._id
//       });

//     }

//     return NextResponse.json({
//       success: true,
//       message: "Note created successfully"
//     });

//   } catch (error) {

//     console.log(error);

//     return NextResponse.json({
//       success: false,
//       message: "Server error"
//     });

//   }

// }

export async function GET(req) {

  try {

    await connectDB();

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    const publicNotes = searchParams.get("public");

    // GET SINGLE NOTE
    if (id) {

      const note = await noteSchema.aggregate([

        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },

        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },

        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
          }
        },

        {
          $lookup: {
            from: "images",
            localField: "_id",
            foreignField: "noteId",
            as: "images"
          }
        },

        {
          $project: {
            title: 1,
            note: 1,
            privateNote: 1,
            createdAt: 1,
            images: 1,
            username: "$user.name"
          }
        }

      ]);

      return NextResponse.json({
        success: true,
        note: note[0]
      });

    }

    // GET ALL PUBLIC NOTES
    if (publicNotes) {

      const notes = await noteSchema.aggregate([

        {
          $match: {
            privateNote: false
          }
        },

        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },

        {
          $unwind: "$user"
        },

        {
          $lookup: {
            from: "images",
            localField: "_id",
            foreignField: "noteId",
            as: "images"
          }
        },

        // {
        //   $project: {
        //     title: 1,
        //     note: 1,
        //     privateNote: 1,
        //     createdAt: 1,
        //     images: 1,
        //     username: "$user.name"
        //   }
        // },

        {
          $sort: {
            createdAt: -1
          }
        }

      ]);

      return NextResponse.json({
        success: true,
        notes
      });

    }

    // GET USER NOTES
    if (userId) {

      const notes = await noteSchema
        .find({ userId })
        .sort({ createdAt: -1 })
        .lean();

      for (let note of notes) {
        note.images = await imageSchema.find({ noteId: note._id });
      }

      return NextResponse.json({
        success: true,
        notes
      });

    }

    return NextResponse.json({
      success: false,
      message: "Invalid request"
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
    const privateNote = formData.get("privateNote") === "true";

    const deletedImages = formData.getAll("deletedImages");
    const images = formData.getAll("images");

    await noteSchema.findByIdAndUpdate(id, {
      title,
      note: text,
      privateNote
    });

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

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Note ID is required"
      });
    }

    // find images of note
    const images = await imageSchema.find({ noteId: id });

    // delete images from cloudinary
    for (const img of images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // delete images from db
    await imageSchema.deleteMany({ noteId: id });

    // delete note
    await noteSchema.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully"
    });

  } catch (error) {

    console.log("DELETE ERROR:", error);

    return NextResponse.json({
      success: false,
      message: "Server error"
    });

  }

}

