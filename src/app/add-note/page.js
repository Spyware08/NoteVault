"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function AddNote() {

  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    text: "",
  });

  const [images, setImages] = useState([null]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle individual image change
  const handleImageChange = (index, file) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  };

  // Add new image input
  const addImageField = () => {
    setImages([...images, null]);
  };

  // Remove image input
  const removeImageField = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const loadingToast = toast.loading("Uploading...");

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("note", form.text);
      formData.append("userId", user?.id);

      images.forEach((img) => {
        if (img) {
          formData.append("images", img);
        }
      });

      const res = await fetch("/api/noteSchema", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Note added successfully");
        router.push("/");
      } else {
        toast.error("Failed to add note");
      }

    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }

  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">

      <div className="bg-gray-800 w-full max-w-lg p-8 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold mb-6">
          Add New Note
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Note title"
            className="w-full p-3 bg-gray-700 rounded"
          />

          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            rows="4"
            placeholder="Write your note"
            className="w-full p-3 bg-gray-700 rounded"
          />

          {/* Dynamic Image Inputs */}
          <div className="space-y-3">

            {images.map((img, index) => (

              <div key={index} className="flex gap-2 items-center">

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(index, e.target.files[0])
                  }
                  className="flex-1"
                />

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="bg-red-500 px-3 py-1 rounded"
                  >
                    X
                  </button>
                )}

              </div>

            ))}

            <button
              type="button"
              onClick={addImageField}
              className="bg-green-600 px-4 py-2 rounded"
            >
              + Add Image
            </button>

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-3 rounded-lg"
          >
            Save Note
          </button>

        </form>

      </div>

    </div>
  );
}