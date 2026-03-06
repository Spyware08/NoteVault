"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Plus, ImagePlus, Trash2, ArrowLeft } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

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

  const handleImageChange = (index, file) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  };

  const addImageField = () => {
    setImages([...images, null]);
  };

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
        toast.success("Note added successfully 🎉");
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
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-6">

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 w-full max-w-xl p-8 rounded-2xl shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Add New Note</h1>

            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Note title"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />

            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              rows="4"
              placeholder="Write your note..."
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />

            {/* Images */}
            <div className="space-y-3">

              <p className="text-sm text-gray-400 flex items-center gap-2">
                <ImagePlus size={16} />
                Upload Images
              </p>

              {images.map((img, index) => (

                <div key={index} className="flex gap-3 items-center">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    className="flex-1 text-sm"
                  />

                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                </div>

              ))}

              <button
                type="button"
                onClick={addImageField}
                className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
              >
                <Plus size={16} />
                Add Image
              </button>

            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition"
            >
              <Plus size={18} />
              Save Note
            </button>

          </form>

        </div>

      </div>
    </PageWrapper>
  );
}