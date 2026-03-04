"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user === null) {
      router.replace("/auth");
    }
    if (user) {
      fetchNotes();
    }
  }, [user, router]);

  if (!user) return null;


  const [notes, setNotes] = useState([]);

    const fetchNotes = async () => {

      try {

        const res = await fetch(`/api/noteSchema?userId=${user?.id}`);
        const data = await res.json();

        if (data.success) {
          console.log(data)
          setNotes(data.notes);
        }

      } catch (error) {
        console.log(error);
      }

    };

   



  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">

      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Welcome {user?.name} 👋
        </h1>
      </div>

      {/* Add Note Card */}
      <div className="mb-10">
        <div className="bg-gray-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Add New Note</h2>
            <p className="text-gray-400">Save notes with images</p>
          </div>

          <button
            onClick={() => router.push("/add-note")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">
          Your Notes
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {notes?.map((note) => (
            <div
              key={note?._id}
              onClick={() => router.push(`/note/${note._id}`)}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
            >

                <img
                  src={note?.images[0]?.imageBase|| "https://via.placeholder.com/400x250?text=No+Image"}
                  alt="note"
                  className="w-full h-40 object-cover"
                />

              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {note.title}
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  {note.note}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}