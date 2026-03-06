"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Plus, Notebook, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";

export default function Home() {

  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (user === null) {
      router.replace("/auth");
    }

    if (user) {
      fetchNotes();
    }
  }, [user]);

  if (!user) return null;

  const fetchNotes = async () => {
    try {

      const res = await fetch(`/api/noteSchema?userId=${user?.id}`);
      const data = await res.json();

      if (data.success) {
        setNotes(data.notes);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <PageWrapper>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-10">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-12">

          <div>
            <h1 className="text-4xl font-bold">
              Welcome back, {user?.name} 👋
            </h1>

            <p className="text-gray-400 mt-2">
              Capture your thoughts and ideas
            </p>
          </div>

          <button
            onClick={() => router.push("/add-note")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl shadow-lg transition"
          >
            <Plus size={18} />
            Add Note
          </button>

        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-gray-800/60 backdrop-blur p-6 rounded-xl">
            <Notebook className="mb-3 text-blue-400" />
            <h2 className="text-2xl font-bold">{notes.length}</h2>
            <p className="text-gray-400">Total Notes</p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur p-6 rounded-xl">
            <ImageIcon className="mb-3 text-purple-400" />
            <h2 className="text-2xl font-bold">
              {notes.filter(n => n.images?.length > 0).length}
            </h2>
            <p className="text-gray-400">Notes With Images</p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur p-6 rounded-xl">
            <Notebook className="mb-3 text-green-400" />
            <h2 className="text-2xl font-bold">Active</h2>
            <p className="text-gray-400">Your Workspace</p>
          </div>

        </div>

        {/* NOTES */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">
            Your Notes
          </h2>

          {notes.length === 0 && (
            <div className="text-gray-400">
              No notes yet. Create your first one 🚀
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">

            {notes?.map((note, i) => (

              <motion.div
                key={note?._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => router.push(`/note/${note._id}`)}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-xl transition cursor-pointer"
              >

                {/* IMAGE AREA */}

                <div className="w-full h-44 relative overflow-hidden">

                  {note?.images?.length > 0 ? (

                    <img
                      src={note.images[0].imageBase}
                      alt="note"
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">

                      <div className="flex flex-col items-center text-gray-400">
                        <ImageIcon size={28} />
                        <span className="text-xs mt-2">No Image Uploaded yet.</span>
                      </div>

                    </div>

                  )}

                </div>

                {/* CONTENT */}

                <div className="p-5">

                  <h3 className="text-lg font-semibold mb-2">
                    {note.title}
                  </h3>

                  <p className="text-gray-400 text-sm line-clamp-3">
                    {note.note}
                  </p>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </div>

    </PageWrapper>

  );
}