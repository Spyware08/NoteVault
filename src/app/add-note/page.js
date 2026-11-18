
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  Plus,
  ImagePlus,
  Trash2,
  ArrowLeft,
  NotebookPen,
  Lock,
  Upload,
  FileText,
  ShieldCheck,
  X,
  Save,
} from "lucide-react";

import PageWrapper from "@/components/PageWrapper";

export default function AddNote() {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    text: "",
    privateNote: false,
  });

  const [images, setImages] = useState([null]);
  const [submitting, setSubmitting] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // HANDLE IMAGE
  const handleImageChange = (index, file) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  };

  // ADD IMAGE FIELD
  const addImageField = () => {
    setImages([...images, null]);
  };

  // REMOVE IMAGE FIELD
  const removeImageField = (index) => {
    const updatedImages = images.filter(
      (_, i) => i !== index
    );

    setImages(updatedImages);
  };

  // SUBMIT NOTE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter note title");
      return;
    }

    if (!form.text.trim()) {
      toast.error("Please enter your note");
      return;
    }

    if (!user?.id) {
      toast.error("Please login first");
      return;
    }

    try {
      setSubmitting(true);

      const loadingToast = toast.loading("Uploading note...");

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("note", form.text);
      formData.append("privateNote", form.privateNote);
      formData.append("userId", user?.id);

      images.forEach((img) => {
        if (img) {
          formData.append("images", img);
        }
      });

      const res = await fetch("/api/noteSchema", {
        method: "POST",
        body: formData,
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <main className="min-h-screen bg-[#171819] text-white">

        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#343536] bg-[#1D1F20]/95 px-5 backdrop-blur-xl sm:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#A66A35]/40 bg-[#33291F]">
              <img
                src="/icon.png"
                alt="NoteVault"
                className="h-8 w-8 object-contain"
              />
            </div>

            <h1 className="text-xl font-extrabold tracking-tight">
              Note<span className="text-[#E88A35]">Vault</span>
            </h1>

          </div>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-md border border-[#414141] bg-[#252728] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-[#E88A35] hover:text-[#F59B45]"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>

        </header>

        {/* MAIN CONTENT */}
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">

          {/* PAGE TITLE */}
          <div className="mb-8">

            <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#E88A35]">
              PERSONAL WORKSPACE
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Create New Note
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Capture your thoughts, organize your ideas, and
              keep everything in one place.
            </p>

          </div>

          {/* FORM CONTAINER */}
          <div className="overflow-hidden rounded-xl border border-[#383A3B] bg-[#202223] shadow-2xl shadow-black/20">

            {/* FORM HEADER */}
            <div className="flex items-center justify-between border-b border-[#383A3B] bg-[#252728] px-5 py-5 sm:px-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#A66A35]/40 bg-[#392C20]">
                  <NotebookPen
                    size={22}
                    className="text-[#F59B45]"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    Note Information
                  </h3>

                  <p className="text-xs text-gray-500">
                    Fill in the details below
                  </p>
                </div>

              </div>

              <span className="hidden rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 sm:block">
                New Entry
              </span>

            </div>

            {/* FORM BODY */}
            <form
              onSubmit={handleSubmit}
              className="space-y-7 p-5 sm:p-7"
            >

              {/* TITLE */}
              <div className="space-y-2">

                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                  <FileText
                    size={16}
                    className="text-[#E88A35]"
                  />
                  Note Title
                  <span className="text-red-400">*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter your note title..."
                  className="w-full rounded-lg border border-[#414141] bg-[#252728] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-[#555555] focus:border-[#E88A35] focus:ring-2 focus:ring-[#E88A35]/10"
                />

                <p className="text-xs text-gray-600">
                  Give your note a meaningful title.
                </p>

              </div>

              {/* NOTE DESCRIPTION */}
              <div className="space-y-2">

                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                  <NotebookPen
                    size={16}
                    className="text-[#E88A35]"
                  />
                  Note Description
                  <span className="text-red-400">*</span>
                </label>

                <textarea
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Start writing your thoughts here..."
                  className="w-full resize-y rounded-lg border border-[#414141] bg-[#252728] px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-gray-600 hover:border-[#555555] focus:border-[#E88A35] focus:ring-2 focus:ring-[#E88A35]/10"
                />

                <div className="flex justify-end">
                  <span className="text-xs text-gray-600">
                    {form.text.length} characters
                  </span>
                </div>

              </div>

              {/* VISIBILITY SECTION */}
              <div className="rounded-lg border border-[#414141] bg-[#252728] p-4 sm:p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#392C20]">
                    <Lock
                      size={19}
                      className="text-[#F59B45]"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">
                      Note Privacy
                    </h4>

                    <p className="mt-1 text-xs text-gray-500">
                      Control who can access your note.
                    </p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">

                    <input
                      type="checkbox"
                      name="privateNote"
                      checked={form.privateNote}
                      onChange={handleChange}
                      className="peer sr-only"
                    />

                    <div className="h-6 w-11 rounded-full border border-[#555555] bg-[#444444] transition peer-checked:border-[#E88A35] peer-checked:bg-[#E88A35] after:absolute after:left-[3px] after:top-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />

                  </label>

                </div>

                <div className="mt-4 border-t border-[#414141] pt-3">

                  <div className="flex items-center gap-2 text-xs">

                    {form.privateNote ? (
                      <>
                        <Lock
                          size={14}
                          className="text-[#F59B45]"
                        />

                        <span className="text-[#F59B45]">
                          Private Note Enabled
                        </span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck
                          size={14}
                          className="text-emerald-400"
                        />

                        <span className="text-emerald-400">
                          Private Mode Disabled
                        </span>
                      </>
                    )}

                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    {form.privateNote
                      ? "This note will be marked as private."
                      : "This note will follow your existing public visibility settings."}
                  </p>

                </div>

              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div className="space-y-4">

                <div className="flex items-center justify-between">

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                      <ImagePlus
                        size={17}
                        className="text-[#E88A35]"
                      />
                      Attach Images
                    </label>

                    <p className="mt-1 text-xs text-gray-500">
                      Add images to make your notes more visual.
                    </p>
                  </div>

                  <span className="rounded-md border border-[#414141] bg-[#252728] px-3 py-1 text-xs text-gray-400">
                    {images.filter(Boolean).length} Selected
                  </span>

                </div>

                {/* IMAGE INPUTS */}
                <div className="space-y-3">

                  {images.map((img, index) => (

                    <div
                      key={index}
                      className="flex flex-col gap-3 rounded-lg border border-[#414141] bg-[#252728] p-4 sm:flex-row sm:items-center"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#392C20]">
                        <ImagePlus
                          size={20}
                          className="text-[#F59B45]"
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <label className="mb-2 block text-xs font-semibold text-gray-300">
                          Image {index + 1}
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageChange(
                              index,
                              e.target.files[0] || null
                            )
                          }
                          className="w-full cursor-pointer text-xs text-gray-400 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#E88A35] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#171717] hover:file:bg-[#F59B45]"
                        />

                        {img && (
                          <p className="mt-2 truncate text-xs text-emerald-400">
                            {img.name}
                          </p>
                        )}

                      </div>

                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeImageField(index)
                          }
                          className="flex items-center justify-center gap-2 self-end rounded-md border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 transition hover:bg-red-500/20 sm:self-center"
                          title="Remove image"
                        >
                          <Trash2 size={16} />
                          <span className="text-xs sm:hidden">
                            Remove
                          </span>
                        </button>
                      )}

                    </div>

                  ))}

                </div>

                {/* ADD IMAGE BUTTON */}
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#A66A35]/60 bg-[#30271F] py-3 text-sm font-semibold text-[#F59B45] transition hover:border-[#F59B45] hover:bg-[#392C20]"
                >
                  <Plus size={17} />
                  Add Another Image
                </button>

              </div>

              {/* DIVIDER */}
              <div className="border-t border-[#383A3B]" />

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#484848] bg-[#252728] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-gray-500 hover:bg-[#303233]"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#E88A35] px-8 py-3 text-sm font-bold text-[#171717] shadow-lg shadow-orange-950/20 transition hover:bg-[#F59B45] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#171717]/30 border-t-[#171717]" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Note
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

          {/* BOTTOM INFO */}
          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-gray-600 sm:flex-row">

            <p>
              NoteVault · Personal Workspace
            </p>

            <div className="flex items-center gap-2">
              <ShieldCheck
                size={14}
                className="text-emerald-500"
              />
              Secure Note Management
            </div>

          </div>

        </div>

      </main>
    </PageWrapper>
  );
}
