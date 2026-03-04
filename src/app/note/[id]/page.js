"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotePage() {

  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    const res = await fetch(`/api/noteSchema?id=${id}`);
    const data = await res.json();

    console.log(data);
    if (data.success) {
      setNote(data?.note);
      setTitle(data?.note?.title);
      setText(data?.note?.note);
    }
  };

  const updateNote = async () => {

    const res = await fetch("/api/noteSchema", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        title,
        text,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setEditMode(false);
      fetchNote();
    }
  };

  if (!note) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">

      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl">

        <img
          src={note?.images[0]?.imageBase}
          className="w-full h-60 object-cover rounded-lg mb-6"
        />

        {editMode ? (
          <>
            <input
              className="w-full p-2 bg-gray-700 rounded mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full p-2 bg-gray-700 rounded mb-4"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              onClick={updateNote}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Update
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">
              {note.title}
            </h1>

            <p className="text-gray-300 mb-6">
              {note.note}
            </p>

            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Edit
            </button>
          </>
        )}

      </div>

    </div>
  );
}