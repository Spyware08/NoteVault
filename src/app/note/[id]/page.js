"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotePage() {
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [privateNote, setPrivateNote] = useState(false);

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
      setPrivateNote(data.note.privateNote);
      setExistingImages(data.note.images || []);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const deleteExistingImage = (imgId) => {
    setExistingImages((prev) => prev.filter((img) => img._id !== imgId));
    setDeletedImages((prev) => [...prev, imgId]);
  };

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
    formData.append("privateNote", privateNote);

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
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">

      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-5 sm:p-8">

        {/* TITLE */}
        {editMode ? (
          <input
            className="w-full p-3 bg-gray-700 rounded mb-4 text-base sm:text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            {note.title}
          </h1>
        )}

        {/* TEXT */}
        {editMode ? (
          <textarea
            className="w-full p-3 bg-gray-700 rounded mb-6 text-sm sm:text-base"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
            {note.note}
          </p>
        )}

        {/* PRIVATE CHECKBOX */}
        {editMode && (
          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              checked={privateNote}
              onChange={(e) => setPrivateNote(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            <label className="text-sm text-gray-300">
              Make this note private
            </label>
          </div>
        )}

        {/* IMAGE UPLOAD */}
        {editMode && (
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="mb-6 w-full text-sm"
          />
        )}

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">

            {existingImages.map((img) => (
              <div key={img._id} className="relative">

                <img
                  src={img.imageBase}
                  onClick={() => setPreviewImage(img.imageBase)}
                  className="w-full h-52 sm:h-40 object-cover rounded-lg cursor-pointer"
                />

                {editMode && (
                  <button
                    onClick={() => deleteExistingImage(img._id)}
                    className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded text-xs"
                  >
                    X
                  </button>
                )}

              </div>
            ))}

          </div>
        )}

        {/* NEW IMAGES */}
        {newImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">

            {newImages.map((file, index) => (
              <div key={index} className="relative">

                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-52 sm:h-40 object-cover rounded-lg"
                />

                <button
                  onClick={() => deleteNewImage(index)}
                  className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded text-xs"
                >
                  X
                </button>

              </div>
            ))}

          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

          {editMode ? (
            <>
              <button
                onClick={updateNote}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Update
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
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
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        >
          <img
            src={previewImage}
            className="max-h-[85%] max-w-[95%] rounded-lg"
          />
        </div>
      )}
    </div>
  );
}