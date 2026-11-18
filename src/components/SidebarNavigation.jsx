
"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  NotebookPen,
  Globe,
} from "lucide-react";

export default function SidebarNavigation() {
  const [active, setActive] = useState("dashboard");

  const navItems = [
    { name: "Dashboard", id: "dashboard", icon: LayoutDashboard },
    { name: "My Notes", id: "my-notes", icon: NotebookPen },
    { name: "Public Notes", id: "public-notes", icon: Globe },
  ];

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );

        if (visible.length) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -65% 0px",
        threshold: [0, 0.1, 0.3, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActive(id);
  };

  return (
    <nav className="space-y-2">
      {navItems.map(({ name, id, icon: Icon }) => {
        const isActive = active === id;

        return (
          <button
            key={id}
            onClick={() => handleScroll(id)}
            className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "border-[#E88A35]/30 bg-[#E88A35]/15 text-[#F59B45]"
                : "border-transparent text-gray-400 hover:border-[#E88A35]/20 hover:bg-[#E88A35]/10 hover:text-[#F59B45]"
            }`}
          >
            <Icon
              size={19}
              className={
                isActive
                  ? "text-[#E88A35]"
                  : "text-gray-500 group-hover:text-[#E88A35]"
              }
            />

            <span>{name}</span>

            {isActive && (
              <span className="ml-auto h-2 w-2 rounded-full bg-[#E88A35]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
