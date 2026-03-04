"use client";

import { useSelector } from "react-redux";

export default function Home() {

  const user = useSelector((state) => state.user.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">
          Welcome {user?.name}
        </h1>
      </div>
  );
}