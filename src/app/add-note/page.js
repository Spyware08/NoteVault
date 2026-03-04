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

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    // convert image → base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = (error) => {
                reject(error);
            };

        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const loadingToast = toast.loading("Please wait...");

            let imageBase = null;

            if (image) {
                imageBase = await convertToBase64(image);
            }

            const res = await fetch("/api/noteSchema", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: form.title,
                    note: form.text,
                    userId: user?.id,
                    image: imageBase
                }),
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

                    {/* Title */}
                    <div>
                        <label className="block mb-2 text-sm text-gray-300">
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-lg bg-gray-700 outline-none"
                            placeholder="Enter note title"
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block mb-2 text-sm text-gray-300">
                            Note
                        </label>

                        <textarea
                            name="text"
                            value={form.text}
                            onChange={handleChange}
                            rows="4"
                            required
                            className="w-full p-3 rounded-lg bg-gray-700 outline-none"
                            placeholder="Write your note..."
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block mb-2 text-sm text-gray-300">
                            Upload Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="w-full text-sm text-gray-400"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">

                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg"
                        >
                            Save Note
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}