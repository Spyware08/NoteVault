"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicNotePage() {
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    const res = await fetch(`/api/noteSchema?id=${id}`);
    const data = await res.json();

    if (data.success) {
      setNote(data.note);
    }
  };

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">

      {/* Main Card */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-5 sm:p-8">

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Title: {note.title}
        </h1>

        {/* USER */}
        {note.username && (
          <p className="text-sm text-gray-400 mb-3">
            By: {note.username}
          </p>
        )}

        {/* TEXT */}
        <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
          {note.note}
        </p>

        {/* IMAGES */}
        {note.images?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            {note.images.map((img) => (
              <img
                key={img._id}
                src={img.imageBase}
                onClick={() => setPreviewImage(img.imageBase)}
                className="w-full h-52 sm:h-40 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
              />
            ))}

          </div>
        )}

      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        >
          <img
            src={previewImage}
            className="max-h-[85%] max-w-[95%] rounded-lg shadow-xl"
          />
        </div>
      )}
    </div>
  );
}