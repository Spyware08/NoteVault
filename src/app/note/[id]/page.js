"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotePage() {

  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {

    const res = await fetch(`/api/noteSchema?id=${id}`);
    const data = await res.json();

    if (data.success) {

      setNote(data.note);
      setTitle(data.note.title);
      setText(data.note.note);
      setExistingImages(data.note.images || []);

    }
  };

  // select images
  const handleImageChange = (e) => {

    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);

  };

  // delete existing image
  const deleteExistingImage = (imgId) => {

    setExistingImages((prev) => prev.filter((img) => img._id !== imgId));
    setDeletedImages((prev) => [...prev, imgId]);

  };

  // delete newly added image
  const deleteNewImage = (index) => {

    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);

  };

  const updateNote = async () => {

    const formData = new FormData();

    formData.append("id", id);
    formData.append("title", title);
    formData.append("text", text);

    deletedImages.forEach((imgId) => {
      formData.append("deletedImages", imgId);
    });

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    const res = await fetch("/api/noteSchema", {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {

      setEditMode(false);
      setNewImages([]);
      setDeletedImages([]);
      fetchNote();

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
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8">

        {/* TITLE */}
        {editMode ? (
          <input
            className="w-full p-3 bg-gray-700 rounded mb-4 text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="text-3xl font-bold mb-4">
            {note.title}
          </h1>
        )}

        {/* TEXT */}
        {editMode ? (
          <textarea
            className="w-full p-3 bg-gray-700 rounded mb-6"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <p className="text-gray-300 mb-6 leading-relaxed">
            {note.note}
          </p>
        )}

        {/* IMAGE UPLOAD */}
        {editMode && (
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="mb-6"
          />
        )}

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

            {existingImages.map((img) => (

              <div key={img._id} className="relative">

                <img
                  src={img.imageBase}
                  onClick={() => setPreviewImage(img.imageBase)}
                  className="w-full h-40 object-cover rounded-lg cursor-pointer"
                />

                {editMode && (
                  <button
                    onClick={() => deleteExistingImage(img._id)}
                    className="absolute top-2 right-2 bg-red-600 px-2 rounded"
                  >
                    X
                  </button>
                )}

              </div>

            ))}

          </div>
        )}

        {/* NEW IMAGES PREVIEW */}
        {newImages.length > 0 && (

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

            {newImages.map((file, index) => (

              <div key={index} className="relative">

                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-40 object-cover rounded-lg"
                />

                <button
                  onClick={() => deleteNewImage(index)}
                  className="absolute top-2 right-2 bg-red-600 px-2 rounded"
                >
                  X
                </button>

              </div>

            ))}

          </div>

        )}

        {/* BUTTONS */}
        <div className="flex gap-4">

          {editMode ? (
            <>
              <button
                onClick={updateNote}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Update
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Edit Note
            </button>
          )}

        </div>

      </div>

      {/* IMAGE PREVIEW */}
      {previewImage && (

        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >

          <img
            src={previewImage}
            className="max-h-[80%] max-w-[90%] rounded-lg"
          />

        </div>

      )}

    </div>
  );

}