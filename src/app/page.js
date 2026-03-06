"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Plus,
  Notebook,
  Image as ImageIcon,
  Lock,
  MoreVertical,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";

export default function Home() {

  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  const [myNotes, setMyNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {

    if (user === null) {
      router.replace("/auth");
    }

    if (user) {
      fetchMyNotes();
      fetchAllNotes();
    }

  }, [user]);

  if (!user) return null;

  const fetchMyNotes = async () => {

    try {

      const res = await fetch(`/api/noteSchema?userId=${user?.id}`);
      const data = await res.json();

      if (data.success) {
        setMyNotes(data.notes);
      }

    } catch (error) {
      console.log(error);
    }

  };

  const fetchAllNotes = async () => {

    try {

      const res = await fetch(`/api/noteSchema?public=true`);
      const data = await res.json();

      if (data.success) {
        setAllNotes(data.notes?.filter(i => i?.userId != user?.id));
      }

    } catch (error) {
      console.log(error);
    }

  };

  const deleteNote = async (id) => {

    try {

      const res = await fetch(`/api/noteSchema?id=${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (data.success) {
        fetchMyNotes();
        setDeleteModal(null);
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
              Welcome back, {user?.name}
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

        {/* MY NOTES */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">
            My Notes
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">

            <div className="bg-gray-800/60 backdrop-blur p-6 rounded-xl">
              <Notebook className="mb-3 text-blue-400" />
              <h2 className="text-2xl font-bold">{myNotes.length}</h2>
              <p className="text-gray-400">Total Notes</p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur p-6 rounded-xl">
              <ImageIcon className="mb-3 text-purple-400" />
              <h2 className="text-2xl font-bold">
                {myNotes.filter(n => n.images?.length > 0).length}
              </h2>
              <p className="text-gray-400">Notes With Images</p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur p-6 rounded-xl">
              <Lock className="mb-3 text-red-400" />
              <h2 className="text-2xl font-bold">
                {myNotes.filter(n => n.privateNote).length}
              </h2>
              <p className="text-gray-400">Private Notes</p>
            </div>

          </div>

          {myNotes.length === 0 && (
            <div className="text-gray-400">
              No notes yet. Create your first one
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">

            {myNotes.map((note, i) => (

              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-xl transition cursor-pointer"
              >

                {/* THREE DOT BUTTON */}

                <div className="absolute top-2 right-2 z-20  transition">

                  <div className="relative">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === note._id ? null : note._id);
                      }}
                      className="p-1 bg-black/60 rounded"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {menuOpenId === note._id && (

                      <div className="absolute right-0 mt-2 w-28 bg-gray-900 rounded shadow-lg border border-gray-700">

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal(note._id);
                            setMenuOpenId(null);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-600 w-full"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>

                      </div>

                    )}

                  </div>

                </div>

                {/* CLICK AREA */}

                <div onClick={() => router.push(`/note/${note._id}`)}>

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
                          <span className="text-xs mt-2">
                            No Image Uploaded yet.
                          </span>
                        </div>

                      </div>

                    )}

                  </div>

                  <div className="p-5">

                    <h3 className="text-gray-300 font-semibold mb-2 flex items-center gap-2">
                      Title: {note.title}
                      {note.privateNote && (
                        <Lock size={14} className="text-red-400" />
                      )}
                    </h3>

                    <p className="ml-1 text-gray-400 text-sm line-clamp-3">
                      {note.note}
                    </p>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        {/* PUBLIC NOTES */}

        <div className="my-16">

          <h2 className="text-2xl font-semibold mb-6">
            All Public Notes
          </h2>

          {allNotes.length === 0 && (
            <div className="text-gray-400">
              No public notes available
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">

            {allNotes.map((note, i) => (

              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => router.push(`/public-note/${note._id}`)}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-xl transition cursor-pointer"
              >

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
                        <span className="text-xs mt-2">
                          No Image Uploaded yet.
                        </span>
                      </div>

                    </div>

                  )}

                </div>

                <div className="p-5">

                  <h4 className="text-lg font-semibold mb-1">
                    By: {note.user?.name}
                  </h4>

                  <h3 className="text-gray-300 font-semibold mb-1">
                    Title: {note.title}
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

      {/* DELETE MODAL */}

      {deleteModal && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-gray-900 p-6 rounded-xl w-80 border border-gray-700">

            <h2 className="text-lg font-semibold mb-4">
              Delete Note
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteNote(deleteModal)}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </PageWrapper>

  );

}