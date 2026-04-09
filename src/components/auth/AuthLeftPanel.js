"use client";

import { NotebookPen, Image, Shield } from "lucide-react";

export default function AuthLeftPanel({
  title = "NoteVault",
  subtitle = "A modern place to store your thoughts, ideas and images."
}) {

  return (
    <div className="hidden lg:flex flex-col justify-center px-20">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <NotebookPen size={40} className="text-blue-500" />
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-10 text-lg">
        {subtitle}
      </p>

      {/* Features */}
      <div className="space-y-6">

        <div className="flex items-center gap-4">
          <NotebookPen className="text-blue-400" />
          <p>Create and organize notes easily</p>
        </div>

        <div className="flex items-center gap-4">
          <Image className="text-purple-400" />
          <p>Add images to make your notes visual</p>
        </div>

        <div className="flex items-center gap-4">
          <Shield className="text-green-400" />
          <p>Your data is secure and always accessible</p>
        </div>

      </div>

    </div>
  );
}