
"use client";

import {
  NotebookPen,
  Image as ImageIcon,
  Shield,
} from "lucide-react";

export default function AuthLeftPanel({
  title = "NoteVault",
  subtitle = "A modern place to store your thoughts, ideas and images.",
}) {
  const features = [
    {
      icon: NotebookPen,
      text: "Create and organize notes easily",
    },
    {
      icon: ImageIcon,
      text: "Add images to make your notes visual",
    },
    {
      icon: Shield,
      text: "Your data is secure and always accessible",
    },
  ];

  return (
    <div className="flex w-full flex-col items-center justify-center text-center">

      {/* LOGO */}
      <div className="mb-5 flex items-center justify-center gap-3">

        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#A66A35]/40 bg-[#33291F]">
          <img
            src="/icon.png"
            alt="NoteVault"
            className="h-11 w-11 object-contain"
          />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          {title}
        </h1>

      </div>

      {/* DESCRIPTION */}
      <p className="mb-8 max-w-md text-base leading-7 text-gray-400">
        {subtitle}
      </p>

      {/* FEATURES */}
      <div className="w-full max-w-md space-y-4">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl border border-[#383A3B] bg-[#202223] px-5 py-4 text-left transition duration-300 hover:border-[#A66A35] hover:bg-[#252728]"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#A66A35]/30 bg-[#33291F]">
                <Icon
                  size={20}
                  className="text-[#E88A35]"
                />
              </div>

              <p className="text-sm font-medium text-gray-300">
                {feature.text}
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
}
